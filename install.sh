#!/usr/bin/env bash

# Exit when any command fails
set -e

# Parameters from Demo Factory
STACK_PREFIX=${STACK_PREFIX:-"deep-learning"}
ADMIN_EMAIL=${ADMIN_EMAIL:-"youremail@domain.com"}
HEADER_TITLE=${HEADER_TITLE:-"Application Name"}


REGION="us-east-1"
INFRA_STACK_NAME="$STACK_PREFIX-infra"
ML_STACK_NAME="$STACK_PREFIX-ml"
BACKEND_STACK_NAME="$STACK_PREFIX-backend"
FRONTEND_STACK_NAME="$STACK_PREFIX-frontend"

# Infra
echo "##########################################"
echo "##### Deploying infra stack: ${INFRA_STACK_NAME}"...
echo "##########################################"
cd shared-infra
./deploy-infra.sh "${INFRA_STACK_NAME}" "${REGION}"

deployment_bucket=$(aws cloudformation describe-stacks --stack-name "${INFRA_STACK_NAME}" --query 'Stacks[0].Outputs[?OutputKey==`DeploymentBucketName`].OutputValue' --output text)
training_bucket=$(aws cloudformation describe-stacks --stack-name "${INFRA_STACK_NAME}" --query 'Stacks[0].Outputs[?OutputKey==`TrainingBucketName`].OutputValue' --output text)

cd ..

# ML part
echo "##########################################"
echo "##### Deploying ML stack: ${ML_STACK_NAME}"...
echo "##########################################"
cd machine-learning
./deploy_ml_container.sh "${ML_STACK_NAME}" "${deployment_bucket}" "${REGION}"
./build-container.sh

cd ..

# Backend
echo "##########################################"
echo "##### Deploying backend stack: ${BACKEND_STACK_NAME}"...
echo "##########################################"
cd backend/training-pipeline
./deploy-training-pipeline.sh "${BACKEND_STACK_NAME}" "${training_bucket}" "${deployment_bucket}" "${ADMIN_EMAIL}" ${REGION}

cd ../..

# Frontend
echo "##########################################"
echo "##### Deploying frontend stack: ${FRONTEND_STACK_NAME}"...
echo "##########################################"
cd frontend/webapp
./deploy-webapp.sh "${FRONTEND_STACK_NAME}" "${BACKEND_STACK_NAME}" "${deployment_bucket}" "${REGION}" "${HEADER_TITLE}"
