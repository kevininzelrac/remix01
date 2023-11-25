import { CreateIntegrationCommand } from "@aws-sdk/client-apigatewayv2";
import apiGatewayClient from "./apiGatewayClient.js";

const createLambdaProxyIntegration = async ({ region, ApiId, lambdaARN }) => {
  try {
    const response = await apiGatewayClient.send(
      new CreateIntegrationCommand({
        ApiId: ApiId,
        IntegrationType: "AWS_PROXY",
        IntegrationUri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdaARN}/invocations`,
        IntegrationMethod: "POST",
        //RequestParameters: {
        //  "integration.request.header.routeKey": "context.routeKey",
        //  "integration.request.header.connectionId": "context.connectionId",
        //},
      })
    );
    console.log(`SUCCESFULLY CREATED LAMBDA_PROXY INTEGRATION ${ApiId}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default createLambdaProxyIntegration;
