import json
import copy

DEFAULT_SECURITY_HEADERS = {
    'Strict-Transport-Security' : 'max-age=31540000',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
    'Access-Control-Allow-Origin': '*',
}


def create_response_obj(status_code, body):
    headers = copy.deepcopy(DEFAULT_SECURITY_HEADERS)
    headers['Content-Type'] = 'application/json'

    return {
        'statusCode': status_code,
        'body': json.dumps(body, default=str),
        'headers': headers
    }
