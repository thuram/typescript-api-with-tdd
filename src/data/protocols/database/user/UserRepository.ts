import { IUser } from '@/domain/entities/User';

export interface IDBCreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface IUserRepository {
  findByEmail: (email: string) => Promise<IUser | undefined>;

  create: (data: IDBCreateUserDTO) => Promise<IUser>;
}