#!/usr/bin/env bash

# Run this script with all parameters. Example usage:
# ./deploy_ml_container.sh deep-learning-ml aws-us-east-1-853562708331-deep-learning-infra-deployment

STACK_NAME=$1
S3_CFN_BUCKET=$2


# create CFN package and deploy
aws cloudformation package \
  --template-file template.yml \
  --s3-bucket ${S3_CFN_BUCKET} \
  --output-template-file packaged.yml

aws cloudformation deploy \
  --template-file ./packaged.yml \
  --stack-name ${STACK_NAME} \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
  ProjectName=${STACK_NAME} \
  EnvironmentType=local \
  --no-fail-on-empty-changeset
