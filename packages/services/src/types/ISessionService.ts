import type { User } from "@app/db";

export interface ISessionService {
  handleCredentialSignIn(request: Request): Promise<Response>;
  handleCredentialSignUp(request: Request): Promise<Response>;
  redirectToOAuthProvider(providerName: string): Promise<Response>;
  handleOAuthResult(request: Request, providerName: string): Promise<Response>;
  handleSignOut(): Response;
  getAuthenticatedUserId(request: Request): string | null;
  getAuthenticatedUser(request: Request): Promise<User | null>;
  sendVerificationEmail(user: User): Promise<void>;
  verifyEmail(user: User, code: string): Promise<boolean>;
  sendForgotPasswordEmail(email: string, url: URL): Promise<void>;
  resetPassword(code: string, password: string): Promise<void>;
}
