import { IEncrypter } from '@/data/protocols/cryptography/Encrypter';
import { IHasher } from '@/data/protocols/cryptography/Hasher';
import { IUserRepository } from '@/data/protocols/database/users/UserRepository';
import {
  IAuthentication,
  IAuthenticationDTO,
} from '@/domain/useCases/users/Authentication';

export class Authentication implements IAuthentication {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
    private readonly encrypter: IEncrypter,
  ) {}

  async execute({
    email,
    password,
  }: IAuthenticationDTO): Promise<string | undefined> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return undefined;
    }

    const passwordIsValid = await this.hasher.compare(password, user.password);

    if (!passwordIsValid) {
      return undefined;
    }

    await this.encrypter.encrypt(user.id);

    return Promise.resolve('string');
  }
}
