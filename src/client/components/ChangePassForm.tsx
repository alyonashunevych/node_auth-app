import { userService } from '../services/userService.ts';
import { Dispatch, SetStateAction, useState } from 'react';
import { CheckPassForm } from './CheckPassForm.tsx';
import { catchError } from '../utils/catchError.ts';
import { Fields } from '../types/Fields.ts';
import { SubmitCallback } from '../types/SubmitCallback.ts';
import { FormTemplate } from './FormTemplate.tsx';

type Props = {
  setError: Dispatch<SetStateAction<string>>;
  setUpdated: Dispatch<SetStateAction<boolean>>;
};

const fields = {
  newPassword: { type: 'password', label: 'New password' },
  confirmPassword: { type: 'password', label: 'Confirm password' },
} as Fields;

export const ChangePassForm: React.FC<Props> = ({ setError, setUpdated }) => {
  const [checked, setChecked] = useState(false);

  const handleSubmit: SubmitCallback = async (
    { newPassword, confirmPassword },
    formikHelpers,
  ) => {
    formikHelpers.setSubmitting(true);

    userService
      .updateUserData('password', {
        newPassword,
        confirmPassword,
      })
      .then(() => setUpdated(true))
      .catch((e) => catchError(e, setError))
      .finally(() => formikHelpers.setSubmitting(false));
  };

  return (
    <>
      {checked ? (
        <FormTemplate fields={fields} onSubmit={handleSubmit} />
      ) : (
        <CheckPassForm setChecked={setChecked} setError={setError} />
      )}
    </>
  );
};
