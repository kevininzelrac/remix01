import { CreateRouteCommand } from "@aws-sdk/client-apigatewayv2";
import apiGatewayClient from "./apiGatewayClient.js";

const createRoute = async ({ ApiId, RouteKey, IntegrationId }) => {
  try {
    const response = await apiGatewayClient.send(
      new CreateRouteCommand({
        ApiId: ApiId, // required
        RouteKey: RouteKey, // required
        Target: `integrations/${IntegrationId}`,
      })
    );
    console.log(`Route ${RouteKey} SUCCESFULLY CREATED`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default createRoute;
