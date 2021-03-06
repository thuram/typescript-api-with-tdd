import { IUserTokenRepository } from '@/data/protocols/database/users/UserTokenRepository';
import { getRepository, Repository } from 'typeorm';
import UserToken from '../entities/UserToken';

export class UserTokenRepository implements IUserTokenRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  async create(userId: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({ user_id: userId });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  async findByToken(token: string): Promise<UserToken | undefined> {
    return this.ormRepository.findOne({ where: { token } });
  }
}
