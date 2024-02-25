import { main } from "~/server/app";
import { serverContainer } from "~/server/services";

// Can use different containers based on environment at this point
const root = __dirname;
main(root, () => ({ container: serverContainer }));
