import * as Validator from 'validator';
import { IUser } from '../interfaces/user.interface';
import { IAuthErrors } from '../interfaces/authErrors.interface';
import { isEmpty } from './is-empty';

export const validateRegister = (data: IUser) => {
  let errors: IAuthErrors = {};

  data.username = !isEmpty(data.username) ? data.username : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : '';

  if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = 'Name field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'Confirm Password field is required';
  }

  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match';
  }

  return { errors, isValid: isEmpty(errors) };
};
