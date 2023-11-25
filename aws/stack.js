import "dotenv/config";
const { AWS_ID, region, appName } = process.env;
//console.log(region, appName);

import { URL } from "node:url";

import { IAMClient } from "@aws-sdk/client-iam";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { S3Client } from "@aws-sdk/client-s3";
import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
//import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

import createRole from "./IAM/createRole.js";
import createFunction from "./Lambda/createFunction.js";
import putRolePolicy from "./IAM/putRolePolicy.js";
import createBucket from "./S3/createBucket.js";
import createFunctionUrlConfig from "./Lambda/createFunctionUrlConfig.js";
import createOriginAccessControl from "./CloudFront/createOriginAccess.js";
import createDistribution from "./CloudFront/createDistribution.js";
import putBucketPolicy from "./S3/putBucketPolicy.js";

const iamClient = new IAMClient({ region });
const lambdaClient = new LambdaClient({ region });
const s3Client = new S3Client({ region });
const cloudFrontClient = new CloudFrontClient({ region });
//const stsClient = new STSClient();

// const awsId = async () => {
//   try {
//     const { Account } = await stsClient.send(new GetCallerIdentityCommand({}));
//     console.log(`SUCCESFULLY GET AWS ID ${Account}`);
//     return Account;
//   } catch (error) {
//     console.error(error);
//   }
// };
// const id = await awsId();

const IAM = await createRole({
  client: iamClient,
  roleName: appName,
  assumeDocument: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
        Action: "sts:AssumeRole",
      },
    ],
  }),
});

console.log("please wait...");
await new Promise((resolve) => setTimeout(resolve, 10000));

const lambda = await createFunction({
  client: lambdaClient,
  name: appName,
  roleArn: IAM.Role.Arn,
});

await putRolePolicy({
  client: iamClient,
  roleName: appName, //IAM.Role.RoleName,
  policyName: `${appName}_lambda`, //`${IAM.Role.RoleName}_lambda`,
  policyDocument: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        Resource: `arn:aws:logs:${region}:${AWS_ID}:log-group:/aws/lambda/${appName}:*`,
      },
    ],
  }),
});

await putRolePolicy({
  client: iamClient,
  roleName: appName, //IAM.Role.RoleName,
  policyName: `${appName}_invokeFunctionUrl`, //`${IAM.Role.RoleName}_invokeFunctionUrl`,
  policyDocument: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: "lambda:InvokeFunctionUrl",
        Resource: "*",
      },
    ],
  }),
});

const { FunctionUrl } = await createFunctionUrlConfig({
  client: lambdaClient,
  functionName: lambda.FunctionName,
});
const lambdaFunctionUrl = new URL(FunctionUrl).hostname;

await createBucket(s3Client, appName);

await putRolePolicy({
  client: iamClient,
  roleName: appName,
  policyName: `${appName}_bucket`,
  policyDocument: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
        Resource: `arn:aws:s3:::${appName}/*`,
      },
    ],
  }),
});

const { OriginAccessControl } = await createOriginAccessControl({
  client: cloudFrontClient,
  id: `${appName}.s3.${region}.amazonaws.com`,
  description: appName,
});

const cloudfront = await createDistribution({
  client: cloudFrontClient,
  name: appName,
  bucketOriginDomain: `${appName}.s3.${region}.amazonaws.com`,
  OAC_ID: OriginAccessControl.Id,
  lambdaUrlOriginDomain: lambdaFunctionUrl,
});

await putBucketPolicy({
  client: s3Client,
  name: appName,
  document: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "AllowCloudFrontServicePrincipal",
        Effect: "Allow",
        Principal: {
          Service: "cloudfront.amazonaws.com",
        },
        Action: "s3:GetObject",
        Resource: `arn:aws:s3:::${appName}/*`,
        Condition: {
          StringEquals: {
            "AWS:SourceArn": cloudfront.Distribution.ARN,
          },
        },
      },
    ],
  }),
});

console.log(
  `GROOVE STACK UP and RUNNIN \n
  https://${cloudfront.Distribution.DomainName}
  Happy Coding ! 🚀
  `
);
