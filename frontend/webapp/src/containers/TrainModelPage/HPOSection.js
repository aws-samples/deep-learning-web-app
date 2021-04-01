import React from "react";
import {Col, Form, Row} from "reactstrap";
import {LoaderButton} from "../../components/forms";
import {renderFields} from "../renderFields";

import './HPOSection.scss';

export const HPOSection = ({hpoParameters, isLoading, startHPO}) => {

  return (
    <>
      <Row>
        <Col>
          <h1>Hyperparameter Optimization</h1>
          <p className="hpo-instruction">
            <b>Instruction</b>: Enter tuning parameters for HPO. The application will find the best hyperparameters on
            the given range.
            You can view the best hyperparameters in CloudWatch Log.
          </p>
        </Col>
      </Row>
      <Row className="hpo-section-fields">
        <Col className="hpo-box" xs="8">
          <Form>
            <Row>
              <Col>
                {renderFields(hpoParameters)}
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col xs="8">
          <LoaderButton
            color="primary"
            onClick={startHPO}
            className="float-right"
            isLoading={isLoading}
            loadingText="Starting..."
            text="Start HPO"
          />
        </Col>
      </Row>
    </>
  );
};
