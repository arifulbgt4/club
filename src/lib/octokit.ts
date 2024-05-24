import { cache } from "react";
import jwt from "jsonwebtoken";
import { Octokit, App } from "octokit";
import { validateRequest } from "~/server/auth";

export const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
  webhooks: { secret: process.env.GITHUB_WEBHOOKS_SECRET! },
  oauth: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
});

export default cache(async function Github() {
  const { user } = await validateRequest();
  return app.getInstallationOctokit(user?.installId as number);
});

export const privateKey = jwt.sign(
  {
    // Issued at time (60 seconds in the past)
    iat: Math.floor(Date.now() / 1000) - 60,
    // JWT expiration time (10 minutes)
    exp: Math.floor(Date.now() / 1000) + 10 * 60,
    // GitHub App's identifier
    iss: process.env.GITHUB_APP_ID!,
  },
  process.env.GITHUB_PRIVATE_KEY!, // Use the PEM directly for signing
  {
    algorithm: "RS256",
  }
);
