import iamClient from "./IAM/iamClient.js";
import putRolePolicy from "./IAM/putRolePolicy.js";
import account from "./account.js";

const AWS_ID = await account();
const { appName, region } = process.env;

const policyDynamoDb = await putRolePolicy({
  client: iamClient,
  roleName: appName,
  policyName: `${appName}_dynamoDb`,
  policyDocument: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: [
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:ConditionCheckItem",
        ],
        Effect: "Allow",
        Resource: [
          `arn:aws:dynamodb:${region}:${AWS_ID}:table/${appName}_groups`,
          `arn:aws:dynamodb:${region}:${AWS_ID}:table/${appName}_meetings`,
          `arn:aws:dynamodb:${region}:${AWS_ID}:table/${appName}_members`,
          `arn:aws:dynamodb:${region}:${AWS_ID}:table/${appName}_participants`,
          `arn:aws:dynamodb:${region}:${AWS_ID}:table/${appName}_profiles`,
          `arn:aws:dynamodb:${region}:${AWS_ID}:table/${appName}_projects`,
          `arn:aws:dynamodb:${region}:${AWS_ID}:table/${appName}_refreshTokens`,
          `arn:aws:dynamodb:${region}:${AWS_ID}:table/${appName}_regions`,
          `arn:aws:dynamodb:${region}:${AWS_ID}:table/${appName}_tracks`,
          `arn:aws:dynamodb:${region}:${AWS_ID}:table/${appName}_users`,
          `arn:aws:dynamodb:${region}:${AWS_ID}:table/${appName}_messages`,
          `arn:aws:dynamodb:${region}:${AWS_ID}:table/${appName}_subscriptions`,
        ],
      },
    ],
  }),
});
export default policyDynamoDb;
