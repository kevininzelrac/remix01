export interface ISessionService {
  handleCredentialSignIn(request: Request): Promise<Response>;
  handleCredentialSignUp(request: Request): Promise<Response>;
  redirectToOAuthProvider(providerName: string): Promise<Response>;
  handleOAuthResult(request: Request, providerName: string): Promise<Response>;
  handleSignOut(): Response;
  getAuthenticatedUserId(request: Request): string | null;
  sendVerificationEmail(id: string): Promise<void>;
  verifyEmail(id: string, code: string): Promise<boolean>;
}
