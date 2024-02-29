import type { Transporter } from "nodemailer";
import { createTransport } from "nodemailer";

import {
  MailProps,
  IMailService,
  MailType,
  MailParams,
} from "~/types/IMailService";

type RendererOutput = {
  subject: string;
  html: string;
};

export class LocalMailService implements IMailService {
  constructor(
    private _transport: Transporter,
    private _defaultFrom: string,
  ) {}

  async sendEmail(props: MailProps): Promise<void> {
    await this._transport.sendMail({
      from: props.source ?? this._defaultFrom,
      to: props.destination,
      ...this._getRendererOutput(props.params),
    });
  }

  private _getRendererOutput(params: MailParams): RendererOutput {
    switch (params.type) {
      case MailType.VERIFY_EMAIL: {
        return this._getVerifyEmailRendererOutput(params);
      }
      case MailType.FORGOT_PASSWORD: {
        return this._getForgotPasswordRendererOutput(params);
      }
    }
  }

  private _getVerifyEmailRendererOutput(
    params: MailParams & { type: MailType.VERIFY_EMAIL },
  ): RendererOutput {
    return {
      subject: `${params.code} - Verification Code`,
      html: `
        <p>To verify your email use the code ${params.code}.</p>
      `.trim(),
    };
  }

  private _getForgotPasswordRendererOutput(
    params: MailParams & { type: MailType.FORGOT_PASSWORD },
  ): RendererOutput {
    return {
      subject: "Reset your password",
      html: `
        <p>Click <a href="${params.url}">here</a> to reset your password.</p>
      `.trim(),
    };
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
