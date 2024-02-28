import type { Transporter } from "nodemailer";
import { createTransport } from "nodemailer";

import type { MailProps, IMailService } from "~/types/IMailService";

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

export type LocalMailServiceOptions = {
  host: string;
  user: string;
  secret: string;
  from: string;
};

export const getLocalMailService = ({
  host,
  user,
  secret,
  from,
}: LocalMailServiceOptions) => {
  const transport = createTransport({
    host,
    port: 465,
    secure: true,
    auth: {
      user,
      pass: secret,
    },
  });
  return () => {
    return new LocalMailService(transport, from);
  };
};
