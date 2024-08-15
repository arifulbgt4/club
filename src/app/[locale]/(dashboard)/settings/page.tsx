import { type User } from "lucia";
import { validateRequest } from "~/server/auth";
import SettingsForm from "./settings-form";

export default async function Settings() {
  const { user } = await validateRequest();
  return (
    <div className="flex flex-1  justify-center">
      <SettingsForm currentUser={user as User} />
    </div>
  );
}
