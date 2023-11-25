import { CreateRoleCommand } from "@aws-sdk/client-iam";

const createRole = async ({ client, roleName, assumeDocument }) => {
  try {
    const response = await client.send(
      new CreateRoleCommand({
        AssumeRolePolicyDocument: assumeDocument,
        RoleName: roleName,
      })
    );
    console.log(`SUCCESFULLY CREATED IAM ROLE ${roleName}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default createRole;
