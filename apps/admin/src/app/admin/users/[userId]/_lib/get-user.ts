import { container, TYPES } from '@repo/shared/inversify';
import { UserService } from '@repo/shared/service';
import { redirect } from 'next/navigation';
import { userSchema } from '../form-schema';

export async function getUser(params: any) {
  try {
    const parsedParams = userSchema.parse(params);

    const userService = container.get<UserService>(TYPES.UserService);

    const user = await userService.findById(parsedParams.userId);

    if (user.error || user.result === undefined) {
      redirect('/users');
    }

    return user.result;
  } catch (error) {
    // Handle errors like schema validation failures
    console.error('Error fetching user:', error);
    redirect('/users'); // Redirect to users page on error
  }
}
