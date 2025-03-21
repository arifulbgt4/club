import { type Metadata } from "next";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Payment",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default Layout;
