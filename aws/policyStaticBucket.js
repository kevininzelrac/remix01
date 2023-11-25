import iamClient from "./IAM/iamClient.js";
import putRolePolicy from "./IAM/putRolePolicy.js";
const { appName } = process.env;

const policyStaticBucket = await putRolePolicy({
  client: iamClient,
  roleName: appName,
  policyName: `${appName}_staticBucket`,
  policyDocument: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: "s3:GetObject",
        Resource: `arn:aws:s3:::${appName}static/*`,
      },
    ],
  }),
});
export default policyStaticBucket;
