import type { MailProps } from "~/types/IMailService";

export abstract class EmailTemplate {
  abstract getSubject(): string;
  abstract getBody(): string;

  getProps(props: Omit<MailProps, "subject" | "body">): MailProps {
    return {
      ...props,
      subject: this.getSubject(),
      body: this.getBody(),
    };
  }
}
