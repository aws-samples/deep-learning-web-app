import React, {Component} from "react";
import {OneColumnLayout} from "../components/layouts/OneColumnLayout";
import {API} from "aws-amplify";
import {InputGroup, InputGroupAddon, Input, Row, Col, Label, FormGroup, Table, Alert} from "reactstrap";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {LoaderButton} from "../components/forms";
import {TRAINING_STATUS} from "../constants";

import "./InferencePage.scss";

export default class InferencePage extends Component {

  constructor(props) {
    super(props);

    const initialRatio = [];
    for (let i = 0.2; i <= 1.0; i += 0.1) {
      initialRatio.push(i.toFixed(2));
    }


    let xAxis = [];
    for (let j = 1.1; j < 3.1; j += 0.1) {
      xAxis.push(j.toFixed(1));
    }

    this.state = {
      modelEndpoints: ['Loading...'],
      selectedEndpoint: 'Loading...',
      inferenceInputs: [
        //18 input, the last input (19th) will be a range
        0.1,
        0.2,
        0.3,
        0.4,
        0.5,
        0.1,
        0.2,
        0.3,
        0.4,
        0.5,
        0.1,
        0.2,
        0.3,
        0.4,
        0.5,
        0.1,
        0.2,
        0.3,
      ],
      rangeInput: {
        start: 1.1,
        end: 3.1,
        step: 0.1,
      },
      xAxis: xAxis,
      predictions: [],
      isInfering: false,
    };

  }

  componentDidMount = async () => {
    const result = await API.get("pyapi", `model`, {});
    const readyTrainingJob = result.models.filter(
      tj => tj.status === TRAINING_STATUS.READY
    );

    const modelEndpoints = readyTrainingJob.map(
      tj => this.getModelEndpointName(tj.endpointArn)
    );

    if (modelEndpoints.length === 0) {
      alert("No model available for prediction, please train a model first!");
    }

    let selectedEndpoint = undefined;
    if (modelEndpoints.length > 0) {
      selectedEndpoint = modelEndpoints[0]
    }

    this.setState({
      modelEndpoints: modelEndpoints,
      selectedEndpoint: selectedEndpoint,
    })
  };

  getModelEndpointName = arn => {
    const i = arn.indexOf('/');
    return arn.substring(i + 1);
  };

  updateInferenceInput = (inputIndex, val) => {
    let updatedInput = this.state.inferenceInputs.slice(0);

    updatedInput[inputIndex] = val ? parseFloat(val) : '';

    // If user enters non float value, parseFloat will return NaN. We ignore this.
    if (isNaN(updatedInput[inputIndex])) {
      return;
    }

    console.log("updatedInput = ", updatedInput);
    this.setState({
      inferenceInputs: updatedInput
    });
  };


  fillEmptyInput = (inferenceInputs) => {
    let filledInputs = inferenceInputs.slice();
    for (let i = 0; i < inferenceInputs.length; i++) {
      if (!filledInputs[i]) {
        filledInputs[i] = 0;
      }
    }
    return filledInputs;
  };

  handleInfer = async () => {
    const {selectedEndpoint, inferenceInputs, rangeInput} = this.state;

    this.setState({
      isInfering: true
    });

    let inputParam = this.fillEmptyInput(inferenceInputs);

    console.log("inputParam = ", inputParam);
    try {
      const inferResult = await API.post("pyapi", `infer`, {
        body: {
          input: inputParam,
          modelName: selectedEndpoint,
          range: rangeInput
        }
      });
      this.setState({
        xAxis: inferResult.x_axis.map(f => {
          return parseFloat(f).toFixed(1);
        }),
        predictions: inferResult.predictions,
        isInfering: false,
      });
    } catch (e) {
      alert('Calling Inference API failed. Please verify if the your inputs are valid for this model.');

      if(e.response){
        console.error('Error response obj = ', e.response);
      } else {
        console.error(e);
      }

      this.setState({
        isInfering: false,
      });
    }


  };

