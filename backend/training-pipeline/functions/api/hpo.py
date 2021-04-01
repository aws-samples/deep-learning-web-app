import os
import boto3
import json

from utils import create_response_obj

dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('HPO_TABLE')
print(f"table_name = {table_name}")
model_table = dynamodb.Table(table_name)


def get(event, context):
    scan_resp = model_table.scan()

    print('====scan_resp===')
    print(json.dumps(scan_resp, indent=2))

    jobs = scan_resp['Items']
    sorted_jobs = sorted(jobs, key=lambda x: x['created'], reverse=True)

    response = create_response_obj(200, {
        'hpos': sorted_jobs
    })

    return response
