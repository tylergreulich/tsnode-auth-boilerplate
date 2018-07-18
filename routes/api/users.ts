import { Request, Response, Router } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import User from '../../models/User';

const router = Router();

router.get('/test', async (req: Request, res: Response) => {
  return await res.status(200).json({ message: 'Auth Works' });
});

router.post('/register', (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (user) {
      return res.status(400).json({ msg: 'Email already exists' });
    } else {
      const newUser = new User({
        username,
        email,
        password
      });

      bcrypt.genSalt(10, (err: Error, salt: string) => {
        bcrypt.hash(newUser.password, salt, (err: Error, hash: string) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post('/register2', async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  const user = await User.findOne({ email });

  if (user) return res.status(400).json({ msg: 'Error' });

  const newUser = new User({
    username,
    email,
    password
  });

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;
    newUser.save();
  } catch (error) {
    throw error;
  }

  const response = await res.status(200).json(newUser);
  console.log(response);
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Email not found' });

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    const payload = { id: user.id, username: user.username };
    jwt.sign(
      payload,
      'secret',
      { expiresIn: 3600 },
      (err: Error, token: string) => {
        res.json({ success: true, token: `Bearer ${token}` });
      }
    );
  } else {
    return res.status(400).json({ msg: 'Password is incorrect' });
  }
});

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { id, name, email } = req.user;
    res.status(400).json({ id, name, email });
  }
);

export { router };
