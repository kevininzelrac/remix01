export type MailProps = {
  source?: string;
  destination: string[];
  subject: string;
  body: string;
};

export interface IMailService {
  sendEmail(props: MailProps): Promise<void>;
}
