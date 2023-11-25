import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import dynamoDBClient from "./dynamoDBClient.js";

const createTable = async ({
  tableName,
  primaryKey,
  primaryType,
  secondaryKey = null,
  secondaryType = null,
}) => {
  try {
    const response = await dynamoDBClient.send(
      new CreateTableCommand({
        TableName: tableName,
        TableClass: "STANDARD",
        BillingMode: "PAY_PER_REQUEST",
        DeletionProtectionEnabled: false,
        AttributeDefinitions: [
          {
            AttributeName: primaryKey,
            AttributeType: primaryType,
          },
          {
            AttributeName: secondaryKey,
            AttributeType: secondaryType,
          },
        ].filter((attr) => attr.AttributeName && attr.AttributeType), // Remove null values
        KeySchema: [
          {
            AttributeName: primaryKey,
            KeyType: "HASH",
          },
          {
            AttributeName: secondaryKey || null,
            KeyType: "RANGE",
          },
        ].filter((key) => key.AttributeName), // Remove null values
      })
    );
    console.log(`SUCCESFULLY CREATED DynamoDB TABLE ${tableName}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export default createTable;
