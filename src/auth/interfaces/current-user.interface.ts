import { Roles } from '../enums/roles-user.enum';
import { Dirrecion } from './direccion-user.interface';

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  telefono: number;
  roles: Roles[];
  direccion: Dirrecion;
}
