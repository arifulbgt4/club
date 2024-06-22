import { lucia } from "~/lib/lucia";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
  interface DatabaseUserAttributes {
    name: string;
    email: string;
    picture: string;
    accessToken: string;
    username: string;
    installId: number;
    stripeCustomerId: string;
  }
}
