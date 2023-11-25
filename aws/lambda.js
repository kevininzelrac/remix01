import lambdaClient from "./Lambda/lambdaClient.js";
import createFunction from "./Lambda/createFunction.js";
import getRole from "./IAM/getRole.js";

export const IAM = await getRole({ RoleName: process.env.appName });

const lambda = await createFunction({
  client: lambdaClient,
  name: process.env.appName,
  roleArn: IAM.Role.Arn,
});
export default lambda;
