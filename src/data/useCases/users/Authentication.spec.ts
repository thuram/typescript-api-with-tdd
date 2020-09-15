import { FakeUserRepository } from '@/data/protocols/database/users/fakes/FakeUserRepository';
import { IAuthentication } from '@/domain/useCases/users/Authentication';
import { Authentication } from './Authentication';

let authentication: IAuthentication;
let fakeUserRepository: FakeUserRepository;

const makeFakeRequest = () => ({
  email: 'any_email@mail.com',
  password: 'password',
});

describe('# Authentication use case', () => {
  beforeAll(() => {
    fakeUserRepository = new FakeUserRepository();
    authentication = new Authentication(fakeUserRepository);
  });

  it('should calls UserRepositoy.findByEmail with correct email', async () => {
    const findByEmail = jest.spyOn(fakeUserRepository, 'findByEmail');

    await authentication.execute(makeFakeRequest());

    expect(findByEmail).toHaveBeenCalledWith(makeFakeRequest());
  });
});
