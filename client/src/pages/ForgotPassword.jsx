import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import api from '../api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message || 'If that email exists, a reset link has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-100 px-4'>
      <div className='w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm'>
        <h1 className='mb-2 text-3xl font-bold text-slate-950'>Reset password</h1>
        <p className='mb-6 text-sm text-slate-500'>Enter your account email and we will send a reset link.</p>

        {error && <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700'>{error}</div>}
        {message && <div className='mb-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700'>{message}</div>}

        <form className='space-y-4' onSubmit={handleSubmit}>
          <input
            type='email'
            placeholder='Email'
            className='w-full rounded-md border border-slate-300 p-3 text-slate-900 outline-blue-500'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button className='flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70' disabled={loading}>
            <Mail size={18} />
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className='mt-5 text-center text-sm text-slate-500'>
          Remembered it? <Link className='font-semibold text-blue-700' to='/login'>Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
