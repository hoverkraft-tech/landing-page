import { useState } from 'react';

function useFetchPost(url, data, onSuccess) {
  const [fetchStatus, setFetchStatus] = useState('standby');

  const fetchPost = () => {
    setFetchStatus('working');

    fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'omit', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow', // manual, *folslow, error
      referrer: 'client', // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    }).then((response) => {
      if (response.status === 200) {
        setFetchStatus('success');
        onSuccess();
        return;
      }

      setFetchStatus('error');
    });
  };

  return { fetchStatus, fetchPost };
}
export default useFetchPost;
