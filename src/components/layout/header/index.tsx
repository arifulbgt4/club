import { getScopedI18n } from "~/locales/server";
import { validateRequest } from "~/server/auth";
import Navbar from "./navbar";

export default async function Header() {
  const { session, user } = await validateRequest();
  const scopedT = await getScopedI18n("header");
  const headerText = {
    changelog: scopedT("changelog"),
    about: scopedT("about"),
    login: scopedT("login"),
    dashboard: scopedT("dashboard"),
  };
  return (
    <header className="w-full">
      <div className="container">
        <Navbar
          headerText={headerText}
          session={session!}
          user={{
            id: user?.id as string,
            name: user?.name as string,
            username: user?.username as string,
            picture: user?.picture as string,
          }}
        />
      </div>
    </header>
  );
}
