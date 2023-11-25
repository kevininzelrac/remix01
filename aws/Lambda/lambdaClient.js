import { LambdaClient } from "@aws-sdk/client-lambda";

const lambdaClient = new LambdaClient({ region: process.env.region });
export default lambdaClient;
