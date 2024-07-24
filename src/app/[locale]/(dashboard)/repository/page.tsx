"use server";
import EmptyState from "~/components/shared/empty-state";
import AddRepository from "~/components/AddRepository";
import { getProviders } from "./action";

export default async function RepositoryPage() {
  const providers = await getProviders();
  return (
    <div className="flex min-h-full min-w-full flex-1 pb-10">
      <EmptyState
        border={false}
        title="Import repository and publishe issues"
        description="Otask allows users to import repositories from Github and manage issues within those repositories"
      >
        <div className="mt-2">
          <AddRepository providers={providers} />
        </div>
      </EmptyState>
    </div>
  );
}
