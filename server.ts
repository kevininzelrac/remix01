import { requestLifecycleHandlerFactory } from "~/server/RequestLifecycleHandler";
import { main } from "~/server/app";

// Can use different containers based on environment at this point
const root = __dirname;
main(root, requestLifecycleHandlerFactory);
