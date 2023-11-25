import createApiGatewayV2 from "./createApiGatewayV2.js";
import createDeployment from "./createDeployment.js";
import createHttpProxyIntegration from "./createHttpProxyIntegration.js";
import createRoute from "./createRoute.js";
import createStage from "./createStage.js";

region = "us-east-1";

const apiGatewayV2 = await createApiGatewayV2({ Name: "test01" });

const integration = await createHttpProxyIntegration({
  ApiId: apiGatewayV2.ApiId,
  IntegrationUri: `https://xxxxxx.lambda-url.${region}.on.aws/`,
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

await createDeployment({
  ApiId: apiGatewayV2.ApiId,
  StageName: "subscriptions",
});
