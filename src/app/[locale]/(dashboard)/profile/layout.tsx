import { type Metadata } from "next";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Profile",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default Layout;
