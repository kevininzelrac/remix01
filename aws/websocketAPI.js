import createApiGatewayV2 from "./APIGateway/createApiGatewayV2.js";
import createDeployment from "./APIGateway/createDeployment.js";
import createHttpProxyIntegration from "./APIGateway/createHttpProxyIntegration.js";
import createRoute from "./APIGateway/createRoute.js";
import createStage from "./APIGateway/createStage.js";
import getFunctionUrl from "./Lambda/getFunctionUrl.js";

const { appName } = process.env;

const { FunctionUrl } = await getFunctionUrl({ FunctionName: appName });

const apiGatewayV2 = await createApiGatewayV2({ Name: appName + "_ws" });

const integration = await createHttpProxyIntegration({
  ApiId: apiGatewayV2.ApiId,
  IntegrationUri: FunctionUrl,
});

await createRoute({
  ApiId: apiGatewayV2.ApiId,
  RouteKey: "$connect",
  IntegrationId: integration.IntegrationId,
});
await createRoute({
  ApiId: apiGatewayV2.ApiId,
  RouteKey: "$disconnect",
  IntegrationId: integration.IntegrationId,
});
await createRoute({
  ApiId: apiGatewayV2.ApiId,
  RouteKey: "$default",
  IntegrationId: integration.IntegrationId,
});

await createStage({
  ApiId: apiGatewayV2.ApiId,
  StageName: "subscriptions",
});

const websocketAPI = await createDeployment({
  ApiId: apiGatewayV2.ApiId,
  StageName: "subscriptions",
});

export default websocketAPI;
