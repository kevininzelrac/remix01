import { GetRoleCommand } from "@aws-sdk/client-iam"; // ES Modules import
import iamClient from "./iamClient.js";

const getRole = async ({ RoleName }) => {
  try {
    const response = await iamClient.send(
      new GetRoleCommand({
        RoleName: RoleName, // required
      })
    );
    console.log(`SUCCESFULLY GET IAM ROLE ${RoleName}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default getRole;
//const role = await getRole({ RoleName: process.env.appName });
//console.log(role);

// { // GetRoleResponse
//   Role: { // Role
//     Path: "STRING_VALUE", // required
//     RoleName: "STRING_VALUE", // required
//     RoleId: "STRING_VALUE", // required
//     Arn: "STRING_VALUE", // required
//     CreateDate: new Date("TIMESTAMP"), // required
//     AssumeRolePolicyDocument: "STRING_VALUE",
//     Description: "STRING_VALUE",
//     MaxSessionDuration: Number("int"),
//     PermissionsBoundary: { // AttachedPermissionsBoundary
//       PermissionsBoundaryType: "PermissionsBoundaryPolicy",
//       PermissionsBoundaryArn: "STRING_VALUE",
//     },
//     Tags: [ // tagListType
//       { // Tag
//         Key: "STRING_VALUE", // required
//         Value: "STRING_VALUE", // required
//       },
//     ],
//     RoleLastUsed: { // RoleLastUsed
//       LastUsedDate: new Date("TIMESTAMP"),
//       Region: "STRING_VALUE",
//     },
//   },
// };
