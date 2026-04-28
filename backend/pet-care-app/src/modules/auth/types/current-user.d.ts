import { Role } from 'src/role/entities/role.entity';

export type CurrentUser = {
  id: string;
  role: Role;
};
