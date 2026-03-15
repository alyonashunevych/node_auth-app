import { userService } from '../services/userService';
import { Dispatch, SetStateAction, useState } from 'react';
import { CheckPassForm } from './CheckPassForm';
import { catchError } from '../utils/catchError';
import { Fields } from '../types/Fields';
import { SubmitCallback } from '../types/SubmitCallback';
import { FormTemplate } from './FormTemplate';

type Props = {
  setError: Dispatch<SetStateAction<string>>;
  setUpdated: Dispatch<SetStateAction<boolean>>;
};

const fields = {
  newEmail: { type: 'email', label: 'New email' },
  confirmEmail: { type: 'email', label: 'Confirm email' },
} as Fields;

export const ChangeEmailForm: React.FC<Props> = ({ setError, setUpdated }) => {
  const [checked, setChecked] = useState(false);

  const handleSubmit: SubmitCallback = async (
    { newEmail, confirmEmail },
    formikHelpers,
  ) => {
    formikHelpers.setSubmitting(true);

    userService
      .updateUserData('email', { newEmail, confirmEmail })
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
