import type { ProviderPublic } from "~/types";

export interface AddRepositoryProps {
  providers: ProviderPublic[];
}
export interface RepositoryListProps extends AddRepositoryProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
