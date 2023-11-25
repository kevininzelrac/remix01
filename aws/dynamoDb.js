import createTable from "./DynamoDb/createTable.js";
const { appName } = process.env;

await createTable({
  tableName: appName + "_users",
  primaryKey: "email",
  primaryType: "S",
});

await createTable({
  tableName: appName + "_refreshTokens",
  primaryKey: "userId",
  primaryType: "S",
  secondaryKey: "token",
  secondaryType: "S",
});

await createTable({
  tableName: appName + "_subscriptions",
  primaryKey: "id",
  primaryType: "S",
  secondaryKey: "subId",
  secondaryType: "S",
});

await createTable({
  tableName: appName + "_profiles",
  primaryKey: "userId",
  primaryType: "S",
});

await createTable({
  tableName: appName + "_groups",
  primaryKey: "userId",
  primaryType: "S",
  secondaryKey: "label",
  secondaryType: "S",
});

await createTable({
  tableName: appName + "_members",
  primaryKey: "groupId",
  primaryType: "S",
  secondaryKey: "id",
  secondaryType: "S",
});

await createTable({
  tableName: appName + "_messages",
  primaryKey: "groupId",
  primaryType: "S",
  secondaryKey: "DT",
  secondaryType: "S",
});

await createTable({
  tableName: appName + "_projects",
  primaryKey: "groupId",
  primaryType: "S",
  secondaryKey: "label",
  secondaryType: "S",
});

await createTable({
  tableName: appName + "_tracks",
  primaryKey: "projectId",
  primaryType: "S",
  secondaryKey: "id",
  secondaryType: "S",
});

await createTable({
  tableName: appName + "_regions",
  primaryKey: "trackId",
  primaryType: "S",
  secondaryKey: "id",
  secondaryType: "S",
});

await createTable({
  tableName: appName + "_meetings",
  primaryKey: "groupId",
  primaryType: "S",
  secondaryKey: "DT",
  secondaryType: "S",
});

await createTable({
  tableName: appName + "_participants",
  primaryKey: "meetingId",
  primaryType: "S",
  secondaryKey: "userId",
  secondaryType: "S",
});

const dynamoDB = () => {};
export default dynamoDB;
