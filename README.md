# dnn-app-blog
This repo contains files for the following AWS blog: "Creating an end-to-end application for orchestrating custom deep learning HPO, training, and inference using AWS Step Functions"

# Overview of components

This application consists of 4 main components, separated into 4 folders:
1. `machine-learning` - contains SageMaker notebook and scripts for building ML Docker Image (for both HPO and training a new model)
2. `shared-infra` - contains AWS resources used by both `backend` and `frontend` in CloudFormation template.
3. `backend` - contains backend code, APIs, a pipeline for retraining model and running HPO, and database (DynamoDB) 
4. `frontend` - contains web application code. The web application connected to the deployment of `backend` folder

# Prerequisite
1. Install Docker (tested on Docker Desktop version 2.1.0.5). This is required for SAM.
2. Install SAM CLI in your local machine. The installation steps are in [this link](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html). If you have never used SAM before, it is recommended to go through "Tutorial: Deploying a Hello World Application" section. It should take about 10 minutes to finish. 
3. Install Python version 3.7.6 
4. Install NodeJS version 10.20.1 


# Deployment Steps

1. Create a Sagemaker notebook instance (this will be used to create the docker) with required permissions by running:
    ```shell script
    cd machine-learning
    ./deploy_ml_container.sh
    ```
    * A Jypyter notebook instance is created with the name "Notebook". To access this, go to your AWS console, and then select Sagemaker service and click on "Notebook Instances" on the left .
    * You should see a notebook called unzip.ipynb inside this notebook session. 
    * Copy the "container_hpo.zip" file from your computer to "Notebook" workspace (same directory where unzip.ipynb exists) by clicking the upload button on top right of the notebook session.
    * Once you uploaded the zip file, run the code in unzip.ipynb to unzip the folder if you are asked to choose a kernel, you can choose "conda_python3". Once you unzipped the folder, go inside "container_hpo" folder and open "Build Container.ipynb" notebook.
    * You only need to run the following section in this notebook: "Building and registering the container". The rest is for local testing and traspacency. 
    * If this section runs successfully, that means you built and pushed the container to ECR. You should see a message like following if everything is successfull:

        latest: digest: sha256:b50f8f8218f402aba9c6c73b528079fa0bbb77574947c59d6f9a0bce0071e5cf size: 3268
    
2. Install `shared-infra` by running
    ```shell script
    cd shared-infra
    ./deploy-infra.sh app-name-infr
    ```
    
    This will deploy a CloudFormation stack called "app-name-infr". You can check it in [CloudFormation console](https://console.aws.amazon.com/cloudformation/home?region=us-east-1)
    
    The script will print Deployment Bucket and Training Bucket. Copy these two values for the next steps.
3. Install `backend` by running
    ```shell script
    cd ../backend/training-pipeline
    ./deploy-training-pipeline.sh app-name-backend TRAINING_BUCKET_NAME_FROM_PREVIOUS_STEP DEPLOYMENT_BUCKET_NAME_FROM_PREVIOUS_STEP
    ```
    
    This will build and deploy a CloudFormation stack called "app-name-backend". You can check it in [CloudFormation console](https://console.aws.amazon.com/cloudformation/home?region=us-east-1)

4. Install `frontend` by running
    ```shell script
    cd ../../frontend/webapp 
    # The first time you run this could take up to 30 minutes. 
    ./deploy-webapp.sh app-name-webapp app-name-backend DEPLOYMENT_BUCKET_NAME_FROM_PREVIOUS_STEP us-east-1
    ```
    
    This will deploy AWS S3 and CloudFront distribution to host the website, retrieve configuration from `backend`, build the frontend asset, and upload it to S3 for hosting.
    
    The script will print a URL for accessing the website.

5. Create a new user for the application:
    * Go to [Cognito console](https://console.aws.amazon.com/cognito/home?region=us-east-1#)
    * Change the region if you are not using N. Virginia (us-east-1)
    * Click "Manage User Pool"
    * Click "app-name-backend"
    * On the left hand menu bar, click "Users and groups"
    * Click "Create user"
    * Enter "Username" and "Temporary password"
    * Enter "Email"
    * Uncheck 
        * "Send an invitation to this new users?"
        * "Mark phone number as verified"
    * Click "Create user"
    * Go to the website URL (from the last step) and login with the Username and Password. 
