const parser = require('papaparse'); // we will need a file parser to marshal the CSV to JSON
const AWS = require('aws-sdk'); // We need to initiate the AWS service by requiring the SDK
const S3 = new AWS.S3(); // to be able to call S3 services

const NAME_PREFIX= process.env.prefix;

exports.handler = async function(event,context, callback){
    console.log("We've received an event! :");
    console.log(JSON.stringify(event));

    const csvFile = await retrieveFileFromS3(event.Records[0].s3.object.key);
    let parsedFile = Papa.parse(uploadedFile.Body.toString(), {
        header: true
    });

    console.log("Successfully marshaled the data to JSON!");
    console.log(JSON.stringify(parsedFile.data));

    callback(null,"hello from lambda")
};


/*
    This function will invoke the
    S3 bucket and retrieve the actual file to work with inside the lambda.
 */
function retrieveFile(fileName) {

    const params = {
        Bucket: `${NAME_PREFIX}.course-petstore`,
        Key: fileName
    };
    console.log(`S3 Call initiated. Trying to retrieve file: ${params.Bucket}/${params.Key}`);
    return s3.getObject(params).promise();
}