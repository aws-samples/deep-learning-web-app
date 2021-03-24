import json
import boto3
import logging
import io
import numpy as np
import pandas as pd

from utils import create_response_obj

# scaler = load(open('scaler.pkl', 'rb'))

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def post(event, context):
    if event['body'] is not None:
        body = json.loads(event['body'])
        params = body['input']

        # The last range parameter
        range = body['range']
        start = range['start']
        end = range['end']
        step = range['step']
        endpoint_name = body['modelName']
    else:
        return create_response_obj(400, {
            'error': 'invalid message body'
        })

    logger.info('params: {}'.format(params))
    params = [float(i) for i in params]

    all_data = []
    xaxis = []

    # Build CSV with these values
    # Input#1, Input#2, .....#Input 19, Input#20
    # 1, 2, 3..., 19, 1.1
    # 1, 2, 3..., 19, 1.2
    # 1, 2, 3..., 19, 1.3
    # ....
    # 1, 2, 3..., 19, 2.8
    # 1, 2, 3..., 19, 2.9
    # 1, 2, 3..., 19, 3.0
    for i in np.arange(start, end, step):
        all_data.append(params + [i])
        xaxis.append(str(i))

    logger.info('xaxis: {}'.format(xaxis))
    logger.info('all_data[0]: {}'.format(all_data[0]))
    logger.info(f'all_data: {all_data}')

    df = pd.DataFrame(np.array(all_data))
    test_file = io.StringIO()
    logger.info(df.head())
    df.to_csv(test_file, header=None, index=None)

    try:
        client = boto3.client('sagemaker-runtime')
        response = client.invoke_endpoint(
            EndpointName=endpoint_name,
            Body=test_file.getvalue(),
            ContentType='text/csv',
            Accept='Accept'
        )

        preds_string = response['Body'].read().decode('ascii').split()
        preds = list(map(lambda x: float(x), preds_string))

        return create_response_obj(200, {
            'x_axis': xaxis,
            'predictions': preds,
        })
    except client.exceptions.ModelError as e:
        logger.error(repr(e))
        return create_response_obj(502, {
            'error': repr(e),
        })


