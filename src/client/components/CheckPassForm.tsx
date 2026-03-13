import { userService } from '../services/userService.ts';
import { useAuth } from './AuthContext.tsx';
import { Dispatch, SetStateAction } from 'react';
import { catchError } from '../utils/catchError.ts';
import { Fields } from '../types/Fields.ts';
import { SubmitCallback } from '../types/SubmitCallback.ts';
import { FormTemplate } from './FormTemplate.tsx';

type Props = {
  setError: Dispatch<SetStateAction<string>>;
  setChecked: Dispatch<SetStateAction<boolean>>;
};

const fields = {
  password: { type: 'password', label: 'Password' },
} as Fields;

export const CheckPassForm: React.FC<Props> = ({ setChecked, setError }) => {
  const { currentUser } = useAuth();

  const handleSubmit: SubmitCallback = async ({ password }, formikHelpers) => {
    formikHelpers.setSubmitting(true);

    userService
      .checkPassword(password, currentUser?.email || '')
      .then(() => setChecked(true))
      .catch((e) => catchError(e, setError))
      .finally(() => formikHelpers.setSubmitting(false));
  };

  return <FormTemplate fields={fields} onSubmit={handleSubmit} />;
};
