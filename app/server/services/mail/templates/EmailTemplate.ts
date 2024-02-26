import type { MailProps } from "~/server/interfaces/IMailService.server";

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
