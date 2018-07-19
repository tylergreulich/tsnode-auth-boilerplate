import * as Validator from 'validator';
import { IUser } from '../interfaces/user.interface';
import { IAuthErrors } from '../interfaces/authErrors.interface';
import { isEmpty } from './is-empty';

export interface RegisterErrors {
  email?: string;
  password?: string;
}

export const validateLogin = (data: IUser) => {
  let errors: IAuthErrors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return { errors, isValid: isEmpty(errors) };
};
