import iamClient from "./IAM/iamClient.js";
import putRolePolicy from "./IAM/putRolePolicy.js";
const { appName } = process.env;

const policyStorageBucket = await putRolePolicy({
  client: iamClient,
  roleName: appName,
  policyName: `${appName}_storageBucket`,
  policyDocument: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
        Resource: `arn:aws:s3:::${appName}storage/*`,
      },
    ],
  }),
});
export default policyStorageBucket;
