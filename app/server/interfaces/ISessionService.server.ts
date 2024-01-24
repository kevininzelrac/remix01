import type { User } from "@prisma/client";

export interface ISessionService {
  handleCredentialSignIn(request: Request): Promise<Response>;
  handleCredentialSignUp(request: Request): Promise<Response>;
  redirectToOAuthProvider(providerName: string): Promise<Response>;
  handleOAuthResult(request: Request, providerName: string): Promise<Response>;
  handleSignOut(): Response;
  getAuthenticatedUserId(request: Request): string | null;
  sendVerificationEmail(user: User): Promise<void>;
  verifyEmail(user: User, code: string): Promise<boolean>;
}
