export interface CollaboratorsType {
  id: string;
  avatar_url: string;
  login: string;
  role_name: string;
  permissions: {
    admin: boolean;
  };
}
