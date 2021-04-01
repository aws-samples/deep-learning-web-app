import React from "react";
import {Col, Form, Row} from "reactstrap";
import {LoaderButton} from "../../components/forms";
import {renderFields} from "../renderFields";

import './TrainNewModelSection.scss';

export const TrainNewModelSection = ({parameters, isLoading, trainNewModel}) => {

  return (
    <>
      <Row>
        <Col>
          <h1>Train a New Model</h1>
          <p className="train-instruction">
            <b>Instruction</b>: You can train the model with new data uploaded to the S3 bucket.
          </p>
        </Col>
      </Row>
      <Row className="train-section-fields">
        <Col className="train-hyperparameter-box" xs="8">
          <Form>
            <Row>
              <Col>
                {renderFields(parameters)}
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row className="train-button-box">
        <Col xs="8">
          <LoaderButton
            color="primary"
            onClick={trainNewModel}
            className="float-right"
            isLoading={isLoading}
            loadingText="Starting training process..."
            text="Train new model"
          />
        </Col>
      </Row>
    </>
  );
};
