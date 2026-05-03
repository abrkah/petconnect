import { UserRole } from '../../user/entities/user.entity';

export type CurrentUser = {
  id: string;
  role: UserRole;
};
