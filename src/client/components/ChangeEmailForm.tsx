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
  newEmail: { type: 'email', label: 'New email' },
} as Fields;

export const ChangeEmailForm: React.FC<Props> = ({ setError, setUpdated }) => {
  const [checked, setChecked] = useState(false);

  const handleSubmit: SubmitCallback = async ({ newEmail }, formikHelpers) => {
    formikHelpers.setSubmitting(true);

    userService
      .updateUserData('email', { newEmail })
      .then(() => setUpdated(true))
      .catch((e) => catchError(e, setError))
      .finally(() => formikHelpers.setSubmitting(false));
  };

  return (
    <>
      <p className="subtitle">Email will be changed after activation</p>

      {checked ? (
        <FormTemplate fields={fields} onSubmit={handleSubmit} />
      ) : (
        <CheckPassForm setChecked={setChecked} setError={setError} />
      )}
    </>
  );
};
