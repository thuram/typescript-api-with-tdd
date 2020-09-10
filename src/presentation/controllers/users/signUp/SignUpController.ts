import { IController } from '@/presentation/protocols/controller';
import { IRequest, IResponse } from '@/presentation/protocols/http';
import { CreateUser } from '@/data/useCases/user/Createuser';

export class SignUpController implements IController {
  constructor(private readonly createUser: CreateUser) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    try {
      const { name, email, password, passwordConfirmation } = body;

      const user = await this.createUser.execute({
        name,
        email,
        password,
        passwordConfirmation,
      });

      return { statusCode: 200, body: user };
    } catch (error) {
      return { statusCode: 400, body: { message: error.message } };
    }
  }
}