import os
import boto3
from boto3.dynamodb.conditions import Key

client = boto3.client('sagemaker')

dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('MODEL_TABLE')
print(f'table_name = {table_name}')
model_table = dynamodb.Table(table_name)

MAX_NUMBER_ENDPOINT = int(os.environ.get('MAX_NUMBER_END_POINT', '5'))


def lambda_handler(event, context):
    # Print inputs
    print(f"event['trainingId'] = {event['trainingId']}")
    print(f"event['created'] = {event['created']}")
    training_id = event['trainingId']
    created = event['created']

    # List all end points
    list_response = client.list_endpoints(
        SortBy='CreationTime',
        SortOrder='Ascending'
    )
    endpoints = list_response['Endpoints']

    print('Comparing against max number of endpoint')
    print(f'MAX_NUMBER_ENDPOINT = {MAX_NUMBER_ENDPOINT}')
    if len(endpoints) >= MAX_NUMBER_ENDPOINT:
        print('Deleting the oldest endpoint')
        endpoint_to_delete = endpoints[0]['EndpointName']
        client.delete_endpoint(
            EndpointName=endpoint_to_delete
        )
        delete_msg = f'Endpoint {endpoint_to_delete} has been deleted.'
        print(delete_msg)

        endpoint_arn = endpoints[0]['EndpointArn']
        update_endpoint_arn(endpoint_arn, 'DELETED')

        print('Updating DynamoDB record')
        model_table.update_item(
            Key={
                'trainingId': training_id,
                'created': created
            },
            UpdateExpression='SET #st = :ns',
            ExpressionAttributeNames={
                '#st': 'status'
            },
            ExpressionAttributeValues={
                ':ns': 'ENDPOINT_DELETED'
            }
        )

        return delete_msg

    else:
        return 'No endpoint deleted'


def update_endpoint_arn(arn, status):
    response = model_table.query(
        IndexName='endpointArn',
        KeyConditionExpression=Key('endpointArn').eq(arn)
    )
    items = response['Items']
    if len(items) > 0:
        item = items[0]
        model_table.update_item(
            Key={
                'trainingId': item['trainingId'],
                'created': item['created']
            },
            UpdateExpression='SET #st = :ns',
            ExpressionAttributeNames={
                '#st': 'status'
            },
            ExpressionAttributeValues={
                ':ns': status
            }
        )
