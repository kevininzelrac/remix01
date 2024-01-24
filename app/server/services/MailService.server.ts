import type { Dependency } from "~/server/injection";
import type {
  EmailProps,
  IMailService,
  ServerContext,
} from "~/server/interfaces";

export class MailService implements IMailService, Dependency<ServerContext> {
  init(context: ServerContext): void {}

  sendEmail(props: EmailProps): Promise<void> {
    throw new Error("Not implemented yet");
  }
}
