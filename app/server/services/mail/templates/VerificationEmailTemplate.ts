import { EmailTemplate } from "./EmailTemplate";

export class VerificationEmailTemplate extends EmailTemplate {
  constructor(private _code: string) {
    super();
  }

  getSubject(): string {
    return `${this._code} - Verification Code`;
  }

  getBody(): string {
    return `
      <p>To verify your email use the code ${this._code}.<p/>
    `.trim();
  }
}
