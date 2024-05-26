// import { redirect } from "next/navigation";
// import { validateRequest } from "~/server/auth";

interface IssueLayoutProps {
  children: React.ReactNode;
}

export default async function IssueLayout({ children }: IssueLayoutProps) {
  // move to middleware and check stripe payment
  //   const { session } = await validateRequest();
  //   if (!session) redirect("/login");
  return <div className=" container">{children}</div>;
}
