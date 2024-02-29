export enum MailType {
  VERIFY_EMAIL = "VERIFY_EMAIL",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}

export type MailParams =
  | { type: MailType.VERIFY_EMAIL; code: string }
  | { type: MailType.FORGOT_PASSWORD; url: string };

export type MailProps = {
  source?: string;
  destination: string[];
  params: MailParams;
};

export interface IMailService {
  sendEmail(props: MailProps): Promise<void>;
}
