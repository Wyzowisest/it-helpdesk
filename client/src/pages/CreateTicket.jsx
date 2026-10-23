import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

function CreateTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Hardware',
    priority: 'Medium'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/tickets', form);
      toast.success(`Ticket ${data.ticketNumber || ''} submitted successfully.`.trim());
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Ticket creation failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-100 px-4 py-8 text-slate-950'>
      <div className='mx-auto max-w-2xl'>
        <Link to='/dashboard' className='mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700'>
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <div className='rounded-lg border border-slate-200 bg-white p-8 shadow-sm'>
          <h1 className='text-3xl font-bold'>Create Support Ticket</h1>
          <p className='mt-2 text-sm text-slate-500'>Submit an IT issue with category and priority so support can triage it quickly.</p>

          {error && <div className='mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700'>{error}</div>}

          <form className='mt-6 space-y-4' onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Ticket Title'
              className='w-full rounded-md border border-slate-300 p-3 outline-blue-500'
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />

            <textarea
              placeholder='Describe the issue...'
              rows='6'
              className='w-full rounded-md border border-slate-300 p-3 outline-blue-500'
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
            />

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <select className='w-full rounded-md border border-slate-300 p-3 outline-blue-500' value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                <option>Hardware</option>
                <option>Software</option>
                <option>Network</option>
                <option>Email</option>
                <option>Account Access</option>
                <option>Other</option>
              </select>

              <select className='w-full rounded-md border border-slate-300 p-3 outline-blue-500' value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>

            <button className='flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700' disabled={loading}>
              <Send size={18} />
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;
