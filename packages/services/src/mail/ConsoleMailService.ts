import { MailProps, IMailService } from "~/types/IMailService";

export class ConsoleMailService implements IMailService {
  async sendEmail(props: MailProps): Promise<void> {
    console.debug("Got mail:", props);
  }
}

export const getConsoleMailService = () => {
  return () => {
    return new ConsoleMailService();
  };
};
