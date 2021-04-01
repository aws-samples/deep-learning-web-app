import awsLogo from './assets/aws-logo-on-light-bg.png';

export default {
  HEADER_TITLE: "Run HPO, Model Training, and Inference on Deep Neural Network",
  HEADER_LOGO: awsLogo,

  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "aws-us-east-1-853562708331-deep-learning2-infra-training"
  },
  apiGateway: {
    REGION: "us-east-1",
    PYURL: "https://qxedlixnud.execute-api.us-east-1.amazonaws.com/Prod/"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_mCfFuklB1",
    APP_CLIENT_ID: "1hkc81ifmq3hds7pn2r4lcv5i6",
    IDENTITY_POOL_ID: "us-east-1:925a95ea-e9f2-4b62-8ad6-bf6ac682c74c"
  }
};
