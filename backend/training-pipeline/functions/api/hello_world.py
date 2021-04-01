from utils import create_response_obj


def lambda_handler(event, context):
    response = create_response_obj(200, {
        "Message": "Hello world"
    })
    print(f"response = {response}")

    return response
