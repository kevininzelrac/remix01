import { IAMClient } from "@aws-sdk/client-iam";

const iamClient = new IAMClient({ region: process.env.region });
export default iamClient;
