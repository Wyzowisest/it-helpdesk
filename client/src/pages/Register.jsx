import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api, { saveSession } from '../api';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', form);
      saveSession(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-100 px-4'>
      <div className='w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm'>
        <h1 className='mb-2 text-3xl font-bold text-slate-950'>Create account</h1>
        <p className='mb-6 text-sm text-slate-500'>Register as a user, technician, or admin.</p>

        {error && <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700'>{error}</div>}

        <form className='space-y-4' onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Full Name'
            className='w-full rounded-md border border-slate-300 p-3 text-slate-900 outline-blue-500'
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <input
            type='email'
            placeholder='Email'
            className='w-full rounded-md border border-slate-300 p-3 text-slate-900 outline-blue-500'
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <input
            type='password'
            placeholder='Password'
            className='w-full rounded-md border border-slate-300 p-3 text-slate-900 outline-blue-500'
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <input
            type='text'
            placeholder='Department'
            className='w-full rounded-md border border-slate-300 p-3 text-slate-900 outline-blue-500'
            value={form.department}
            onChange={(event) => setForm({ ...form, department: event.target.value })}
          />
          <select
            className='w-full rounded-md border border-slate-300 p-3 text-slate-900 outline-blue-500'
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
          >
            <option value='user'>User / Employee</option>
            <option value='staff'>Support Staff / Technician</option>
            <option value='admin'>Admin</option>
          </select>

          <button className='flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 p-3 font-semibold text-white hover:bg-emerald-700' disabled={loading}>
            <UserPlus size={18} />
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className='mt-5 text-center text-sm text-slate-500'>
          Already registered? <Link className='font-semibold text-blue-700' to='/login'>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
