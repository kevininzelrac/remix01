import lambdaClient from "./Lambda/lambdaClient.js";
import createFunctionUrlConfig from "./Lambda/createFunctionUrlConfig.js";

const lambdaFunctionUrl = await createFunctionUrlConfig({
  client: lambdaClient,
  FunctionName: process.env.appName,
});
export default lambdaFunctionUrl;
