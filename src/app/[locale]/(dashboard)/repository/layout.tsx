import Link from "next/link";
import React from "react";
import AddRepository from "~/components/AddRepository";
import { getProviders } from "./action";

const RepositoryLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const providers = await getProviders();
  return (
    <div className=" flex flex-col gap-3">
      <h1 className="border-b pb-1 text-xl">
        Manage your project with global developers
      </h1>
      <div className="flex flex-nowrap gap-6">
        <div className=" w-[240px] rounded border">
          <AddRepository providers={providers} />
          <ul>
            <li>
              <Link href={`/repository/a`}>Marketplace</Link>
            </li>
          </ul>
        </div>
        <div className="w-[calc(100% - 240px)]">{children}</div>
      </div>
    </div>
  );
};

export default RepositoryLayout;
