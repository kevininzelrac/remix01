import path from "node:path";

import { main } from "~/server/app";
import { serverContainer } from "~/server/services";

const BUILD_PATH = path.join(__dirname, "./build/index.js");
const VERSION_PATH = path.join(__dirname, "./build/version.txt");

// Can use different containers based on environment at this point
main(BUILD_PATH, VERSION_PATH, serverContainer);
