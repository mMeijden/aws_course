const AWS = require('aws-sdk'); // We need to initiate the AWS service by requiring the SDK
const NAME_PREFIX= process.env.prefix;
const dynamo = new AWS.DynamoDB.DocumentClient();
exports.handler = async function(event,context, callback){
    const params = {
        TableName: `${NAME_PREFIX}_petstore`,
        KeyConditionExpression: 'orderId = :hkey',
        ExpressionAttributeValues: {
            ':hkey': event.pathParameters.orderId
        }
    };

    let results = await dynamo.query(params).promise();

    let response = {
        statusCode: 200,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache"
        },
        body: JSON.stringify(results.Items),
        isBase64Encoded: false
    };
    callback(null,response);

};