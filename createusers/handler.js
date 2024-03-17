const aws = require('aws-sdk');
const { randomUUID } = require('crypto');

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

const createUsers = async (event, context) => {

    const id = randomUUID(); //- id autogenerate 
    
    let userBody = JSON.parse(event.body); //-- obtener cuerpo del POST
    userBody.pk = id; //-- agregar atributo pk con el id autogenerado

    var params = {
        TableName: 'usersTable',
        Item: userBody
    };
    console.log("createUsers - inputs = " + params.Item);

    return dynamodb.put(params).promise().then(res => {
        console.log("createUsers - response = " + res);
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': params.Item })
        }
    });
    
}

module.exports = {
    createUsers
}
