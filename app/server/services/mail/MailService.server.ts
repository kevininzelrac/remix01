import type { Transporter } from "nodemailer";

import type { Dependency } from "~/server/injection";
import type {
  MailProps,
  IMailService,
  ServerContext,
} from "~/server/interfaces";

export class MailService implements IMailService, Dependency<ServerContext> {
  constructor(
    private _transport: Transporter,
    private _defaultFrom: string,
  ) {}

  init(context: ServerContext): void {}

  async sendEmail(props: MailProps): Promise<void> {
    await this._transport.sendMail({
      from: props.source ?? this._defaultFrom,
      to: props.destination,
      subject: props.subject,
      html: props.body,
    });
  }
}
