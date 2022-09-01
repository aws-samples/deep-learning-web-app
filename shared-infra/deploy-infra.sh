#!/usr/bin/env bash

# Example usage
# ./deploy-infra.sh deep-learning-infra

STACK_NAME=$1
REGION=$2

aws cloudformation deploy \
  --region ${REGION} \
  --template template.yml \
  --stack-name ${STACK_NAME}

# These results should be passed to Frontend and Backend stack
echo "########################"
echo "## Deployment Bucket:"
echo "########################"
DeploymentBucketName=$(aws cloudformation describe-stacks --stack-name ${STACK_NAME} --query 'Stacks[0].Outputs[?OutputKey==`DeploymentBucketName`].OutputValue' --output text)
echo "$DeploymentBucketName"

echo "########################"
echo "## Training Bucket:"
echo "########################"
TrainingBucketName=$(aws cloudformation describe-stacks --stack-name ${STACK_NAME} --query 'Stacks[0].Outputs[?OutputKey==`TrainingBucketName`].OutputValue' --output text)
echo "$TrainingBucketName"
