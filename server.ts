import { main } from "~/server/app";
import { container } from "~/server/services";
import { Container } from "~/server/services/container.server";

// Can use different containers based on environment at this point
const serverContainer = new Container(container);
main(serverContainer);
