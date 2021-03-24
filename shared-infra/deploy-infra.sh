#!/usr/bin/env bash

# Example usage
# ./deploy-infra.sh deep-learning-infra

STACK_NAME=$1

aws cloudformation deploy \
  --template template.yml \
  --stack-name ${STACK_NAME}


# These results should be passed to Frontend and Backend stack
echo "########################"
echo "## Deployment Bucket:"
echo "########################"
aws cloudformation describe-stacks --stack-name ${STACK_NAME} --query 'Stacks[0].Outputs[?OutputKey==`DeploymentBucketName`].OutputValue' --output text

echo "########################"
echo "## Training Bucket:"
echo "########################"
aws cloudformation describe-stacks --stack-name ${STACK_NAME} --query 'Stacks[0].Outputs[?OutputKey==`TrainingBucketName`].OutputValue' --output text
