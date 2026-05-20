import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Laptop,
  LifeBuoy,
  LockKeyhole,
  Mail,
  MessageSquare,
  Network,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  Users
} from 'lucide-react';
import api, { getStoredUser } from '../api';

const categories = [
  {
    title: 'Account Access',
    description: 'Passwords, permissions, onboarding access, and secure login support.',
    icon: LockKeyhole,
    iconClass: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    accentClass: 'group-hover:border-b-blue-600'
  },
  {
    title: 'Hardware',
    description: 'Laptops, printers, peripherals, repairs, and device requests.',
    icon: Laptop,
    iconClass: 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
    accentClass: 'group-hover:border-b-violet-600'
  },
  {
    title: 'Network',
    description: 'Wi-Fi, VPN, internet access, shared drives, and connectivity issues.',
    icon: Network,
    iconClass: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white',
    accentClass: 'group-hover:border-b-cyan-600'
  },
  {
    title: 'Software',
    description: 'Application installation, licensing, updates, and troubleshooting.',
    icon: Server,
    iconClass: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    accentClass: 'group-hover:border-b-emerald-600'
  }
];

const fallbackArticles = [
  'How to reset your employee portal password',
  'Connecting to company Wi-Fi or VPN',
  'Requesting software installation approval',
  'Checking the status of a submitted ticket',
  'Setting up email on a new device',
  'What to include when reporting a hardware issue'
];

const stats = [
  { label: 'Tickets Resolved', value: '12k+' },
  { label: 'Satisfaction', value: '98%' },
  { label: 'Avg Response', value: '2m' },
  { label: 'Support Coverage', value: '24/7' }
];

const quickLinks = [
  {
    label: 'Submit a ticket',
    icon: TicketCheck,
    to: '/create-ticket',
    tileClass: 'bg-blue-50 text-blue-600'
  },
  {
    label: 'View ticket status',
    icon: MessageSquare,
    to: '/dashboard',
    tileClass: 'bg-violet-50 text-violet-600'
  },
  {
    label: 'Email help desk',
    icon: Mail,
    href: 'mailto:support@example.com',
    tileClass: 'bg-emerald-50 text-emerald-600'
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 }
};

