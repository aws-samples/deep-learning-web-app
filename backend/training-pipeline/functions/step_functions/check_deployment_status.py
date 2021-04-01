# Example test command:
# sam local invoke CheckDeploymentStatusFunction -e ./tests/local_invoke_test_jsons/check_deployment_status.json

import os
import boto3

client = boto3.client('sagemaker')
MAX_NUMBER_ENDPOINT = os.environ.get('MAX_NUMBER_ENDPPOINT', 5)


def get_endpoint_name(endpoint_arn):
    backslash_index = endpoint_arn.rfind('/')
    return endpoint_arn[backslash_index+1:]


def lambda_handler(event, context):
    endpoint_arn = event['EndpointArn']
    print(f"endpoint_arn = {endpoint_arn}")

    endpoint_name = get_endpoint_name(endpoint_arn)
    print(f"endpoint_name = {endpoint_name}")

    response = client.describe_endpoint(
        EndpointName=endpoint_name
    )
    print(f'Endpoint status is {response["EndpointStatus"]}')
    return response['EndpointStatus'] == 'InService'
