import React, {Component} from "react";

import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  FormText,
  NavItem,
  NavLink, Nav, TabContent, TabPane
} from "reactstrap";
import {LoaderButton, OneColumnLayout} from '../../components';
import {API, Storage} from "aws-amplify";

import "./TrainModelPage.scss";
import {TrainingJobTable} from "./TrainingJobTable";
import {ACTIVATION_FUNCTIONS, OPTIMIZERS, TRAINING_TYPES} from "../../constants";
import {HPOSection} from "./HPOSection";
import {ARRAY_NUMBER_INPUT_TYPES, FIELD_TYPES} from "../renderFields";
import {TrainNewModelSection} from "./TrainNewModelSection";

import classnames from 'classnames';

export default class TrainModelPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fileToUpload: null,
      trainingDataS3Name: null,
      isUploading: false,

      // Tabs
      activeTab: TRAINING_TYPES.HPO,

      // ### HPO Parameters
      isLoadingHPO: false,
      hpoParameters: [
        {
          name: 'target',
          type: FIELD_TYPES.TEXT,
          text: 'Target Column Name',
          val: 'Target',
          placeholder: 'string',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'batchNormalization',
          type: FIELD_TYPES.SELECT,
          label: 'Batch Normalization',
          options: [
            {
              key: 'true',
              text: 'Yes',
            },
            {
              key: 'false',
              text: 'No',
            }
          ],
          val: 'false',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'includeDropout',
          type: FIELD_TYPES.SELECT,
          label: 'Include Dropout',
          options: [
            {
              key: 'true',
              text: 'Yes',
            },
            {
              key: 'false',
              text: 'No',
            }
          ],
          val: 'false',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'dropout',
          conditionField: 'includeDropout',
          conditionFieldVal: 'true',
          type: FIELD_TYPES.ARRAY_NUMBER,
          label: 'Possible Dropout',
          arrayLength: 2,
          arrayValues: [0.2, 0.5],
          placeholder: 'valid values = integer',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'lossMetric',
          type: FIELD_TYPES.SELECT,
          label: 'Loss Metric',
          options: [
            {
              key: 'mae',
              text: 'mae',
            },
            {
              key: 'mse',
              text: 'mse',
            }
          ],
          val: 'mae',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'monitorMetric',
          type: FIELD_TYPES.SELECT,
          label: 'Monitor Metric',
          options: [
            {
              key: 'val_mean_absolute_error',
              text: 'val_mean_absolute_error',
            },
            {
              key: 'val_mean_squared_error',
              text: 'val_mean_squared_error',
            },
            {
              key: 'val_loss',
              text: 'val_loss',
            },
            {
              key: 'mean_absolute_error',
              text: 'mean_absolute_error',
            },
            {
              key: 'mean_squared_error',
              text: 'mean_squared_error',
            },
            {
              key: 'loss',
              text: 'loss',
            }
          ],
          val: 'val_mean_absolute_error',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'lrUpdatePatience',
          type: FIELD_TYPES.NUMBER,
          text: 'Learning Rate Update Patience',
          val: 7,
          placeholder: 'valid values = integer',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'earlyStoppingPatience',
          type: FIELD_TYPES.NUMBER,
          text: 'Early Stopping Patience',
          val: 15,
          placeholder: 'valid values = integer',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'numLayersLow',
          type: FIELD_TYPES.NUMBER,
          text: 'Number of Layers (Minimum)',
          val: 6,
          placeholder: 'valid values = integer',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'numLayersHigh',
          type: FIELD_TYPES.NUMBER,
          text: 'Number of Layers (Maximum)',
          val: 9,
          placeholder: 'valid values = integer',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'choiceOfNodeNumbers',
          type: FIELD_TYPES.ARRAY_NUMBER,
          label: 'Possible Node Numbers',
          arrayLength: 8,
          arrayValues: [16, 32, 64, 128, 256, 512, 1024, 2048],
          placeholder: 'valid values = integer',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'batchSize',
          type: FIELD_TYPES.ARRAY_NUMBER,
          label: 'Possible Batch Size',
          arrayLength: 4,
          arrayValues: [16, 32, 64, 128],
          placeholder: 'valid values = integer',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'usedDataPercentage',
          type: FIELD_TYPES.NUMBER,
          text: 'Used Data Percentage',
          val: 10,
          placeholder: 'valid values = integer 1-100',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'trainValidationSplit',
          type: FIELD_TYPES.NUMBER,
          text: 'Training/Validation Data Split',
          val: 0.15,
          placeholder: 'valid values = float 0.01-0.99',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'maxEval',
          type: FIELD_TYPES.NUMBER,
          text: 'Max Evals',
          val: 3,
          placeholder: 'valid values = integer 1-10',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'randomState',
          type: FIELD_TYPES.NUMBER,
          text: 'Random State',
          val: 50,
          placeholder: 'valid values = integer 1-100',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'nbEpochs',
          type: FIELD_TYPES.NUMBER,
          text: 'Epochs',
          val: 5,
          placeholder: 'valid values = integer 1-3 (Higher values could take very long time to complete)',
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'optimizers',
          type: FIELD_TYPES.CHECKBOX,
          label: 'Optimizer',
          checkboxes: [
            {
              key: OPTIMIZERS.ADAM,
              text: OPTIMIZERS.ADAM,
              isChecked: true,
            },
            {
              key: OPTIMIZERS.SGD,
              text: OPTIMIZERS.SGD,
              isChecked: false,
            }
          ],
          updateFunction: this.updateHPOParameter,
        },
        {
          name: 'activationFunctions',
          type: FIELD_TYPES.CHECKBOX,
          label: 'Activation Functions',
          checkboxes: [
            {
              key: ACTIVATION_FUNCTIONS.TANH,
              text: ACTIVATION_FUNCTIONS.TANH,
              isChecked: true,
            },
            {
              key: ACTIVATION_FUNCTIONS.LINEAR,
              text: ACTIVATION_FUNCTIONS.LINEAR,
              isChecked: false,
            }
          ],
          updateFunction: this.updateHPOParameter,
        },
      ],

      // ### Hyperparameters
      hyperparameters: [
        {
          name: 'modelName',
          type: FIELD_TYPES.TEXT,
          text: 'Model Name',
          val: 'model-' + this.getCurrentTimeInStr(),
          placeholder: 'string',
          updateFunction: this.updateHyperparameter,
        },
        // Common parameters (same as HPO)
        {
          name: 'target',
          type: FIELD_TYPES.TEXT,
          text: 'Target Column Name',
          val: 'Target',
          placeholder: 'string',
          updateFunction: this.updateHyperparameter,
        },
        {
          name: 'batchNormalization',
          type: FIELD_TYPES.SELECT,
          label: 'Batch Normalization',
          options: [
            {
              key: 'true',
              text: 'Yes',
            },
            {
              key: 'false',
              text: 'No',
            }
          ],
          val: 'false',
          updateFunction: this.updateHyperparameter,
        },
        {
          name: 'includeDropout',
          type: FIELD_TYPES.SELECT,
          label: 'Include Dropout',
          options: [
            {
              key: 'true',
              text: 'Yes',
            },
            {
              key: 'false',
              text: 'No',
            }
          ],
          val: 'false',
          updateFunction: this.updateHyperparameter,
        },
        {
          name: 'dropoutF',
          conditionField: 'includeDropout',
          conditionFieldVal: 'true',
          type: FIELD_TYPES.NUMBER,
          text: 'Dropout',
          val: 0.2,
          placeholder: 'valid values = float (0.01-0.99)',
          updateFunction: this.updateHyperparameter,
        },
        {
          name: 'lossMetric',
          type: FIELD_TYPES.SELECT,
          label: 'Loss Metric',
          options: [
            {
              key: 'mae',
              text: 'mae',
            },
            {
              key: 'mse',
              text: 'mse',
            }
          ],
          val: 'mae',
          updateFunction: this.updateHyperparameter,
        },
        {
          name: 'monitorMetric',
          type: FIELD_TYPES.SELECT,
          label: 'Monitor Metric',
          options: [
            {
              key: 'val_mean_absolute_error',
              text: 'val_mean_absolute_error',
            },
            {
              key: 'val_mean_squared_error',
              text: 'val_mean_squared_error',
            },
            {
              key: 'val_loss',
              text: 'val_loss',
            },
            {
              key: 'mean_absolute_error',
              text: 'mean_absolute_error',
            },
            {
              key: 'mean_squared_error',
              text: 'mean_squared_error',
            },
            {
              key: 'loss',
              text: 'loss',
            }
          ],
          val: 'val_mean_absolute_error',
          updateFunction: this.updateHyperparameter,
        },
        {
          name: 'lrUpdatePatience',
          type: FIELD_TYPES.NUMBER,
          text: 'Learning Rate Update Patience',
          val: 7,
          placeholder: 'valid values = integer',
          updateFunction: this.updateHyperparameter,
        },
        {
          name: 'earlyStoppingPatience',
          type: FIELD_TYPES.NUMBER,
          text: 'Early Stopping Patience',
          val: 15,
          placeholder: 'valid values = integer',
          updateFunction: this.updateHyperparameter,
        },
        // Parameters specific to Training a model
        {
          name: 'nbEpochsF',
          type: FIELD_TYPES.NUMBER,
          text: 'Epochs',
          val: 5,
          placeholder: 'valid values = integer 1-10',
          updateFunction: this.updateHyperparameter,
        },
        {
          name: 'batchSizeF',
          type: FIELD_TYPES.NUMBER,
          text: 'Batch Size',
          val: 64,
          // val: 1,
          placeholder: 'valid values = integer 1-128',
          updateFunction: this.updateHyperparameter,
        },
        {
          name: 'optimizerF',
          type: FIELD_TYPES.SELECT,
          label: 'Optimizer',
          options: [
            {
              key: OPTIMIZERS.ADAM,
              text: OPTIMIZERS.ADAM,
            },
            {
              key: OPTIMIZERS.SGD,
              text: OPTIMIZERS.SGD,
            }
          ],
          val: OPTIMIZERS.ADAM,
          updateFunction: this.updateHyperparameter,
        },
        {
          name: 'lastActivationF',
          type: FIELD_TYPES.SELECT,
          label: 'Last Activation Function',
          options: [
            {
              key: ACTIVATION_FUNCTIONS.LINEAR,
              text: ACTIVATION_FUNCTIONS.LINEAR,
            },
            {
              key: ACTIVATION_FUNCTIONS.TANH,
              text: ACTIVATION_FUNCTIONS.TANH,
            }
          ],
          val: ACTIVATION_FUNCTIONS.TANH,
          updateFunction: this.updateHyperparameter,
        },
        {
          name: 'nodes',
          type: FIELD_TYPES.ARRAY_NUMBER,
          label: 'Number of layers',
          arrayLength: 8,
          // arrayLength: 2,
          arrayValues: [1024, 524, 256, 128, 64, 32, 16, 1],
          // arrayValues: [1, 1],
          placeholder: 'valid values = integer',
          updateFunction: this.updateHyperparameter,
        },
      ],

      // Training a model
      isLoadingTraining: false,

    };
  }


  getCurrentTimeInStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
  };
  // ##################################
  // File upload
  // ##################################
  handleFileUpload = files => {
    if (files.length > 0) {
      const file = files[0];
      this.setState({
        fileToUpload: file
      });
    }
  };

  handleUploadFile = async () => {
    const file = this.state.fileToUpload;

    if (file) {
      if (file.type !== 'text/csv') {
        alert("Only CSV files are allowed");
        return;
      }

      this.setState({
        isUploading: true
      });

      const stored = await Storage.vault.put(file.name, file, {
        level: 'public', // 'public' means the file could be viewed by other logged in user, not public internet access
        contentType: file.type,
      });

      this.setState({
        isUploading: false,
        trainingDataS3Name: stored.key
      });
      alert('Upload completed, you can either start HPO or training a new model')

    } else {
      alert('Please select a CSV file')
    }
  };

  // ##################################
  // Tabs
  // ##################################
  setTab = (newActiveTab) => {
    this.setState({
      activeTab: newActiveTab
    });
  };

  // ##################################
  // Parameters for HPO
  // ##################################

  updateParameter = (stateKey, name, val) => {
    const parameters = this.state[stateKey];
    let newParameters = [...parameters];
    const targetIndex = newParameters.findIndex(obj => obj.name === name);


    if (targetIndex >= 0) {
      const fieldType = newParameters[targetIndex].type;
      if (fieldType === FIELD_TYPES.TEXT) {
        newParameters[targetIndex] = {
          ...newParameters[targetIndex],
          val: val,
        }
      } else if (fieldType === FIELD_TYPES.NUMBER) {
        const isInt = parseInt(val) === val;
        newParameters[targetIndex] = {
          ...newParameters[targetIndex],
          val: isInt ? parseInt(val, 10) : parseFloat(val),
        }
      } else if (fieldType === FIELD_TYPES.CHECKBOX) {
        const checkboxes = newParameters[targetIndex].checkboxes;
        const checkboxIndex = checkboxes.findIndex(cb => cb.key === val);
        checkboxes[checkboxIndex].isChecked = !checkboxes[checkboxIndex].isChecked;
      } else if (fieldType === FIELD_TYPES.SELECT) {
        newParameters[targetIndex] = {
          ...newParameters[targetIndex],
          val: val,
        }
      } else if (fieldType === FIELD_TYPES.ARRAY_NUMBER) {
        if (val.type === ARRAY_NUMBER_INPUT_TYPES.LENGTH) {
          const currentSize = newParameters[targetIndex].arrayLength;
          const newArrayLength = parseInt(val.value, 10) || 0;

          let newArrayValues = [...newParameters[targetIndex].arrayValues];
          if (newArrayLength > currentSize) {
            while (newArrayLength > newArrayValues.length) {
              newArrayValues.push(0);
            }
          } else if (newArrayLength < currentSize) {
            if (newArrayLength === 0) {
              newArrayValues = [];
            } else {
              newArrayValues = newArrayValues.slice(0, newArrayLength);
            }
          }
          newParameters[targetIndex] = {
            ...newParameters[targetIndex],
            arrayLength: newArrayLength,
            arrayValues: newArrayValues,
          }
        } else if (val.type === ARRAY_NUMBER_INPUT_TYPES.VALUE) {
          let newArrayValues = [...newParameters[targetIndex].arrayValues];
          newArrayValues[val.index] = val.value;

          newParameters[targetIndex] = {
            ...newParameters[targetIndex],
            arrayValues: newArrayValues,
          }
        }
      }
    }

    this.setState({
      [stateKey]: newParameters,
    })
  };

  updateHPOParameter = (name, val) => {
    this.updateParameter('hpoParameters', name, val)
  };

  startHPO = async () => {

    const {trainingDataS3Name, hpoParameters} = this.state;

    if (!trainingDataS3Name) {
      alert('Please upload training data first');
      return;
    }

    this.setState({
      isLoadingHPO: true,
    });

    let params = {
      trainingDataS3Name: trainingDataS3Name,
    };

    for (let hp of hpoParameters) {
      if (hp.type === FIELD_TYPES.TEXT ||
        hp.type === FIELD_TYPES.NUMBER ||
        hp.type === FIELD_TYPES.SELECT
      ) {
        // Some SELECT fields use text for boolean
        if (hp.val === 'false' || hp.val === 'true') {
          params[hp.name] = hp.val === 'true';
        } else {
          params[hp.name] = hp.val;
        }
      } else if (hp.type === FIELD_TYPES.CHECKBOX) {
        let checkedVals = [];
        for (let cb of hp.checkboxes) {
          if (cb.isChecked) {
            checkedVals.push(cb.key);
          }
        }
        params[hp.name] = checkedVals;
      } else if (hp.type === FIELD_TYPES.ARRAY_NUMBER) {
        params[hp.name] = hp.arrayValues;
      }
    }
    console.log("params for HPO = ", params);

    const startHPOResult = await API.post("pyapi", `hpo`, {
      body: {
        ...params
      }
    });

    this.setState({
      isLoadingHPO: false,
    });

    if (startHPOResult && startHPOResult.ResponseMetadata.HTTPStatusCode === 200) {
      alert('Successfully started a HPO job, check table below to see current status. Once the status is "READY", you can check the optimal hyperparameters in CloudWatch Log');
    } else {
      alert('Fail to start a HPO job');
    }
  };

  // ##################################
  // Hyperparameters for TRAINING
  // ##################################

  updateHyperparameter = (name, val) => {
    this.updateParameter('hyperparameters', name, val)
  };


  trainNewModel = async () => {
    const {trainingDataS3Name, hyperparameters} = this.state;

    if (!trainingDataS3Name) {
      alert('Please upload training data first');
      return;
    }

    const nodesIndex = hyperparameters.findIndex(obj => obj.name === 'nodes');
    const nodeValues = hyperparameters[nodesIndex].arrayValues;
    if (nodeValues[nodeValues.length - 1] !== 1) {
      alert('The number of node in the last layer must be 1. Check the last value in "Number of layers"');
      return;
    }

    this.setState({
      isLoadingTraining: true,
    });

    let params = {
      trainingDataS3Name: trainingDataS3Name,
    };

    for (let hp of hyperparameters) {
      if (hp.type === FIELD_TYPES.SELECT) {
        if (hp.val === 'false' || hp.val === 'true') {
          params[hp.name] = hp.val === 'true';
        } else {
          params[hp.name] = hp.val;
        }
      } else if (hp.type === FIELD_TYPES.ARRAY_NUMBER) {
        params[hp.name] = hp.arrayValues;
      } else {
        params[hp.name] = hp.val;
      }
    }

    console.log(params);

    const startTrainingResult = await API.post("pyapi", `model`, {
      body: {
        ...params
      }
    });

    this.setState({
      isLoadingTraining: false,
    });

    if (startTrainingResult && startTrainingResult.ResponseMetadata.HTTPStatusCode === 200) {
      alert('Successfully started training, check training job to see current status. Once the status is "Ready", you will find the model for inference');
    } else {
      alert('Fail to start training');
    }

  };


  render() {
    const {
      // Upload new training data
      isUploading,
      // Active tab
      activeTab,
      // HPO
      isLoadingHPO,
      hpoParameters,
      // Train a new model
      isLoadingTraining,
      hyperparameters,
    } = this.state;

    return <OneColumnLayout>

      {/*#################################*/}
      {/*### Upload New Training Data ####*/}
      {/*#################################*/}
      <Row>
        <Col>
          <h1>Upload New Training Data</h1>
          <p className="upload-data-instruction">
            <b>Instruction</b>: Upload dataset to S3. This dataset is used for HPO and training a new model.
          </p>
        </Col>
      </Row>
      <Row>
        <Col sm={8}>
          <FormGroup row>
            <Label for="dataset" sm={4}>Upload New Dataset</Label>
            <Col sm={6}>
              <Input type="file" name="dataset" id="dataset" onChange={e => this.handleFileUpload(e.target.files)}/>
              <FormText color="muted">
                Warning: This will replace an existing dataset with the same name.
              </FormText>
            </Col>
          </FormGroup>

          <Row>
            <Col sm={{offset: 4, size: 2}}>
              <LoaderButton
                color="primary"
                onClick={this.handleUploadFile}
                isLoading={isUploading}
                loadingText="Uploading..."
                text="Upload"
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <hr/>

      {/*#################################*/}
      {/*######### Tab Selection #########*/}
      {/*#################################*/}
      <Row className="tab-selection">
        <Col>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === TRAINING_TYPES.HPO })}
                onClick={() => { this.setTab(TRAINING_TYPES.HPO); }}
              >
                Hyperparameter Optimization
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === TRAINING_TYPES.MODEL })}
                onClick={() => { this.setTab(TRAINING_TYPES.MODEL); }}
              >
                Train New Model
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>

      <TabContent activeTab={activeTab}>

        {/*#################################*/}
        {/*## Hyperparameter Optimization ##*/}
        {/*#################################*/}
        <TabPane tabId={TRAINING_TYPES.HPO}>

          <HPOSection hpoParameters={hpoParameters}
                      isLoading={isLoadingHPO}
                      startHPO={this.startHPO}
          />
          <Row className="training-jobs-hpo-box">
            <Col sm={{size: 8}}>
              <h3>Last 5 Training Jobs (HPO)</h3>
              <TrainingJobTable trainingType={TRAINING_TYPES.HPO}/>
            </Col>
          </Row>
        </TabPane>

        {/*#################################*/}
        {/*######Train a New Model #########*/}
        {/*#################################*/}
        <TabPane tabId={TRAINING_TYPES.MODEL}>

          <TrainNewModelSection parameters={hyperparameters}
                                isLoading={isLoadingTraining}
                                trainNewModel={this.trainNewModel}
          />
          <Row className="training-jobs-models-box">
            <Col sm={{size: 8}}>
              <h3>Last 5 Training Jobs (Models)</h3>
              <TrainingJobTable trainingType={TRAINING_TYPES.MODEL}/>
            </Col>
          </Row>
        </TabPane>
      </TabContent>



    </OneColumnLayout>;
  }
}
