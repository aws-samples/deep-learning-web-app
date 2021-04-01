# Test command:
# sam local invoke StartTrainingFunction -e ./tests/local_invoke_test_jsons/start_job.json --env-vars env.json
# Create env.json with your resource names
import os
import copy
import datetime
import json
from enum import Enum

import boto3

from utils import create_response_obj

sf_client = boto3.client('stepfunctions')


class Mode(Enum):
    MODEL = 'MODEL'
    HPO = 'HPO'
    NONE = 'NONE'


print(f"os.environ.get('MODE', 'NONE') = {os.environ.get('MODE', 'NONE')}")

MODE = Mode(os.environ.get('MODE', 'NONE'))
TRAINING_STATE_MACHINE_ARN = os.environ.get('TRAINING_STATE_MACHINE_ARN', '')
ACCOUNT_ID = os.environ.get('ACCOUNT_ID', '')
REGION = os.environ.get('REGION', '')
ECR_TRAINING_IMAGE_REPO_NAME = os.environ.get('ECR_TRAINING_IMAGE_REPO_NAME', '')
TRAINING_BUCKET_NAME = os.environ.get('TRAINING_BUCKET_NAME', '')
TRAINING_INSTANCE_SIZE = os.environ.get('TRAINING_INSTANCE_SIZE', '')
ENDPOINT_INSTANCE_SIZE = os.environ.get('ENDPOINT_INSTANCE_SIZE', '')
SAGEMAKER_EXECUTION_ROLE_ARN = os.environ.get('SAGEMAKER_EXECUTION_ROLE_ARN', '')

training_image = '{}.dkr.ecr.{}.amazonaws.com/{}:latest'.format(ACCOUNT_ID, REGION, ECR_TRAINING_IMAGE_REPO_NAME)
s3_path = 's3://{}/'.format(TRAINING_BUCKET_NAME)
training_instance_size = TRAINING_INSTANCE_SIZE
endpoint_instance = ENDPOINT_INSTANCE_SIZE
sagemaker_execution_role_arn = SAGEMAKER_EXECUTION_ROLE_ARN

# Template for input. Some values need to be replaced in Lambda
template_input = {
    "Training": {
        "AlgorithmSpecification": {
            "TrainingImage": training_image,
            "TrainingInputMode": "File"
        },
        "OutputDataConfig": {
            "S3OutputPath": s3_path + "models",
        },
        "StoppingCondition": {
            "MaxRuntimeInSeconds": 86400 * 5  # Use 5 days, you can raise the ticket to support to have 28 day max
        },
        "ResourceConfig": {
            "InstanceCount": 2,
            "InstanceType": training_instance_size,
            "VolumeSizeInGB": 30
        },
        "RoleArn": sagemaker_execution_role_arn,
        "InputDataConfig": [
            {
                "DataSource": {
                    "S3DataSource": {
                        "S3DataType": "S3Prefix",
                        "S3Uri": "TO_BE_REPLACED_IN_LAMBDA",
                        "S3DataDistributionType": "FullyReplicated"
                    }
                },
                "ChannelName": "training"
            }
        ],
        "HyperParameters": {},
        "TrainingJobName": "TO_BE_REPLACED_IN_LAMBDA",
        "DebugHookConfig": {
            "S3OutputPath": s3_path + "outputs"
        }
    },
    "Create Model": {
        "ModelName": "TO_BE_REPLACED_IN_LAMBDA",
        "PrimaryContainer": {
            "Image": training_image,
            "Environment": {
                # "SAGEMAKER_PROGRAM": "mnist.py", # TBD
                # "SAGEMAKER_SUBMIT_DIRECTORY": "s3://sagemaker-us-east-1-561912387782/training-pipeline-2020-06-05-11-22-45/estimator-source/source/sourcedir.tar.gz", # TBD
                # "SAGEMAKER_ENABLE_CLOUDWATCH_METRICS": "false",
                # "SAGEMAKER_CONTAINER_LOG_LEVEL": "20",
                # "SAGEMAKER_REGION": "us-east-1"
            },
            "ModelDataUrl.$": "ALREADY_SUPPLIED_IN_ASL"
        },
        "ExecutionRoleArn": sagemaker_execution_role_arn
    },
    "Configure Endpoint": {
        "EndpointConfigName": "TO_BE_REPLACED_IN_LAMBDA",  # #TBD
        "ProductionVariants": [
            {
                "InitialInstanceCount": 1,
                "InstanceType": endpoint_instance,  # TBD
                "ModelName": "TO_BE_REPLACED_IN_LAMBDA",  # TBD
                "VariantName": "AllTraffic"
            }
        ]
    },
    "Deploy": {
        "EndpointConfigName": "TO_BE_REPLACED_IN_LAMBDA",
        "EndpointName": "TO_BE_REPLACED_IN_LAMBDA"
    }
}


