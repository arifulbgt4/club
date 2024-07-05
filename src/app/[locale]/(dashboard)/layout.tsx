import { redirect } from "next/navigation";
// import SidebarNav from "~/components/layout/sidebar-nav";
import { validateRequest } from "~/server/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // move to middleware and check stripe payment
  const { session } = await validateRequest();
  if (!session) redirect("/login");
  return <div className="container">{children}</div>;
}
