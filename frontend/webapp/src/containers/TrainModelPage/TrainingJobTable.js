import React, {useCallback, useEffect, useState} from "react";
import {Col, Row, Table} from "reactstrap";
import BouncingLoader from "../../components/BouncingLoader";
import {API} from "aws-amplify";
import {LoaderButton} from "../../components/forms";
import {TRAINING_TYPES} from "../../constants";
import {displayDate, getNameFromArn, useInterval} from "../utils";

import './TrainingJobTable.scss';

const CLOUDWATCH_LOG_BASE_URL = 'https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Faws$252Fsagemaker$252FTrainingJobs$3FlogStreamNameFilter$3D';

export const TrainingJobTable = ({trainingType}) => {
  const [trainingJobs, setTrainingJob] = useState([]);
  const [isRefreshingTrainingJobs, setRefreshTrainingJobs] = useState(false);

  const displaySettings = {
    [TRAINING_TYPES.MODEL]: [
      {
        key: 'trainingId',
        header: 'ID',
        displayTableData: trainingId => trainingId.split(':')[7],
      },
      {
        key: 'created',
        header: 'Creation Time',
        displayTableData: displayDate,
      },
      {
        key: 'status',
        header: 'Status',
        displayTableData: text => text,
      },
      {
        key: 'modelArn',
        header: 'SageMaker Model',
        displayTableData: getNameFromArn,
      },
      {
        key: 'endpointArn',
        header: 'SageMaker Model Endpoint',
        displayTableData: getNameFromArn,
      },
    ],
    [TRAINING_TYPES.HPO]: [
      {
        key: 'trainingId',
        header: 'ID',
        displayTableData: trainingId => trainingId.split(':')[7],
      },
      {
        key: 'created',
        header: 'Creation Time',
        displayTableData: created => created,
      },
      {
        key: 'status',
        header: 'Status',
        displayTableData: text => text,
      },
    ],
  };


  const refreshTrainingJobs = useCallback(async () => {
    setRefreshTrainingJobs(true);
    const isTypeModel = (trainingType === TRAINING_TYPES.MODEL);
    const apiPath = isTypeModel ? 'model' : 'hpo';
    const result = await API.get("pyapi", apiPath, {});
    const jobs = isTypeModel ? result.models : result.hpos;
    setTrainingJob(jobs.slice(0, 5) || []);
    setRefreshTrainingJobs(false);
  }, [trainingType]);

  const renderTrainingTable = (type) => {
    return (
      <Table striped size="sm">
        <thead>
        <tr>
          {
            displaySettings[type]
              .map(({key, header}) =>
                <th key={key}>
                  {header}
                </th>
              )
          }
          <th>CloudWatch Log</th>
        </tr>
        </thead>
        <tbody>
        {renderTrainingJobRows(type)}
        </tbody>
      </Table>
    )
  };


  const renderTrainingJobRows = (type) => {
    let rows = [];

    if (isRefreshingTrainingJobs) {
      return (
        <tr>
          <td colSpan="6"><BouncingLoader/></td>
        </tr>
      )
    }

    if (trainingJobs.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center">
            No job
          </td>
        </tr>
      );
    } else {
      for (let job of trainingJobs) {
        const filter = type + '-' + job.created.substring(0, 10);
        rows.push(
          <tr key={job.trainingId}>

            {
              displaySettings[type]
                .map(({key, displayTableData}) =>
                  <td key={key}>
                    {displayTableData(job[key])}
                  </td>
                )
            }
            <td><a href={CLOUDWATCH_LOG_BASE_URL + filter} target="_blank" rel="noopener noreferrer">Link</a></td>
          </tr>
        )
      }
    }
    return rows;
  };

  useEffect(() => {
    refreshTrainingJobs();
  }, [refreshTrainingJobs]);

  useInterval(refreshTrainingJobs, 30000);

  return (
    <>
      <Row>
        <Col className="refresh-col">
          <LoaderButton
            color="secondary"
            onClick={refreshTrainingJobs}
            className="float-right"
            isLoading={isRefreshingTrainingJobs}
            loadingText="Refreshing..."
            text="Refresh"
          />
          <small className="auto-refresh-desc"> Auto-refresh every 30 seconds.</small>
        </Col>
      </Row>
      <Row>
        <Col>
          {renderTrainingTable(trainingType)}
        </Col>
      </Row>
    </>
  );
};

