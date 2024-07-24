import { redirect } from "next/navigation";
import { validateRequest } from "~/server/auth";

export default async function RefreshPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await validateRequest();
  if (!session) redirect("/login");
  return children;
}
