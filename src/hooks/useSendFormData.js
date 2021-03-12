import React, { useState } from 'react';

import useFetchPost from './useFetchPost';

function useSendFormData(url, defaultFormData, successMessage) {
  const [formData, setFormData] = useState(defaultFormData);

  const formIsFilled = Object.keys(defaultFormData).every(
    (key) => !!formData[key]?.trim().length
  );

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const { fetchStatus, fetchPost } = useFetchPost(url, formData, resetForm);

  let alertMessage = null;
  let alertVariant = '';
  switch (fetchStatus) {
    case 'error':
      alertMessage =
        'An unexpected error has occurred. We are sorry about that, please retry in few minutes';
      alertVariant = 'danger';
      break;
    case 'success':
      alertMessage = successMessage;
      alertVariant = 'success';
      break;
    default:
      alertMessage = null;
      alertVariant = '';
  }

  const canSendForm = formIsFilled && fetchStatus !== 'working';

  const onValueChange = (event) =>
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

  const onSubmit = (event) => {
    event.preventDefault();

    if (!canSendForm) {
      return false;
    }

    fetchPost();
  };

  const formMessage = alertMessage ? (
    <div className={`alert alert-${alertVariant}`} role="alert">
      {alertMessage}
    </div>
  ) : (
    <></>
  );

  return { onValueChange, onSubmit, formMessage, canSendForm, formData };
}
export default useSendFormData;
