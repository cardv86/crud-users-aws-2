const aws = require('aws-sdk');

let dynamoDBClientParams = {}; //-- Si está vacío coge la cnx de la nube

if( process.env.IS_OFFLINE ){ //-- Si el entorno es local y no cloud. Entonces, aumentamos los atributos dummies
    dynamoDBClientParams = {
        region: 'localhost',
        endpoint: 'http://0.0.0.0:8000',
        accessKeyId: 'MockAccessKeyId',
        secretAccessKey: 'MockSecretAccessKey'
    };
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamoDBClientParams); //-- asignar params dynamoDB

const updateUsers = async (event, context) => {

    //-- "event" hace referencia al serverless.yml sección functions.events. En este caso es "http",
    //-- pero tbm puede ser "schedule", "eventBridge", etc
    let userId = event.pathParameters.id; 

    const body = JSON.parse(event.body);

    var params = {
        TableName: 'usersTable',
        Key: {pk: userId},
        UpdateExpression: 'set #name = :name, #phone = :phone, #address = :address',
        ExpressionAttributeNames: {'#name' : 'name', '#phone' : 'phone', '#address' : 'address'},
        ExpressionAttributeValues: {':name': body.name, ':phone': body.phone, ':address': body.address},
        ReturnValues: 'ALL_NEW'
    };

    return dynamodb.update(params).promise().then(res => {
        console.log(res);
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': res })
        }
    });
    
}

module.exports = {
    updateUsers
}
