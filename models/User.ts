import { Schema, Document, model } from 'mongoose';

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  date: Date;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default model<User>('User', UserSchema);
