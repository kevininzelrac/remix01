import { CreateApiCommand } from "@aws-sdk/client-apigatewayv2";
import apiGatewayClient from "./apiGatewayClient.js";

const createApiGatewayV2 = async ({ Name }) => {
  try {
    const response = await apiGatewayClient.send(
      new CreateApiCommand({
        Name: Name,
        Description: Name,
        ProtocolType: "WEBSOCKET",
        RouteSelectionExpression: "request.body.action",
      })
    );
    console.log(`SUCCESFULLY CREATED API WEBSOCKET ${Name}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default createApiGatewayV2;
