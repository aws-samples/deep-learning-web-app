#!/usr/bin/env bash

# Exit when any command fails
set -e

# Run this script with all parameters. Example usage:
# ./deploy-training-pipeline.sh deep-learning-backend aws-us-east-1-xxx-deep-learning-infra-training aws-us-east-1-xxx-deep-learning-infra-deployment youremail@domain.com us-east-1

STACK_NAME=$1
TRAINING_BUCKET_NAME=$2
DEPLOYMENT_BUCKET=$3
ADMIN_EMAIL=$4
REGION=$5

echo "Building ..."
sam build --use-container
echo "Building...Done"

chmod -R 755 .aws-sam

echo "Deploying..."
sam deploy \
    --region ${REGION} \
    --s3-bucket ${DEPLOYMENT_BUCKET} \
    --stack-name ${STACK_NAME} \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides \
    TrainingBucketName=${TRAINING_BUCKET_NAME} \
    ECRTrainingImageRepoName="dnn" \
    TrainingInstanceSize="ml.c5.2xlarge" \
    EndpointInstanceSize="ml.t2.medium" \
    MaxNumberEndpoint="2" \
    EmailAddress=${ADMIN_EMAIL} \
    --no-fail-on-empty-changeset

echo "Deploying...Done"

echo "Backend Stack Name: ${STACK_NAME}"
