#!/usr/bin/env bash

# Example usage
# ./deploy-webapp.sh deep-learning-webapp deep-learning-backend aws-us-east-1-853562708331-deep-learning-infra-deployment us-east-1 HEADER_TITLE HEADER_LOGO

STACK_NAME=$1
BACKEND_STACK_NAME=$2
S3_TMP_BUCKET=$3
REGION=$4
HEADER_TITLE=$5
HEADER_LOGO=$6

### Deploy Infra for hosting Frontend
aws cloudformation package \
  --template-file template.yml \
  --s3-bucket ${S3_TMP_BUCKET} \
  --output-template-file packaged.yml

aws cloudformation deploy \
  --template-file packaged.yml \
  --stack-name ${STACK_NAME} \
  --capabilities CAPABILITY_NAMED_IAM \
  --region ${REGION} \
  --no-fail-on-empty-changeset

############################
### Prepare config file
############################
alias cp=cp
cp src/config.js.template src/config.js

userpool=`aws cloudformation describe-stacks --stack-name ${BACKEND_STACK_NAME} --region ${REGION} --query 'Stacks[0].Outputs[?OutputKey==\`UserPool\`].OutputValue' --output text` \
  && sed -i -e "s/\${cognito-user-pool-id}/$userpool/g" src/config.js
echo "User Pool: ${userpool}"

identitypool=`aws cloudformation describe-stacks --stack-name ${BACKEND_STACK_NAME} --region ${REGION} --query 'Stacks[0].Outputs[?OutputKey==\`IdentityPool\`].OutputValue' --output text` \
  && sed -i -e "s/\${cognito-identity-pool-id}/$identitypool/g" src/config.js
echo "Identity Pool: ${identitypool}"

userclientid=`aws cloudformation describe-stacks --stack-name ${BACKEND_STACK_NAME} --region ${REGION} --query 'Stacks[0].Outputs[?OutputKey==\`UserPoolClient\`].OutputValue' --output text` \
  && sed -i -e "s/\${cognito-app-client-id}/$userclientid/g" src/config.js
echo "User Client Id: ${userclientid}"

artifactsBucket=`aws cloudformation describe-stacks --stack-name ${BACKEND_STACK_NAME} --region ${REGION} --query 'Stacks[0].Outputs[?OutputKey==\`TrainingBucketName\`].OutputValue' --output text` \
  && sed -i -e "s/\${s3-bucket}/$artifactsBucket/g" src/config.js
echo "Dataset Bucket: ${artifactsBucket}"

endpointUrl=`aws cloudformation describe-stacks --stack-name ${BACKEND_STACK_NAME} --region ${REGION} --query 'Stacks[0].Outputs[?OutputKey==\`EndpointURL\`].OutputValue' --output text` \
  && sed -i -e "s|pyapiurl|$endpointUrl|g" src/config.js
echo "Endpoint URL: ${endpointUrl}"

sed -i -e "s/\${region}/$REGION/g" src/config.js
sed -i -e "s/\${header-title}/$HEADER_TITLE/g" ./src/config.js
sed -i -e "s#\${header-logo}#$HEADER_LOGO#g" ./src/config.js
cat src/config.js


############################
### Upload website to S3
############################
websitebucket=`aws cloudformation describe-stacks --stack-name ${STACK_NAME} --region ${REGION} --query 'Stacks[0].Outputs[?OutputKey==\`WebSiteBucket\`].OutputValue' --output text`
echo "Website Bucket: ${websitebucket}"

cloundfronturl=`aws cloudformation describe-stacks --stack-name ${STACK_NAME} --region ${REGION} --query 'Stacks[0].Outputs[?OutputKey==\`CloudFrontUrl\`].OutputValue' --output text`
echo "CloudFront URL: ${cloundfronturl}"

distributionid=`aws cloudformation describe-stacks --stack-name ${STACK_NAME} --region ${REGION} --query 'Stacks[0].Outputs[?OutputKey==\`DistributionId\`].OutputValue' --output text`
echo "Distribution Id: ${distributionid}"


npm install
npm run build

aws s3 sync ./build/ s3://${websitebucket} --delete # --acl public-read  # S3 usually block public-read by default now. Need to deploy to CloudFront


INVALIDATION_ID=`aws cloudfront create-invalidation --distribution-id $distributionid --paths "/*" --output text --query 'Invalidation.Id'`
aws cloudfront wait invalidation-completed --distribution-id $distributionid --id $INVALIDATION_ID

cd ../..

echo "CloudFront URL: ${cloundfronturl}"
