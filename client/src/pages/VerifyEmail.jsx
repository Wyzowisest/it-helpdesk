import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import api from '../api';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
    }

    const verify = async () => {
      try {
        const { data } = await api.get('/auth/verify-email', { params: { token } });
        setStatus('success');
        setMessage(data.message || 'Email verified successfully.');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'This verification link is invalid or expired.');
      }
    };

    verify();
  }, [searchParams]);

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-100 px-4'>
      <div className='w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm'>
        <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${isSuccess ? 'bg-emerald-50 text-emerald-600' : isLoading ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
          {isLoading && <Loader2 className='animate-spin' size={28} />}
          {isSuccess && <CheckCircle2 size={30} />}
          {status === 'error' && <XCircle size={30} />}
        </div>

        <h1 className='mb-2 text-3xl font-bold text-slate-950'>
          {isLoading ? 'One moment' : isSuccess ? 'Email verified' : 'Verification failed'}
        </h1>
        <p className='mb-6 text-sm leading-6 text-slate-500'>{message}</p>

        <Link className='inline-flex w-full items-center justify-center rounded-md bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700' to='/login'>
          Go to login
        </Link>
      </div>
    </div>
  );
}

export default VerifyEmail;
