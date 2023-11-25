import iamClient from "./IAM/iamClient.js";
import putRolePolicy from "./IAM/putRolePolicy.js";
import listApis from "./APIGateway/listApis.js";
import account from "./account.js";

const { region, appName } = process.env;

const AWS_ID = await account();
const { ApiId } = listApis.Items.find(({ Name }) => Name === appName + "_ws");

const policyInvokeApi = await putRolePolicy({
  client: iamClient,
  roleName: appName,
  policyName: `${appName}_invokeApi`,
  policyDocument: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: ["execute-api:Invoke", "execute-api:ManageConnections"],
        Resource: `arn:aws:execute-api:${region}:${AWS_ID}:${ApiId}/*/*`,
      },
    ],
  }),
});
export default policyInvokeApi;
