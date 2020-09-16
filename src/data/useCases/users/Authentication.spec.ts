import { FakeEncrypter } from '@/data/protocols/cryptography/fakes/FakeEncrypter';
import { FakeHasher } from '@/data/protocols/cryptography/fakes/FakeHasher';
import { FakeUserRepository } from '@/data/protocols/database/users/fakes/FakeUserRepository';
import { IAuthentication } from '@/domain/useCases/users/Authentication';
import { Authentication } from './Authentication';

let fakeEncrypter: FakeEncrypter;
let fakeHasher: FakeHasher;
let fakeUserRepository: FakeUserRepository;
let authentication: IAuthentication;

const makeFakeUser = () => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_value',
});

const makeFakeRequest = () => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

describe('# Authentication use case', () => {
  beforeAll(() => {
    fakeEncrypter = new FakeEncrypter();
    fakeHasher = new FakeHasher();
    fakeUserRepository = new FakeUserRepository();
    authentication = new Authentication(
      fakeUserRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should calls UserRepositoy.findByEmail with correct email', async () => {
    const findByEmailSpy = jest.spyOn(fakeUserRepository, 'findByEmail');

    await authentication.execute(makeFakeRequest());

    expect(findByEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should return undefined if user not found', async () => {
    const response = await authentication.execute(makeFakeRequest());

    expect(response).toBeUndefined();
  });

  it('should calls Hasher.compare with correct value', async () => {
    fakeUserRepository.create(makeFakeUser());

    const compareSpy = jest.spyOn(fakeHasher, 'compare');

    await authentication.execute(makeFakeRequest());

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_value');
  });

  it('should returns undefined if Hasher.compare fails', async () => {
    fakeUserRepository.create(makeFakeUser());

    jest
      .spyOn(fakeHasher, 'compare')
      .mockReturnValueOnce(Promise.resolve(false));

    const response = await authentication.execute(makeFakeRequest());

    expect(response).toBeUndefined();
  });

  it('should calls Encrypter.encrypt with correct value', async () => {
    fakeUserRepository.create(makeFakeUser());

    const encryptSpy = jest.spyOn(fakeEncrypter, 'encrypt');

    await authentication.execute(makeFakeRequest());

    expect(encryptSpy).toHaveBeenCalledWith('any_id');
  });

  it('should calls Encrypter.encrypt with correct value', async () => {
    fakeUserRepository.create(makeFakeUser());

    const encryptSpy = jest.spyOn(fakeEncrypter, 'encrypt');

    await authentication.execute(makeFakeRequest());

    expect(encryptSpy).toHaveBeenCalledWith('any_id');
  });

  it('should returns access token on success', async () => {
    fakeUserRepository.create(makeFakeUser());

    const response = await authentication.execute(makeFakeRequest());

    expect(response).toEqual('any_token');
  });
});