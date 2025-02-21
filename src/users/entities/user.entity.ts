import { Roles } from '../enums/roles-user.enum';

export interface User {
  id: string;
  fullName: string;
  email: string;
  telefono?: string | null;
  role: Roles;
  creadoEn?: Date;
  editadoEn?: Date;
}
