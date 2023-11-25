import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

const stsClient = new STSClient();

const account = async () => {
  try {
    const { Account } = await stsClient.send(new GetCallerIdentityCommand({}));
    console.log(`SUCCESFULLY GET AWS ID ${Account}`);
    return Account;
  } catch (error) {
    console.error(error);
  }
};
export default account;
