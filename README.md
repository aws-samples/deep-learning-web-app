# dnn-app-blog
This repo contains files for the following AWS blog: "Creating an end-to-end application for orchestrating custom deep learning HPO, training, and inference using AWS Step Functions"



# Prerequisite
1. Install Docker (tested on Docker Desktop version 2.1.0.5). This is required for SAM. We also recommend that you create an account in docker and log into it when installing this app, to avoid limit restrictions.
2. Install SAM CLI in your local machine. The installation steps are in [this link](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html). If you have never used SAM before, it is recommended to go through "Tutorial: Deploying a Hello World Application" section. It should take about 10 minutes to finish. 
3. Install Python version 3.7.6 
4. Install NodeJS version 10.20.1 


# Deployment Steps

1. Clone this repo to your computer.

2. Open ```install.sh``` file in the main directory and update "Your Email Address" and "Customer Name" with correct information. Please make sure you provide a valid email address because username and password will be emailed to that address.

3. Open a terminal and cd to the main directory (where ```install.sh``` is located) and then run the following command: ```./install.sh```

4. Installation will take several minutes to complete. If installation is successfull, CloudFront URL will be printed in the end at the terminal. Copy that URL to an internet browser. Check the email address that you provided earlier. You should receive an email with a username and password. You can log in to the application with those credentials.

# Local Testing

Installing this app, will also treate a Sagemaker notebook instance with the name "Notebook". To access this, go to your AWS console, and then select Sagemaker service and click on "Notebook Instances" on the left. You should see the content of this repo already copied there. Notebooks for local testing and building docker container can be found in the following directory: ‎⁨deep-learning-web-app⁩ ▸ ⁨machine-learning⁩  ▸ test_on_notebook. For more info, refer to the Appendix section in the blog.

# Overview of components

This application consists of 4 main components, separated into 4 folders:
1. `machine-learning` - contains SageMaker notebook and scripts for building ML Docker Image (for both HPO and training a new model)
2. `shared-infra` - contains AWS resources used by both `backend` and `frontend` in CloudFormation template.
3. `backend` - contains backend code, APIs, a pipeline for retraining model and running HPO, and database (DynamoDB) 
4. `frontend` - contains web application code. The web application connected to the deployment of `backend` folder
