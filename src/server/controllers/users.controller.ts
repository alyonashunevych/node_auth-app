import type { Request as ExpressRequest, RequestHandler } from 'express';
import { usersRepository } from '../entity/users.repository.ts';
import { ApiError } from '../exeptions/api.error.ts';
import { userService } from '../services/user.service.ts';
import bcrypt from 'bcrypt';
import type { User } from '@prisma/client';
import { mailer } from '../utils/mailer.ts';

const checkNewName = async (req: ExpressRequest, user: User) => {
  const { newName } = req.body;

  const error = userService.validateName(newName);

  if (!newName || error || newName === user.name) {
    throw ApiError.badRequest(
      'Name is invalid or the same as the current one',
      { error },
    );
  }

  return { name: newName };
};

const checkNewPassword = async (req: ExpressRequest) => {
  const { newPassword, confirmPassword } = req.body;

  const error = userService.validatePassword(newPassword);

  if (newPassword !== confirmPassword || error) {
    throw ApiError.badRequest(
      'Please enter the new and confirm passwords again',
      { error },
    );
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  return { password: hashedPassword };
};

const checkNewEmail = async (req: ExpressRequest, user: User) => {
  const { newEmail } = req.body;

  const error = userService.validateEmail(newEmail);

  if (error) {
    throw ApiError.badRequest('Invalid email', { error });
  }

  if (newEmail === user.email) {
    throw ApiError.badRequest(
      'Enter a different email address than your current one',
    );
  }

  const userWithEmail = await usersRepository.getByEmail(newEmail);

  if (userWithEmail) {
    throw ApiError.badRequest('Email is already taken');
  }

  const activationToken = bcrypt.genSaltSync(1);

  await usersRepository.update(user.id, {
    pendingEmail: newEmail,
    activationToken,
  });

  await mailer.sendActivationLink(newEmail, activationToken);
};

const checkPassword: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepository.getByEmail(email);

  if (!user || !email) {
    throw ApiError.notFound();
  }

  const isPasswordValid = await bcrypt.compare(password, user.password || '');

  if (!isPasswordValid) {
    throw ApiError.badRequest('Password is incorrect');
  }

  res.json({ isPasswordValid });
};

const changeUserData: RequestHandler = async (req, res) => {
  const { id } = req.user!;
  const { type } = req.body;
  const user = (await usersRepository.getById(id)) as User;

  if (!user) {
    throw ApiError.notFound();
  }

  let dataToUpdate;

  switch (type) {
    case 'name':
      dataToUpdate = await checkNewName(req, user);
      break;

    case 'password':
      dataToUpdate = await checkNewPassword(req);
      break;

    case 'email':
      await checkNewEmail(req, user);
      res.sendStatus(204);

      return;

    default:
      throw ApiError.badRequest('Invalid update type');
  }

  if (dataToUpdate) {
    await usersRepository.update(id, dataToUpdate);
  }

  res.sendStatus(204);
};

export const usersController = {
  changeUserData,
  checkPassword,
  checkNewPassword,
};