  renderAllInputGroups = (inferenceInputs) => {
    const ROWS_PER_COL = 5;
    const allInputGroups = [];
    for (let i = 0; i < inferenceInputs.length; i += ROWS_PER_COL) {
      const end = i + ROWS_PER_COL - 1 < inferenceInputs.length ? i + ROWS_PER_COL - 1 : inferenceInputs.length - 1;
      allInputGroups.push(
        <Col key={`col-${i}-to-${i + ROWS_PER_COL - 1}`}>
          {this.renderInputGroups(i, end)}
        </Col>
      )
    }

    return allInputGroups;
  };

  renderInputGroups = (from, to) => {

    let inputGroups = [];
    for (let i = from; i <= to; i++) {
      const fieldText = ('' + (i + 1)).padStart(2, '0');

      // Some inputs are excluded
      const placeholder = "Enter number...";

      let val = this.state.inferenceInputs[i];

      inputGroups.push(
        <InputGroup size="sm" key={i + 1}>
          <InputGroupAddon addonType="prepend">{fieldText}</InputGroupAddon>
          <Input type="number"
                 onChange={e => this.updateInferenceInput(i, e.target.value)}
                 value={val}
                 placeholder={placeholder}
          />
        </InputGroup>
      )
    }
    return inputGroups;
  };

  renderRangeInput = ({start, end, step}) => {
    return (
      <>
        {this.renderInput('Start (inclusive):', 'start', start, this.updateRangeInput)}
        {this.renderInput('End (exclusive):', 'end', end, this.updateRangeInput)}
        {this.renderInput('Step size:', 'step', step, this.updateRangeInput)}
      </>
    )
  };

  renderInput = (label, key, val, callbackFn) => {
    return (
      <FormGroup row className="step-input-row">
        <Label for={key} sm={2}>{label}:</Label>
        <Col sm={6}>
          <Input type="number"
                 name={key}
                 id={key}
                 value={val || ''}
                 onChange={e => callbackFn(key, e.target.value)}
          />
        </Col>
      </FormGroup>
    );
  };

  renderInputPreview = (inferenceInputs, rangeInput) => {
    const {start, end, step} = rangeInput;

    if (step <= 0) {
      return <Alert color="danger">
        Step size cannot be less than or equal 0
      </Alert>
    }

    return (
      <Table size="sm" striped>
        <thead>
        <tr>
          {
            (() => {
              const ths = [];
              let colIndex = 1;
              for (let j = 0; j < inferenceInputs.length + 1; j++) {
                ths.push(
                  <th key={`preview-header-${colIndex}`}>
                    #{colIndex}
                  </th>
                );
                colIndex++;
              }
              return ths;
            })()
          }
        </tr>
        </thead>
        <tbody>
        {
          (() => {
            const rows = [];
            for (let i = start; i < end; i += step) {
              let tds = [];
              for (let j = 0; j < inferenceInputs.length; j++) {
                tds.push(
                  <td key={`preview-data-${i}-${j}`}>
                    {inferenceInputs[j]}
                  </td>
                );
              }
              tds.push(
                <td key={`preview-data-${i}-${inferenceInputs.length}`}>
                  {i.toFixed(1)}
                </td>
              );
              rows.push(
                <tr key={`preview-row-${i}`}>
                  {tds}
                </tr>
              )
            }

            return rows;
          })()
        }
        </tbody>
      </Table>
    );
  };

  createGraphData = (xAxis, predictions) => {
    const data = [];

    for (let i = 0; i < xAxis.length; i++) {
      data.push({
        'xAxis': xAxis[i],
        'prediction': predictions[i]
      });
    }
    return data;
  };

