import { redirect } from "next/navigation";
import { validateRequest } from "~/server/auth";

const RefreshPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session } = await validateRequest();
  if (!session) redirect("/login");
  return children;
};

export default RefreshPageLayout;
