export type EmailProps = {
  source: string;
  destination: {
    toAddresses: string[];
  };
  message: {
    subject: string;
    body: string;
  };
};

export interface IMailService {
  sendEmail(props: EmailProps): Promise<void>;
}
