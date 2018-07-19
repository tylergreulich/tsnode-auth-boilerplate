import { Request, Response, Router } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import User from '../../models/User';

import { validateRegister } from '../../validation/register';
import { validateLogin } from '../../validation/login';

const router = Router();

router.get(
  '/test',
  async (req: Request, res: Response): Promise<object> => {
    return await res.status(200).json({ message: 'Auth Works' });
  }
);

router.post(
  '/register',
  async (req: Request, res: Response): Promise<object> => {
    const { errors, isValid } = await validateRegister(req.body);

    if (!isValid) return res.status(400).json(errors);

    const { email, username, password, confirmPassword } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        username,
        email,
        password,
        confirmPassword
      });

      try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash;
        newUser.save();
      } catch (error) {
        throw error;
      }

      res.status(200).json(newUser);
    }
  }
);

router.post(
  '/login',
  async (req: Request, res: Response): Promise<object> => {
    const { errors, isValid } = await validateLogin(req.body);

    if (!isValid) return res.status(400).json(errors);

    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      errors.email = 'Email not found';
      return res.status(400).json(errors);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const { id, username, email } = user;
      const payload = { id, username, email };
      user.generateAuthToken(payload, res);
    } else {
      errors.password = 'Password is incorrect';
      return res.status(400).json(errors);
    }
  }
);

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { id, name, email } = req.user;
    res.status(400).json({ id, name, email });
  }
);

export { router };
