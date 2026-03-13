import { httpClient } from '../http/httpClient';

type UpdateType = 'name' | 'password' | 'email';

type UpdateUserData =
  | {
      newName: string;
    }
  | {
      newPassword: string;
      confirmPassword: string;
    }
  | {
      newEmail: string;
    };

export const userService = {
  updateUserData: (type: UpdateType, data: UpdateUserData) => {
    return httpClient.patch(`/profile`, { type, ...data });
  },

  checkPassword: (password: string, email: string) => {
    return httpClient.post(`/profile/check`, { email, password });
  },
};
