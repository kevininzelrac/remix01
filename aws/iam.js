import iamClient from "./IAM/iamClient.js";
import createRole from "./IAM/createRole.js";

const IAM = await createRole({
  client: iamClient,
  roleName: process.env.appName,
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
export default IAM;
