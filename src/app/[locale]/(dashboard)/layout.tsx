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
  return (
    <div className="container">
      <div className="flex min-h-[calc(100vh-140px)] flex-col rounded-md  md:min-h-[calc(100vh-160px)] lg:flex-row ">
        {/* <aside className="lg:w-1/5">
          <SidebarNav />
        </aside> */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
