import type { Transporter } from "nodemailer";
import { createTransport } from "nodemailer";

import {
  DEFAULT_MAIL_FROM,
  GMAIL_SECRET,
  GMAIL_USER,
} from "~/server/constants.server";

import type {
  MailProps,
  IMailService,
} from "~/server/interfaces/IMailService.server";
import type { ServerContext } from "~/server/interfaces/ServerContext.server";

export class LocalMailService implements IMailService {
  constructor(
    private _transport: Transporter,
    private _defaultFrom: string,
  ) {}

  async sendEmail(props: MailProps): Promise<void> {
    await this._transport.sendMail({
      from: props.source ?? this._defaultFrom,
      to: props.destination,
      subject: props.subject,
      html: props.body,
    });
  }
}

const transport = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_SECRET,
  },
});

export const getLocalMailService = (context: ServerContext) => {
  return new LocalMailService(transport, DEFAULT_MAIL_FROM);
};
