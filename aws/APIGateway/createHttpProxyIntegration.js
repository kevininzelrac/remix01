import { CreateIntegrationCommand } from "@aws-sdk/client-apigatewayv2";
import apiGatewayClient from "./apiGatewayClient.js";

const createHttpProxyIntegration = async ({ ApiId, IntegrationUri }) => {
  try {
    const response = await apiGatewayClient.send(
      new CreateIntegrationCommand({
        ApiId: ApiId,
        IntegrationType: "HTTP_PROXY",
        IntegrationUri: IntegrationUri,
        IntegrationMethod: "POST",
        RequestParameters: {
          "integration.request.header.routeKey": "context.routeKey",
          "integration.request.header.connectionId": "context.connectionId",
        },
      })
    );
    console.log(`SUCCESFULLY CREATED HTTP_PROXY INTEGRATION ${ApiId}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default createHttpProxyIntegration;