  renderGraph = () => {
    const {predictions, xAxis} = this.state;

    const data = this.createGraphData(xAxis, predictions);

    return (
      <ResponsiveContainer width="99%" aspect={4}>
        <AreaChart
          data={data}
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.5}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="xAxis" label={{value: "Combinations", position: "bottom"}}>
          </XAxis>
          <YAxis label={{value: 'Target Value', angle: -90, position: 'insideLeft'}}/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Area type="monotone" dataKey="prediction" stroke="#8884d8" fillOpacity={1} fill="url(#colorPred)"/>
        </AreaChart>
      </ResponsiveContainer>
    )

  };

  renderModelSelection = (modelEndpoints, selectedEndpoint) => {
    return (
      <FormGroup row>
        <Label for="selectedEndpoint" sm={2}>Model Endpoints:</Label>
        <Col sm={6}>
          <Input type="select"
                 name="selectedEndpoint"
                 id="selectedEndpoint"
                 value={selectedEndpoint}
                 onChange={e => this.updateSelectedEndpoint(e.target.value)}
          >
            {
              modelEndpoints.map(name => {
                return <option key={name}>{name}</option>
              })
            }
          </Input>
        </Col>
      </FormGroup>
    )
  };

  updateSelectedEndpoint = (val) => {
    this.setState({
      selectedEndpoint: val,
    });
  };

  updateNoOfInputs = (val) => {
    let newInputs = null;
    const currentInputs = this.state.inferenceInputs;

    if (val > currentInputs.length) {
      newInputs = currentInputs.slice();
      while (newInputs.length < val) {
        newInputs.push(0);
      }
    } else {
      newInputs = currentInputs.slice(0, val);
    }

    this.setState({
      inferenceInputs: newInputs,
    });
  };

  updateRangeInput = (key, val) => {
    this.setState({
      rangeInput: {
        ...this.state.rangeInput,
        [key]: parseFloat(val),
      }
    })
  };

  render() {
    const {modelEndpoints, selectedEndpoint, isInfering, inferenceInputs, rangeInput} = this.state;
    return (
      <OneColumnLayout>
        <Row>
          <Col>
            <h1>Predict</h1>
            <h3>Instruction</h3>
            <ol>
              <li>
                Change the amount of feature to be sent to the model. The number of features <b>must be the same as </b>
                in the training file used to train the model.
              </li>
              <li>
                Enter values for all features
              </li>
              <li>
                Click "Predict" button to get the result with the current model
              </li>
            </ol>
            <hr/>
          </Col>
        </Row>
        <Row className="home-input-box">

          <Col>
            <Row>
              <Col>
                <h3>Inputs</h3>
              </Col>
            </Row>
            <Row className="home-model-selection-box">
              <Col>
                {this.renderModelSelection(modelEndpoints, selectedEndpoint)}
              </Col>
            </Row>
            <Row className="home-model-selection-box">
              <Col>
                <FormGroup row>
                  <Label for="noOfInputs" sm={2}>Number of non-range inputs:</Label>
                  <Col sm={6}>
                    <Input type="number"
                           name="noOfInputs"
                           id="noOfInputs"
                           value={inferenceInputs.length}
                           onChange={e => this.updateNoOfInputs(e.target.value)}
                    />
                  </Col>
                </FormGroup>
              </Col>
            </Row>
            <Row className="home-input-area">
              {this.renderAllInputGroups(inferenceInputs)}
            </Row>

            <Row className="home-input-area">
              <Col>
                <p>The last input is a range value. It will be used as an x-axis for the result below. The range will be
                  from start value to end value (exclusive) with the incremental step</p>
                {this.renderRangeInput(rangeInput)}

                <hr/>
              </Col>
            </Row>


            {/*<Row>*/}
            {/*  <Col>*/}
            {/*    <h3>Preview</h3>*/}
            {/*    <p>The table below shows how all inputs are combined together and sent to backend.</p>*/}
            {/*    {this.renderInputPreview(inferenceInputs, rangeInput)}*/}
            {/*  </Col>*/}
            {/*</Row>*/}

            <Row>
              <Col>
                <LoaderButton
                  color="primary"
                  onClick={this.handleInfer}
                  className="float-right"
                  isLoading={isInfering || (selectedEndpoint === 'Loading...')}
                  loadingText="Loading..."
                  text="Predict"
                />
              </Col>
            </Row>


          </Col>
        </Row>


        <Row className="home-result-graph">
          <Col>
            {this.renderGraph()}
          </Col>
        </Row>
      </OneColumnLayout>
    );
  }
}
