export interface CollaboratorsType {
  id: string;
  avatar_ur: string;
  login: string;
  role_name: string;
  permissions: {
    admin: boolean;
  };
}
