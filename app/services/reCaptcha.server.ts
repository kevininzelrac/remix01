export interface RecaptchaResult {
  recaptcha_failure: boolean;
  message: string;
  reason?: string;
}

async function reCaptcha({ token, action }: any): Promise<void> {
  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.RECAPTCHA_PROJECT_ID}/assessments?key=${process.env.GOOGLE_API_KEY}`;

  try {
    const data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: {
          token,
          expectedAction: action,
          siteKey: process.env.RECAPTCHA_SITE_KEY,
        },
      }),
    });

    const response = await data.json();

    if (
      !response ||
      !response.tokenProperties ||
      !response.riskAnalysis ||
      !response.riskAnalysis.score
    ) {
      throw new Error("The CreateAssessment call failed: unknown error");
    }

    if (!response.tokenProperties.valid) {
      throw new Error(
        `The CreateAssessment call failed: ${
          response.tokenProperties.invalidReason || "unknown error"
        }`
      );
    }

    if (
      response.riskAnalysis.score < 0.5 ||
      response.tokenProperties.action !== action
    ) {
      throw new Error(
        `Suspicious client: ${
          response.riskAnalysis?.reasons || "unknown error"
        }`
      );
    }

    // Si tout va bien, la fonction ne retourne rien (void)
  } catch (error) {
    throw new Error(`post request failed: ${error || "unknown error"}`);
  }
}

export default reCaptcha;