function SupportHome() {
  const user = getStoredUser();
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const visibleArticles = useMemo(() => {
    const source = articles.length ? articles.map((article) => article.title) : fallbackArticles;
    if (!search.trim()) return source;
    return source.filter((title) => title.toLowerCase().includes(search.toLowerCase()));
  }, [articles, search]);

  useEffect(() => {
    setLoading(true);
    api.get('/knowledge')
      .then(({ data }) => setArticles(data))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='min-h-screen bg-[#F8FAFC] text-[#0F172A]'>
      <header className='sticky top-0 z-30 border-b border-white/10 bg-[#0F1B3D]/95 backdrop-blur-xl'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8'>
          <Link to='/' className='flex items-center gap-3 text-lg font-extrabold text-white'>
            <span className='flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-lg shadow-blue-500/25'>
              <LifeBuoy size={23} />
            </span>
            IT Support Center
          </Link>

          <nav className='flex items-center gap-3'>
            {user ? (
              <Link className='rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15' to='/dashboard'>Dashboard</Link>
            ) : (
              <Link className='rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15' to='/login'>Login</Link>
            )}
            <Link className='rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#1D4ED8]' to={user ? '/create-ticket' : '/login'}>
              Submit Ticket
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className='relative overflow-hidden bg-[#0F1B3D]'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.38),_transparent_34%),linear-gradient(135deg,_#0F1B3D_0%,_#13285D_48%,_#071126_100%)]' />
          <div className='absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl' />
          <div className='absolute bottom-0 left-10 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl' />

          <div className='relative mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-24'>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <p className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 shadow-sm'>
                <Sparkles size={16} />
                Enterprise support portal
              </p>
              <h1 className='mx-auto mt-6 max-w-4xl text-5xl font-extrabold leading-tight text-white md:text-6xl'>
                Hi, how can we help?
              </h1>
              <p className='mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100/85'>
                Search IT answers, browse self-service resources, or raise a ticket with the support team.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.45 }}
              className='mx-auto mt-10 flex h-16 max-w-3xl items-center rounded-2xl border border-white/80 bg-white px-5 shadow-2xl shadow-slate-950/30 transition focus-within:ring-4 focus-within:ring-blue-300/35'
            >
              <Search className='text-[#64748B]' size={25} />
              <input
                className='min-w-0 flex-1 px-4 text-base font-medium text-slate-900 outline-none placeholder:text-slate-400'
                placeholder='Search articles, topics, or ticket help'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Link to={user ? '/create-ticket' : '/login'} className='hidden rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] md:inline-flex'>
                Ask support
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.42 }}
              className='mx-auto mt-12 grid max-w-5xl grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-left shadow-xl shadow-slate-950/20 backdrop-blur md:grid-cols-4'
            >
              {stats.map((stat) => (
                <div key={stat.label} className='border-white/10 p-6 md:border-r md:last:border-r-0'>
                  <p className='text-3xl font-extrabold text-white'>{stat.value}</p>
                  <p className='mt-1 text-sm font-medium text-blue-100/80'>{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className='mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-[1fr_380px] lg:px-8'>
          <div className='space-y-10'>
            <div>
              <div className='mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between'>
                <div>
                  <p className='text-sm font-bold uppercase tracking-wide text-[#2563EB]'>Browse topics</p>
                  <h2 className='mt-2 text-3xl font-extrabold text-[#0F1B3D]'>Knowledge base</h2>
                </div>
                <span className='text-sm font-medium text-[#64748B]'>{loading ? 'Loading articles...' : `${visibleArticles.length} helpful articles`}</span>
              </div>

              <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <motion.article
                      key={category.title}
                      variants={cardVariants}
                      initial='hidden'
                      whileInView='visible'
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ delay: index * 0.05, duration: 0.35 }}
                      className={`group rounded-2xl border border-[#E2E8F0] border-b-4 border-b-transparent bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200 ${category.accentClass}`}
                    >
                      <div className='flex items-start gap-5'>
                        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition ${category.iconClass}`}>
                          <Icon size={28} />
                        </span>
                        <div>
                          <h3 className='text-xl font-extrabold text-[#0F1B3D]'>{category.title}</h3>
                          <p className='mt-2 leading-7 text-[#64748B]'>{category.description}</p>
                          <span className='mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#2563EB]'>
                            View articles <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              className='rounded-2xl border border-[#E2E8F0] bg-white p-7 shadow-sm'
            >
              <div className='mb-5 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <span className='flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]'>
                    <BookOpen size={22} />
                  </span>
                  <h2 className='text-2xl font-extrabold text-[#0F1B3D]'>Popular Articles</h2>
                </div>
                <Link to={user ? '/dashboard' : '/login'} className='text-sm font-bold text-[#2563EB]'>View tickets</Link>
              </div>

              <div className='divide-y divide-[#E2E8F0]'>
                {visibleArticles.map((title) => (
                  <button key={title} className='group flex w-full items-center justify-between py-4 text-left text-slate-700 transition hover:text-[#2563EB]'>
                    <span className='text-base font-semibold'>{title}</span>
                    <ChevronRight className='transition group-hover:translate-x-1' size={19} />
                  </button>
                ))}
                {!visibleArticles.length && <p className='py-4 text-sm font-medium text-[#64748B]'>No matching articles found.</p>}
              </div>
            </motion.div>
          </div>

          <aside className='space-y-6 lg:sticky lg:top-28 lg:self-start'>
            <div className='rounded-2xl border border-[#E2E8F0] bg-white p-7 shadow-sm'>
              <h2 className='text-2xl font-extrabold text-[#0F1B3D]'>Quick links</h2>
              <div className='mt-5 space-y-3'>
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  const content = (
                    <>
                      <span className='flex items-center gap-3'>
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${link.tileClass}`}>
                          <Icon size={20} />
                        </span>
                        {link.label}
                      </span>
                      <ChevronRight className='transition group-hover:translate-x-1' size={18} />
                    </>
                  );

                  if (link.href) {
                    return (
                      <a key={link.label} className='group flex items-center justify-between rounded-2xl border border-[#E2E8F0] p-3 text-sm font-bold text-slate-700 transition hover:border-[#2563EB] hover:bg-blue-50/60 hover:text-[#2563EB]' href={link.href}>
                        {content}
                      </a>
                    );
                  }

                  return (
                    <Link key={link.label} className='group flex items-center justify-between rounded-2xl border border-[#E2E8F0] p-3 text-sm font-bold text-slate-700 transition hover:border-[#2563EB] hover:bg-blue-50/60 hover:text-[#2563EB]' to={user ? link.to : '/login'}>
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className='rounded-2xl border border-emerald-100 bg-white p-7 shadow-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-bold uppercase tracking-wide text-emerald-600'>System status</p>
                  <h2 className='mt-2 text-2xl font-extrabold text-[#0F1B3D]'>All services operational</h2>
                </div>
                <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600'>
                  <CheckCircle2 size={25} />
                </span>
              </div>
              <div className='mt-5 space-y-3 text-sm font-semibold text-slate-600'>
                <div className='flex items-center justify-between'><span>Network</span><span className='text-emerald-600'>Online</span></div>
                <div className='flex items-center justify-between'><span>Email</span><span className='text-emerald-600'>Online</span></div>
                <div className='flex items-center justify-between'><span>Ticket API</span><span className='text-emerald-600'>Online</span></div>
              </div>
            </div>

            <div className='overflow-hidden rounded-2xl bg-[#0F1B3D] p-7 text-white shadow-xl shadow-slate-950/20'>
              <Users size={30} className='text-blue-200' />
              <h2 className='mt-5 text-2xl font-extrabold'>Need more help?</h2>
              <p className='mt-3 leading-7 text-blue-100/85'>Create a support request and a technician will follow up through the ticket comments.</p>
              <Link className='mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1D4ED8]' to={user ? '/create-ticket' : '/login'}>
                Contact support <ArrowRight size={17} />
              </Link>
            </div>
          </aside>
        </section>
      </main>

      <footer className='bg-[#0F1B3D] text-white'>
        <div className='mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8'>
          <div>
            <div className='flex items-center gap-3 text-lg font-extrabold'>
              <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-lg shadow-blue-500/20'>
                <LifeBuoy size={21} />
              </span>
              IT Support Center
            </div>
            <p className='mt-4 max-w-md leading-7 text-blue-100/80'>Self-service IT support, ticket tracking, and knowledge resources for employees and support teams.</p>
          </div>
          <div>
            <h3 className='font-extrabold'>Support</h3>
            <div className='mt-4 space-y-3 text-sm font-medium text-blue-100/75'>
              <p>Knowledge base</p>
              <p>Submit ticket</p>
              <p>System status</p>
            </div>
          </div>
          <div>
            <h3 className='font-extrabold'>Company</h3>
            <div className='mt-4 space-y-3 text-sm font-medium text-blue-100/75'>
              <p>Privacy policy</p>
              <p>Terms of service</p>
              <p>support@example.com</p>
            </div>
          </div>
        </div>
        <div className='border-t border-white/10 px-6 py-5 text-center text-sm font-medium text-blue-100/65'>
          Copyright (c) 2026 IT Support Center. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default SupportHome;
