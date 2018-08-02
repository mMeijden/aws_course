const parser = require('papaparse'); // we will need a file parser to marshal the CSV to JSON
const AWS = require('aws-sdk'); // We need to initiate the AWS service by requiring the SDK
const S3 = new AWS.S3(); // to be able to call S3 services

const NAME_PREFIX= process.env.prefix;
const dynamo = new AWS.DynamoDB.DocumentClient();
exports.handler = async function(event,context, callback){
    console.log("We've received an event! :");
    console.log(JSON.stringify(event));

    const csvFile = await retrieveFileFromS3(event.Records[0].s3.object.key);
    let parsedFile = parser.parse(csvFile.Body.toString(), {
        header: true
    });

    console.log("Successfully marshaled the data to JSON!");
    console.log(JSON.stringify(parsedFile.data));

    parsedFile.data.forEach(function(parsedObject){
        console.log(" saving record!");
        parsedObject.orderId = parseInt(parsedObject.orderId);
        parsedObject.itemId = parseInt(parsedObject.itemId);
        parsedObject.amount = parseInt(parsedObject.amount);

        const params ={
            TableName: `${NAME_PREFIX}_petstore`,
            Item: parsedObject
        }

        dynamo.put(params).promise()
            .then(()=>{console.log("Saved item!")})
            .catch((err)=>{console.log("Failed to save!", err)});
    });

    callback(null,"Done!");

};


/*
    This function will invoke the
    S3 bucket and retrieve the actual file to work with inside the lambda.
 */
function retrieveFileFromS3(fileName) {

    const params = {
        Bucket: `${NAME_PREFIX}.course`,
        Key: fileName
    };
    console.log(`S3 Call initiated. Trying to retrieve file: ${params.Bucket}/${params.Key}`);
    return S3.getObject(params).promise();
}