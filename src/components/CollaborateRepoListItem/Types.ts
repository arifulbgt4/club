import type { Provider, Repository } from "@prisma/client";

export interface CollaborateRepoListItemProps extends Repository {
  provider?: Provider;
  collaborateId: string;
}
