import {
  Architecture,
  CreateFunctionCommand,
  PackageType,
  Runtime,
} from "@aws-sdk/client-lambda";
import { readFile } from "fs/promises";

const code = await readFile(`./aws/lambda/function.zip`);

const createFunction = async ({ client, name, roleArn }) => {
  try {
    const response = await client.send(
      new CreateFunctionCommand({
        Code: { ZipFile: code },
        FunctionName: name,
        Role: roleArn,
        Description: name,
        Timeout: 10,
        MemorySize: 1536,
        Handler: "index.handler",
        Architectures: [Architecture.arm64],
        PackageType: PackageType.Zip,
        Runtime: Runtime.nodejs18x,
      })
    );
    console.log(`SUCCESFULLY CREATED LAMBDA FUNCTION ${name}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export default createFunction;
