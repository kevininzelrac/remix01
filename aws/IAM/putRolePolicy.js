import { PutRolePolicyCommand } from "@aws-sdk/client-iam";

const putRolePolicy = async ({
  client,
  roleName,
  policyName,
  policyDocument,
}) => {
  try {
    const response = await client.send(
      new PutRolePolicyCommand({
        RoleName: roleName,
        PolicyName: policyName,
        PolicyDocument: policyDocument,
      })
    );
    console.log(`SUCCESFULLY CREATED IAM ROLE POLICY ${policyName}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default putRolePolicy;
