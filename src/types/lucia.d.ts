import { lucia } from "~/lib/lucia";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
  interface DatabaseUserAttributes {
    name: string;
    email: string;
    picture: string;
    username: string;
    available: boolean;
    active: boolean;
  }
}
