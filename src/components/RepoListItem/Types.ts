import type { Provider, Repository } from "@prisma/client";

export interface RepoListItemProps extends Repository {
  provider?: Provider;
}
