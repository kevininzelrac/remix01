import { main } from "~/server/app";
import { serverContainer } from "~/server/services";

// Can use different containers based on environment at this point
main(serverContainer);