def post(event, context):
    print('===Starting start_job function ===')

    # Get parameters
    if event['body'] is None:
        print('No parameter passed. Returning error.')
        return create_response_obj(400, {
            'errorMessage': 'No parameter passed in the POST body'
        })

    body = json.loads(event['body'])

    # Input for Step Function
    sf_input = copy.deepcopy(template_input)
    sf_input['Mode'] = MODE.value

    # Input source for training
    s3_data_source = sf_input['Training']['InputDataConfig'][0]['DataSource']['S3DataSource']
    s3_filename = str(body['trainingDataS3Name'])
    s3_data_source['S3Uri'] = f"{s3_path}public/{s3_filename}"
    print(f"Training dataset is from: {s3_data_source['S3Uri']}")

    if MODE == Mode.MODEL:
        print('Training new model mode inited')

        name = MODE.value.lower() + '-' + body['modelName']
        # Hyper parameters
        sf_input['Training']['HyperParameters'] = {
            'final_training': 'True',
            # Common parameters
            'target': str(body['target']),
            'batch_normalization': str(body['batchNormalization']),
            'include_dropout': str(body['includeDropout']),
            'loss_metric': str(body['lossMetric']),
            'monitor_metric': str(body['monitorMetric']),
            'lr_update_patience': str(body['lrUpdatePatience']),
            'early_stopping_patience': str(body['earlyStoppingPatience']),
            # Train new model specific parameter
            'nb_epochs_f': str(body['nbEpochsF']),
            'batch_size_f': str(body['batchSizeF']),
            'optimizer_f': str(body['optimizerF']),
            'last_activation_f': str(body['lastActivationF']),
            'num_layers_f': str(len(body['nodes'])),
            'nodes': str(body['nodes'][:-1])
        }

        # Use the same name for all component for ease of tracing
        sf_input['Training']['TrainingJobName'] = name
        sf_input['Create Model']['ModelName'] = name
        sf_input['Configure Endpoint']['EndpointConfigName'] = name
        sf_input['Configure Endpoint']['ProductionVariants'][0]['ModelName'] = name
        sf_input['Deploy']['EndpointConfigName'] = name
        sf_input['Deploy']['EndpointName'] = name
    elif MODE == Mode.HPO:
        print('HPO mode inited')

        now = datetime.datetime.now()
        name = MODE.value.lower() + '-' + now.strftime("%Y-%m-%d-%H-%M-%S")

        del sf_input['Create Model']
        del sf_input['Configure Endpoint']
        del sf_input['Deploy']

        sf_input['Training']['TrainingJobName'] = name
        sf_input['Training']['HyperParameters'] = {
            'final_training': 'False',
            # Common parameters
            'target': str(body['target']),
            'batch_normalization': str(body['batchNormalization']),
            'include_dropout': str(body['includeDropout']),
            'loss_metric': str(body['lossMetric']),
            'monitor_metric': str(body['monitorMetric']),
            'lr_update_patience': str(body['lrUpdatePatience']),
            'early_stopping_patience': str(body['earlyStoppingPatience']),
            # HPO-specific parameters
            'dropout': str(body['dropout']),
            'train_validation_split': str(body['trainValidationSplit']),
            'used_data_percentage': str(body['usedDataPercentage']),
            'choice_of_node_numbers': str(body['choiceOfNodeNumbers']),
            'batch_size': str(body['batchSize']),
            'MAX_EVALS': str(body['maxEval']),
            'randstate': str(body['randomState']),
            'num_layers_low': str(body['numLayersLow']),
            'num_layers_high': str(body['numLayersHigh']),
            'nb_epochs': str(body['nbEpochs']),
            'optimizer': str(body['optimizers']),
            'last_activation': str(body['activationFunctions']),
        }

    print('====sf_input===')
    print(json.dumps(sf_input, indent=1))

    print(f"TRAINING_STATE_MACHINE_ARN = {TRAINING_STATE_MACHINE_ARN}")

    sf_response = sf_client.start_execution(
        stateMachineArn=TRAINING_STATE_MACHINE_ARN,
        input=json.dumps(sf_input)
    )

    print(f"sf_response = {sf_response}")

    return create_response_obj(200, sf_response)
