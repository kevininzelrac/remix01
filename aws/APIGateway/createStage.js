import { CreateStageCommand } from "@aws-sdk/client-apigatewayv2";
import apiGatewayClient from "./apiGatewayClient.js";

const createStage = async ({ ApiId, StageName }) => {
  try {
    const response = await apiGatewayClient.send(
      new CreateStageCommand({
        ApiId: ApiId,
        StageName: StageName,
        AutoDeploy: true,
      })
    );
    console.log(`SUCCESFULLY CREATED STAGE ${StageName}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default createStage;
