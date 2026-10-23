import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import api from '../api';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token') || '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Reset token is missing.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/reset-password', { token, password });
      setMessage(data.message || 'Password reset successful. You can now log in.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-100 px-4'>
      <div className='w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm'>
        <h1 className='mb-2 text-3xl font-bold text-slate-950'>Choose new password</h1>
        <p className='mb-6 text-sm text-slate-500'>Create a new password for your IT Support Center account.</p>

        {error && <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700'>{error}</div>}
        {message && <div className='mb-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700'>{message}</div>}

        <form className='space-y-4' onSubmit={handleSubmit}>
          <input
            type='password'
            placeholder='New password'
            className='w-full rounded-md border border-slate-300 p-3 text-slate-900 outline-blue-500'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Confirm new password'
            className='w-full rounded-md border border-slate-300 p-3 text-slate-900 outline-blue-500'
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <button className='flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70' disabled={loading || Boolean(message)}>
            <KeyRound size={18} />
            {loading ? 'Saving...' : 'Reset password'}
          </button>
        </form>

        <p className='mt-5 text-center text-sm text-slate-500'>
          Ready to sign in? <Link className='font-semibold text-blue-700' to='/login'>Go to login</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
