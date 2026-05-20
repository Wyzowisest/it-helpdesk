import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  AppWindow,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Bug,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleCheck,
  Code2,
  Clock3,
  Download,
  Edit3,
  FileText,
  Flame,
  GitBranch,
  Globe2,
  HelpCircle,
  Link as LinkIcon,
  Laptop,
  LayoutDashboard,
  LifeBuoy,
  List,
  LogOut,
  Mail,
  MessageCircle,
  Monitor,
  Network,
  Paperclip,
  Plus,
  Send,
  Search,
  Settings,
  ShieldCheck,
  Ticket,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
  Wifi,
  Wand2,
  Wrench,
  X
} from 'lucide-react';
import api, { clearSession, getStoredUser } from '../api';

const navGroups = [
  {
    label: 'Essential Pages',
    items: [
      { id: 'ticketDetail', label: 'Ticket Detail', icon: Ticket },
      { id: 'portal', label: 'Self-Service Portal', icon: Globe2 },
      { id: 'users', label: 'Users & Roles', icon: Users },
      { id: 'automation', label: 'Automation Rules', icon: Bot }
    ]
  },
  {
    label: 'Main',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
  },
  {
    label: 'Service Desk',
    items: [
      { id: 'incidents', label: 'Incidents', icon: AlertTriangle, badge: '14' },
      { id: 'requests', label: 'Service Requests', icon: FileText, badge: '6', amber: true },
      { id: 'problems', label: 'Problems', icon: Bug },
      { id: 'changes', label: 'Change Management', icon: GitBranch }
    ]
  },
  {
    label: 'IT Operations',
    items: [
      { id: 'catalog', label: 'Service Catalog', icon: AppWindow },
      { id: 'assets', label: 'Asset Management', icon: Laptop },
      { id: 'kb', label: 'Knowledge Base', icon: BookOpen }
    ]
  },
  {
    label: 'Analytics',
    items: [{ id: 'reports', label: 'Reports & Analytics', icon: BarChart3 }]
  }
];

const tickets = [
  ['INC-2847', 'Laptop screen flickering after Windows update', 'John A.', 'Sarah K.', 'High', 'In Progress', '2h left', 'May 10'],
  ['INC-2831', 'Cannot access shared drive on company network', 'Emeka A.', 'Michael O.', 'Critical', 'Open', 'Overdue', 'May 10'],
  ['INC-2819', 'Outlook not syncing emails since yesterday', 'Funke O.', 'Amaka A.', 'Medium', 'In Progress', 'On track', 'May 9'],
  ['INC-2804', 'Password reset not working for portal login', 'Kemi B.', 'Tunde J.', 'Low', 'Open', 'On track', 'May 8'],
  ['INC-2798', 'Printer offline - Finance floor 3', 'Rita A.', 'Sarah K.', 'Medium', 'Resolved', 'Met', 'May 7'],
  ['INC-2785', 'VPN disconnecting every 10 minutes', 'Dami O.', 'Unassigned', 'High', 'Open', '1h left', 'May 6']
];

const requests = [
  ['SR-0192', 'New laptop request - Dell XPS 15', 'John Adeyemi', 'Finance', 'Pending', 'Awaiting', 'May 15'],
  ['SR-0191', 'Software license - Adobe Creative Suite', 'Sola Marcus', 'Marketing', 'In Progress', 'Approved', 'May 14'],
  ['SR-0189', 'VPN access for remote work', 'Chioma E.', 'HR', 'Open', 'Approved', 'May 13'],
  ['SR-0187', 'New employee onboarding setup', 'Ngozi A.', 'HR', 'Fulfilled', 'Approved', 'May 11'],
  ['SR-0185', 'External monitor - 27 inch 4K', 'Bayo T.', 'Engineering', 'Pending', 'Awaiting', 'May 16']
];

const problems = [
  ['PRB-0014', 'Intermittent VPN disconnections company-wide', 'Under investigation', '6 incidents', 'High', 'In Progress', 'Michael O.'],
  ['PRB-0013', 'Outlook sync failures on Exchange 2019', 'Known error', '4 incidents', 'Medium', 'Open', 'Amaka A.'],
  ['PRB-0012', 'Shared drive access denied post-AD migration', 'Under investigation', '8 incidents', 'Critical', 'In Progress', 'Michael O.'],
  ['PRB-0011', 'Laptop overheating after firmware update', 'Root cause found', '3 incidents', 'Low', 'Resolved', 'Sarah K.']
];

const changes = [
  ['CHG-0041', 'DB server migration to AWS RDS', 'Standard', 'High', 'Pending', 'May 14'],
  ['CHG-0040', 'VPN gateway firmware v3.8 upgrade', 'Standard', 'Low', 'Pending', 'May 15'],
  ['CHG-0039', 'Office 365 tenant migration', 'Emergency', 'Medium', 'Approved', 'May 13'],
  ['CHG-0038', 'Active Directory cleanup - stale accounts', 'Standard', 'Low', 'Completed', 'May 8'],
  ['CHG-0037', 'Core switch firmware update', 'Standard', 'Medium', 'Failed', 'May 5']
];

const assets = [
  ['AST-0441', 'Dell XPS 15 (2024)', 'Laptop', 'John Adeyemi', 'In use', 'Floor 3 - Finance', 'Jan 2024', 'Jan 2027'],
  ['AST-0440', 'HP LaserJet Pro MFP', 'Printer', 'Finance Dept', 'Under repair', 'Floor 3 - Finance', 'Mar 2022', 'Mar 2025'],
  ['AST-0438', 'MacBook Pro M3 14 inch', 'Laptop', 'Sola Marcus', 'In use', 'Floor 1 - Marketing', 'Nov 2023', 'Nov 2026'],
  ['AST-0432', 'Cisco Catalyst 9300 Switch', 'Network', 'IT Dept', 'Active', 'Server Room B', 'Aug 2021', 'Expired'],
  ['AST-0415', 'Adobe Creative Cloud (50 seats)', 'Software', 'All departments', 'Active', 'Cloud', 'Jan 2026', 'Jan 2027'],
  ['AST-0412', 'Dell PowerEdge R750 Server', 'Server', 'IT Dept', 'Active', 'Server Room A', 'Mar 2021', 'Mar 2026']
];

const articles = [
  ['How to reset your employee portal password', 'Account', '3,241', '4.8', 'Published'],
  ['Connecting to company Wi-Fi or VPN', 'Network', '2,814', '4.7', 'Published'],
  ['Fix screen flickering on Dell XPS', 'Hardware', '1,248', '4.5', 'Published'],
  ['Requesting software installation approval', 'Software', '1,091', '4.6', 'Published'],
  ['Setting up email on a new device', 'Software', '987', '4.4', 'Published']
];

const agents = [
  ['Sarah K.', 'Hardware', 'SK', 'blue', '4', true],
  ['Michael O.', 'Network', 'MO', 'green', '6', true],
  ['Amaka A.', 'Software', 'AA', 'purple', '3', true],
  ['Tunde J.', 'Account Access', 'TJ', 'amber', 'Away', false]
];

const catalog = [
  ['Laptop request', 'Request a new or replacement laptop with business justification.', Laptop, 'bg-blue-50 text-blue-600', '3-5 business days'],
  ['External monitor', 'Request an additional monitor for your workstation.', Monitor, 'bg-violet-50 text-violet-600', '2-3 business days'],
  ['Printer setup', 'Set up a network printer connection on your workstation.', FileText, 'bg-emerald-50 text-emerald-600', '1 business day'],
  ['Software license', 'Request a new or additional software license.', AppWindow, 'bg-violet-50 text-violet-600', '1-2 business days'],
  ['VPN access', 'Request remote access VPN credentials and configuration.', ShieldCheck, 'bg-cyan-50 text-cyan-700', '4 hours'],
  ['New user onboarding', 'Full IT setup for a new employee.', UserPlus, 'bg-blue-50 text-blue-600', '1 business day'],
  ['Employee offboarding', 'Revoke access, recover hardware, and archive data.', UserMinus, 'bg-red-50 text-red-600', 'Same day']
];

const toTicketRows = (items = []) => items.map((ticket) => [
  ticket.ticketNumber || ticket._id,
  ticket.title,
  ticket.createdBy?.name || ticket.requester || 'Requester',
  ticket.assignedTo?.name || 'Unassigned',
  ticket.priority,
  ticket.status,
  ticket.sla?.resolutionDue || (ticket.status === 'Resolved' ? 'Met' : 'On track'),
  ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''
]);

const toRequestRows = (items = []) => items.map((request) => [
  request.requestNumber || request._id,
  request.title,
  request.requester,
  request.department || 'General',
  request.status,
  request.approvalStatus,
  request.dueDate ? new Date(request.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''
]);

const toProblemRows = (items = []) => items.map((problem) => [
  problem.problemNumber || problem._id,
  problem.title,
  problem.rootCauseStatus,
  `${problem.linkedIncidents || 0} incidents`,
  problem.priority,
  problem.status,
  problem.owner || 'Unassigned'
]);

const toChangeRows = (items = []) => items.map((change) => [
  change.changeNumber || change._id,
  change.title,
  change.type,
  change.risk,
  change.status,
  change.scheduledAt ? new Date(change.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''
]);

const toAssetRows = (items = []) => items.map((asset) => [
  asset.assetTag,
  asset.name,
  asset.type,
  asset.assignedTo,
  asset.status,
  asset.location,
  asset.purchasedAt ? new Date(asset.purchasedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '',
  asset.warrantyUntil ? new Date(asset.warrantyUntil).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''
]);

const toArticleRows = (items = []) => items.map((article) => [
  article.title,
  article.category,
  String(article.views || 0),
  String(article.rating || 0),
  article.published ? 'Published' : 'Draft'
]);

const toCatalogRows = (items = []) => items.map((item) => {
  const icon = item.category === 'Network' ? ShieldCheck : item.category === 'Software' ? AppWindow : Laptop;
  const tone = item.category === 'Network' ? 'bg-cyan-50 text-cyan-700' : item.category === 'Software' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600';
  return [item.name, item.description, icon, tone, item.sla];
});

function initials(name) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2);
}

function badgeClass(value) {
  const key = String(value).toLowerCase();
  if (key.includes('critical')) return 'bg-violet-50 text-violet-700';
  if (key.includes('high') || key.includes('failed') || key.includes('overdue') || key.includes('expired')) return 'bg-red-50 text-red-700';
  if (key.includes('medium') || key.includes('pending') || key.includes('awaiting') || key.includes('progress') || key.includes('repair')) return 'bg-amber-50 text-amber-700';
  if (key.includes('low') || key.includes('approved') || key.includes('resolved') || key.includes('fulfilled') || key.includes('active') || key.includes('use') || key.includes('met')) return 'bg-emerald-50 text-emerald-700';
  if (key.includes('software')) return 'bg-violet-50 text-violet-700';
  if (key.includes('network')) return 'bg-cyan-50 text-cyan-700';
  return 'bg-blue-50 text-blue-700';
}

function Badge({ children }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeClass(children)}`}>{children}</span>;
}

function Button({ children, variant = 'primary', onClick }) {
  const styles = variant === 'secondary'
    ? 'border border-[#d1d9ef] bg-white text-slate-700 hover:bg-slate-50'
    : variant === 'danger'
      ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
      : 'bg-[#2563EB] text-white shadow-sm shadow-blue-600/20 hover:bg-[#1D4ED8]';

  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${styles}`}>
      {children}
    </button>
  );
}

function Card({ title, icon: Icon, children, action }) {
  return (
    <section className='overflow-hidden rounded-[13px] border border-[#e4e9f4] bg-white'>
      {(title || action) && (
        <div className='flex flex-wrap items-center justify-between gap-3 border-b border-[#eef1f8] px-5 py-4'>
          {title && (
            <h3 className='flex items-center gap-2 text-sm font-extrabold text-[#0F1B3D]'>
              {Icon && <Icon size={17} className='text-[#2563EB]' />}
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function StatCard({ label, value, accent = 'text-[#0F1B3D]', trend }) {
  return (
    <div className='rounded-[13px] border border-[#e4e9f4] bg-white px-5 py-4'>
      <p className='text-xs font-medium text-[#6b7fa8]'>{label}</p>
      <p className={`mt-1 text-[28px] font-extrabold leading-none ${accent}`}>{value}</p>
      {trend && <p className='mt-2 text-xs font-semibold text-emerald-600'>{trend}</p>}
    </div>
  );
}

function PageHeader({ title, subtitle, children }) {
  return (
    <div className='mb-6 flex flex-wrap items-start justify-between gap-3'>
      <div>
        <h1 className='text-[22px] font-extrabold text-[#0F1B3D]'>{title}</h1>
        <p className='mt-1 text-sm text-[#6b7fa8]'>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function DataTable({ headers, rows, renderCell, onRowClick }) {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full border-collapse text-sm'>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className='border-b border-[#eef1f8] bg-[#FAFBFD] px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-wide text-[#9ca3c8]'>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[0]}
              onClick={() => onRowClick?.(row)}
              className={`${onRowClick ? 'cursor-pointer' : ''} hover:bg-[#f8faff]`}
            >
              {row.map((cell, index) => (
                <td key={`${row[0]}-${index}`} className='border-b border-[#f3f5fb] px-4 py-3 text-slate-700'>
                  {renderCell ? renderCell(cell, index, row) : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProgressRow({ label, value, color = 'bg-[#2563EB]' }) {
  return (
    <div className='flex items-center gap-3 border-b border-[#f3f5fb] py-3 last:border-b-0'>
      <span className='w-32 shrink-0 text-xs font-medium text-slate-600'>{label}</span>
      <div className='h-2 flex-1 overflow-hidden rounded-full bg-[#eef1f8]'>
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className='w-10 text-right text-sm font-extrabold text-[#0F1B3D]'>{value}%</span>
    </div>
  );
}

function FilterBar({ labels, placeholder }) {
  const [active, setActive] = useState(labels[0]);

  return (
    <div className='mb-4 flex flex-wrap items-center gap-2'>
      {labels.map((label) => (
        <button
          key={label}
          onClick={() => setActive(label)}
          className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${active === label ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-[#e4e9f4] bg-white text-[#6b7fa8] hover:border-blue-200 hover:text-[#0F1B3D]'}`}
        >
          {label}
        </button>
      ))}
      <input className='ml-auto min-w-48 rounded-lg border border-[#d1d9ef] px-3 py-2 text-sm outline-none focus:border-[#2563EB]' placeholder={placeholder} />
    </div>
  );
}

function Avatar({ name, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    purple: 'bg-violet-50 text-violet-700',
    amber: 'bg-amber-50 text-amber-700',
    dark: 'bg-[#0F1B3D] text-white'
  };

  return <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${tones[tone] || tones.blue}`}>{initials(name)}</span>;
}

function DashboardHome({ openModal, showPage, summary, ticketRows }) {
  const ticketStats = summary?.tickets;
  const sla = summary?.sla;

  return (
    <>
      <PageHeader title='Good morning, John' subtitle="Here's what's happening in your service desk today - Tuesday, May 12 2026">
        <Button onClick={openModal}><Plus size={16} /> New Ticket</Button>
      </PageHeader>

      <div className='mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6'>
        <StatCard label='Open incidents' value={ticketStats?.open ?? '14'} accent='text-[#2563EB]' trend='Live from API' />
        <StatCard label='Awaiting response' value={ticketStats?.inProgress ?? '7'} accent='text-amber-600' trend='In progress queue' />
        <StatCard label='Overdue tickets' value={ticketStats?.overdue ?? '3'} accent='text-red-600' trend='SLA watchlist' />
        <StatCard label='Resolved today' value={ticketStats?.resolved ?? '11'} accent='text-emerald-600' trend='Resolved tickets' />
        <StatCard label='Avg. response time' value='1.8h' accent='text-violet-600' trend='SLA target: 2h' />
        <StatCard label='CSAT score' value='94%' accent='text-emerald-600' trend='+2% this week' />
      </div>

      <div className='grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]'>
        <div className='space-y-4'>
          <Card title='My open tickets' icon={Ticket} action={<Button variant='secondary' onClick={() => showPage('incidents')}>View all</Button>}>
            <DataTable
              headers={['ID', 'Subject', 'Priority', 'SLA', 'Updated']}
              rows={(ticketRows || tickets).slice(0, 4).map(([id, subject, , , priority, , sla, created]) => [id, subject, priority, sla, created])}
              renderCell={(cell, index) => index === 0 ? <b className='text-[#2563EB]'>{cell}</b> : index === 2 || index === 3 ? <Badge>{cell}</Badge> : cell}
            />
          </Card>

          <Card title='Pending change approvals' icon={GitBranch} action={<Button variant='secondary' onClick={() => showPage('changes')}>View all</Button>}>
            <div className='divide-y divide-[#f3f5fb]'>
              {[
                ['Database server migration to AWS RDS', 'CHG-0041', 'Submitted by Emeka O.', 'Scheduled May 14, 2026', 'High risk'],
                ['Deploy new VPN gateway firmware v3.8', 'CHG-0040', 'Submitted by Sola A.', 'Scheduled May 15, 2026', 'Low risk']
              ].map((item) => (
                <div key={item[1]} className='p-5'>
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <h4 className='font-extrabold text-[#0F1B3D]'>{item[0]}</h4>
                      <p className='mt-1 text-xs text-[#9ca3c8]'>{item[1]} - {item[2]}</p>
                    </div>
                    <Badge>Pending</Badge>
                  </div>
                  <div className='mt-3 flex flex-wrap gap-4 text-xs font-medium text-[#6b7fa8]'>
                    <span className='flex items-center gap-1'><CalendarDays size={14} /> {item[3]}</span>
                    <span className='flex items-center gap-1'><Clock3 size={14} /> Downtime planned</span>
                    <span>{item[4]}</span>
                  </div>
                  <div className='mt-4 flex gap-2'>
                    <button className='rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-extrabold text-emerald-700'>Approve</button>
                    <button className='rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-extrabold text-red-700'>Reject</button>
                    <button className='ml-auto rounded-lg border border-[#d1d9ef] px-4 py-2 text-xs font-extrabold text-slate-700'>Review</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className='space-y-4'>
          <Card title='SLA compliance' icon={ShieldCheck}>
            <div className='p-5'>
              <ProgressRow label='First response' value={sla?.firstResponse ?? 96} color='bg-emerald-500' />
              <ProgressRow label='Resolution time' value={sla?.resolution ?? 88} />
              <ProgressRow label='Critical tickets' value={sla?.critical ?? 72} color='bg-amber-500' />
              <ProgressRow label='Overall SLA' value={sla?.overall ?? 91} color='bg-emerald-500' />
            </div>
          </Card>

          <Card title='Agent availability' icon={Users}>
            <AgentList />
          </Card>

          <Card title='Recent activity' icon={Activity}>
            <ul className='space-y-4 p-5'>
              {[
                ['INC-2845 resolved', 'Printer offline - Sarah K. - 12 min ago', 'bg-emerald-500'],
                ['New ticket INC-2847', 'Laptop flickering - John Adeyemi - 34 min ago', 'bg-[#2563EB]'],
                ['CHG-0041 submitted', 'DB migration - Emeka O. - 1h ago', 'bg-amber-500'],
                ['INC-2831 escalated', 'Shared drive - Michael O. - 2h ago', 'bg-slate-400']
              ].map((item) => (
                <li key={item[0]} className='flex gap-3'>
                  <span className={`mt-1 h-3 w-3 rounded-full ${item[2]}`} />
                  <span><b className='block text-sm text-[#0F1B3D]'>{item[0]}</b><small className='text-[#9ca3c8]'>{item[1]}</small></span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

function AgentList() {
  return (
    <div className='divide-y divide-[#f3f5fb]'>
      {agents.map(([name, team, code, tone, count, online]) => (
        <div key={name} className='flex items-center gap-3 px-4 py-3'>
          <span className={`h-2 w-2 rounded-full ${online ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          <Avatar name={code} tone={tone} />
          <div className='min-w-0 flex-1'>
            <p className='text-sm font-bold text-[#1a2340]'>{name}</p>
            <p className='text-xs text-[#9ca3c8]'>{team}</p>
          </div>
          <div className='text-right text-sm font-extrabold text-[#0F1B3D]'>{count}<span className='block text-[11px] font-medium text-[#9ca3c8]'>{online ? 'tickets' : 'since 12pm'}</span></div>
        </div>
      ))}
    </div>
  );
}

function IncidentsPage({ openModal, ticketRows, openTicket }) {
  const rows = ticketRows?.length ? ticketRows : tickets;

  return (
    <>
      <PageHeader title='Incident Management' subtitle='Track, triage, and resolve IT incidents'>
        <Button onClick={openModal}><Plus size={16} /> Log Incident</Button>
      </PageHeader>
      <div className='mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5'>
        <StatCard label='All open' value='14' accent='text-[#2563EB]' />
        <StatCard label='Critical' value='2' accent='text-red-600' />
        <StatCard label='Overdue' value='3' accent='text-amber-600' />
        <StatCard label='Resolved today' value='11' accent='text-emerald-600' />
        <StatCard label='Unassigned' value='5' accent='text-violet-600' />
      </div>
      <FilterBar labels={['All', 'Open', 'In Progress', 'Resolved', 'Overdue']} placeholder='Search incidents...' />
      <Card title='All incidents' icon={Ticket} action={<Button variant='secondary'><Download size={15} /> Export</Button>}>
        <DataTable headers={['ID', 'Subject', 'Requester', 'Assigned to', 'Priority', 'Status', 'SLA', 'Created']} rows={rows} onRowClick={(row) => openTicket(row[0])} renderCell={(cell, index) => index === 0 ? <b className='text-[#2563EB]'>{cell}</b> : [4, 5, 6].includes(index) ? <Badge>{cell}</Badge> : cell} />
      </Card>
    </>
  );
}

function RequestsPage({ showPage, requestRows }) {
  const rows = requestRows?.length ? requestRows : requests;

  return (
    <>
      <PageHeader title='Service Requests' subtitle='Employee requests from the service catalog'>
        <Button onClick={() => showPage('catalog')}><AppWindow size={16} /> Browse Catalog</Button>
      </PageHeader>
      <div className='mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard label='Open requests' value='6' accent='text-[#2563EB]' />
        <StatCard label='Pending approval' value='3' accent='text-amber-600' />
        <StatCard label='Fulfilled this week' value='18' accent='text-emerald-600' />
        <StatCard label='Avg. fulfillment time' value='4.2h' accent='text-violet-600' />
      </div>
      <Card title='All service requests' icon={FileText}>
        <DataTable headers={['ID', 'Request type', 'Requester', 'Dept', 'Status', 'Approval', 'Due']} rows={rows} renderCell={(cell, index) => index === 0 ? <b className='text-[#2563EB]'>{cell}</b> : [4, 5].includes(index) ? <Badge>{cell}</Badge> : cell} />
      </Card>
    </>
  );
}

function ProblemsPage({ problemRows }) {
  const rows = problemRows?.length ? problemRows : problems;

  return (
    <>
      <PageHeader title='Problem Management' subtitle='Identify and eliminate root causes of recurring incidents'>
        <Button><Plus size={16} /> Log Problem</Button>
      </PageHeader>
      <div className='mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard label='Open problems' value='5' accent='text-[#2563EB]' />
        <StatCard label='Known errors' value='2' accent='text-red-600' />
        <StatCard label='Under investigation' value='3' accent='text-amber-600' />
        <StatCard label='Resolved this month' value='9' accent='text-emerald-600' />
      </div>
      <Card title='Problem records' icon={Bug}>
        <DataTable headers={['ID', 'Problem', 'Root cause status', 'Linked incidents', 'Priority', 'Status', 'Owner']} rows={rows} renderCell={(cell, index) => index === 0 ? <b className='text-[#2563EB]'>{cell}</b> : [4, 5].includes(index) ? <Badge>{cell}</Badge> : cell} />
      </Card>
    </>
  );
}

function ChangesPage({ changeRows }) {
  const rows = changeRows?.length ? changeRows : changes;

  return (
    <>
      <PageHeader title='Change Management' subtitle='Plan, review, and approve IT changes with CAB workflow'>
        <Button><Plus size={16} /> Request Change</Button>
      </PageHeader>
      <div className='mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5'>
        <StatCard label='Pending approval' value='4' accent='text-[#2563EB]' />
        <StatCard label='Scheduled' value='7' accent='text-amber-600' />
        <StatCard label='Completed this month' value='22' accent='text-emerald-600' />
        <StatCard label='Failed / rolled back' value='1' accent='text-red-600' />
        <StatCard label='Success rate' value='95%' accent='text-emerald-600' />
      </div>
      <div className='grid grid-cols-1 gap-5 xl:grid-cols-[1fr_280px]'>
        <Card title='All change requests' icon={GitBranch}>
          <DataTable headers={['ID', 'Change', 'Type', 'Risk', 'Status', 'Scheduled']} rows={rows} renderCell={(cell, index) => index === 0 ? <b className='text-[#2563EB]'>{cell}</b> : [3, 4].includes(index) ? <Badge>{cell}</Badge> : cell} />
        </Card>
        <div className='space-y-4'>
          <Card title='Change calendar' icon={CalendarDays}>
            <div className='p-5'>
              <p className='mb-3 text-center text-sm font-extrabold text-[#0F1B3D]'>May 2026</p>
              <div className='grid grid-cols-7 gap-1 text-center text-xs'>
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => <b key={d} className='p-1 text-[#9ca3c8]'>{d}</b>)}
                {Array.from({ length: 25 }, (_, i) => i + 1).map((day) => (
                  <span key={day} className={`rounded-md p-1 ${day === 12 ? 'bg-[#2563EB] font-bold text-white' : [5, 8, 13, 14, 15].includes(day) ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-blue-50'}`}>{day}</span>
                ))}
              </div>
            </div>
          </Card>
          <Card title='CAB members'>
            <AgentList />
          </Card>
        </div>
      </div>
    </>
  );
}

function CatalogPage({ catalogRows }) {
  const rows = catalogRows?.length ? catalogRows : catalog;

  return (
    <>
      <PageHeader title='Service Catalog' subtitle='Browse and request IT services and equipment' />
      <FilterBar labels={['All services', 'Hardware', 'Software', 'Access & Accounts', 'Network', 'Onboarding']} placeholder='Search catalog...' />
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {rows.map(([title, desc, Icon, tone, sla]) => (
          <article key={title} className='rounded-[13px] border border-[#e4e9f4] bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/10'>
            <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}><Icon size={24} /></span>
            <h3 className='text-sm font-extrabold text-[#0F1B3D]'>{title}</h3>
            <p className='mt-2 min-h-12 text-xs leading-5 text-[#6b7fa8]'>{desc}</p>
            <p className='mt-3 flex items-center gap-1 text-xs text-[#9ca3c8]'><Clock3 size={13} /> Fulfilled in {sla}</p>
            <button className='mt-4 w-full rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1D4ED8]'>Request now</button>
          </article>
        ))}
      </div>
    </>
  );
}

function AssetsPage({ assetRows }) {
  const rows = assetRows?.length ? assetRows : assets;

  return (
    <>
      <PageHeader title='Asset Management' subtitle='Track and manage all IT hardware and software assets'>
        <Button><Plus size={16} /> Add Asset</Button>
      </PageHeader>
      <div className='mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5'>
        <StatCard label='Total assets' value='248' />
        <StatCard label='Laptops' value='112' accent='text-[#2563EB]' />
        <StatCard label='Software licenses' value='67' accent='text-violet-600' />
        <StatCard label='Expiring <= 30 days' value='8' accent='text-amber-600' />
        <StatCard label='Offline / retired' value='14' accent='text-red-600' />
      </div>
      <FilterBar labels={['All assets', 'Laptops', 'Desktops', 'Servers', 'Software', 'Network']} placeholder='Search by name, tag, user...' />
      <Card title='Asset inventory' icon={Laptop} action={<Button variant='secondary'><Download size={15} /> Export CSV</Button>}>
        <DataTable headers={['Asset tag', 'Name / Model', 'Type', 'Assigned to', 'Status', 'Location', 'Purchased', 'Warranty']} rows={rows} renderCell={(cell, index) => index === 0 ? <b>{cell}</b> : [2, 4, 7].includes(index) ? <Badge>{cell}</Badge> : cell} />
      </Card>
    </>
  );
}

function KnowledgePage({ articleRows }) {
  const rows = articleRows?.length ? articleRows : articles;

  return (
    <>
      <PageHeader title='Knowledge Base' subtitle='Internal articles, guides, and self-service resources'>
        <Button><Plus size={16} /> New Article</Button>
      </PageHeader>
      <div className='mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard label='Total articles' value='184' accent='text-[#2563EB]' />
        <StatCard label='Published' value='162' accent='text-emerald-600' />
        <StatCard label='Draft / in review' value='22' accent='text-amber-600' />
        <StatCard label='Avg. satisfaction' value='87%' accent='text-violet-600' />
      </div>
      <div className='grid grid-cols-1 gap-5 xl:grid-cols-[1fr_280px]'>
        <div className='space-y-4'>
          <Card title='Most viewed articles' icon={BookOpen}>
            <DataTable headers={['Article', 'Category', 'Views', 'Rating', 'Status']} rows={rows} renderCell={(cell, index) => index === 1 || index === 4 ? <Badge>{cell}</Badge> : index === 3 ? <b className='text-amber-500'>Star {cell}</b> : cell} />
          </Card>
          <Card title='Awaiting review' icon={Clock3}>
            <DataTable headers={['Article', 'Author', 'Submitted', 'Actions']} rows={[
              ['How to set up MFA on company accounts', 'Amaka A.', 'May 10', 'Approve'],
              ['Troubleshooting Teams audio issues', 'Tunde J.', 'May 9', 'Approve'],
              ['Submitting expense reports in SAP', 'Sarah K.', 'May 8', 'Approve']
            ]} renderCell={(cell, index) => index === 3 ? <button className='rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700'>{cell}</button> : cell} />
          </Card>
        </div>
        <div className='space-y-4'>
          <Card title='By category'>
            <div className='p-5'>
              <ProgressRow label='Account access' value={78} />
              <ProgressRow label='Hardware' value={65} />
              <ProgressRow label='Software' value={55} />
              <ProgressRow label='Network' value={42} color='bg-cyan-500' />
            </div>
          </Card>
          <Card title='Ticket deflection'>
            <div className='p-6 text-center'>
              <p className='text-4xl font-extrabold text-emerald-600'>34%</p>
              <p className='mt-2 text-sm text-[#6b7fa8]'>of tickets avoided via self-service</p>
              <p className='mt-1 text-xs text-[#9ca3c8]'>Up 6% vs last month</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function ReportsPage({ report }) {
  const categoryEntries = Object.entries(report?.byCategory || {});
  const statusEntries = Object.entries(report?.byStatus || {});
  const agentRows = report?.agentPerformance?.map((agent) => [
    agent.agent,
    String(agent.assigned),
    String(agent.resolved),
    agent.averageResolutionTime || '4.1h',
    `${agent.csat}%`,
    `${agent.slaMet}%`
  ]);

  return (
    <>
      <PageHeader title='Reports & Analytics' subtitle='Service desk performance, SLA compliance, and trends'>
        <div className='flex gap-2'>
          <select className='rounded-lg border border-[#d1d9ef] bg-white px-3 py-2 text-sm'><option>This month</option><option>Last month</option><option>Last 90 days</option></select>
          <Button variant='secondary'><Download size={15} /> Export</Button>
        </div>
      </PageHeader>
      <div className='mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard label='Total tickets' value={report?.totalTickets ?? '312'} accent='text-[#2563EB]' trend='Live API report' />
        <StatCard label='Resolution rate' value={`${report?.resolutionRate ?? 91}%`} accent='text-emerald-600' trend='+3%' />
        <StatCard label='Avg. resolution time' value={report?.averageResolutionTime ?? '4.1h'} accent='text-violet-600' trend='-0.8h vs last month' />
        <StatCard label='CSAT score' value={`${report?.csat ?? 94}%`} accent='text-emerald-600' trend='+2%' />
      </div>
      <div className='grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]'>
        <Card title='Tickets by category' icon={BarChart3}>
          <div className='p-5'>
            {(categoryEntries.length ? categoryEntries : [['Hardware', 85], ['Software', 72], ['Network', 63], ['Account access', 55], ['Other', 27]]).map(([label, value], index) => (
              <ProgressRow key={label} label={label} value={Math.min(Number(value) * 15, 100)} color={index === 1 ? 'bg-violet-500' : index === 2 ? 'bg-cyan-500' : index === 3 ? 'bg-emerald-500' : index === 4 ? 'bg-amber-500' : undefined} />
            ))}
          </div>
        </Card>
        <Card title='Ticket status distribution' icon={BarChart3}>
          <div className='p-6 text-center'>
            <div className='mx-auto flex h-32 w-32 items-center justify-center rounded-full border-[16px] border-blue-600 bg-white outline outline-[16px] outline-amber-400'>
              <span><b className='block text-2xl text-[#0F1B3D]'>312</b><small className='text-[#9ca3c8]'>total</small></span>
            </div>
            <div className='mt-6 space-y-2 text-left text-sm text-slate-600'>
              {(statusEntries.length ? statusEntries : [['Open', '41%'], ['In Progress', '20%'], ['Resolved', '39%']]).map(([label, value], index) => (
                <p key={label}><span className={`mr-2 inline-block h-3 w-3 rounded-full ${index === 1 ? 'bg-amber-500' : index === 2 ? 'bg-emerald-500' : 'bg-[#2563EB]'}`} />{label} - {value}</p>
              ))}
            </div>
          </div>
        </Card>
        <Card title='Agent performance' icon={Users}>
          <DataTable headers={['Agent', 'Assigned', 'Resolved', 'Avg. res. time', 'CSAT', 'SLA met']} rows={agentRows || [
            ['Sarah K.', '48', '44', '3.2h', '97%', '95%'],
            ['Michael O.', '61', '55', '4.8h', '92%', '88%'],
            ['Amaka A.', '52', '49', '2.9h', '95%', '93%'],
            ['Tunde J.', '39', '33', '5.6h', '84%', '79%']
          ]} renderCell={(cell, index) => index === 0 ? <span className='flex items-center gap-2'><Avatar name={cell} /> {cell}</span> : index === 4 ? <b className='text-emerald-600'>{cell}</b> : cell} />
        </Card>
        <Card title='SLA compliance by priority' icon={ShieldCheck}>
          <div className='p-5'>
            <ProgressRow label='Critical' value={72} color='bg-amber-500' />
            <ProgressRow label='High' value={85} />
            <ProgressRow label='Medium' value={94} color='bg-emerald-500' />
            <ProgressRow label='Low' value={98} color='bg-emerald-500' />
            <div className='mt-5 border-t border-[#eef1f8] pt-4 text-center'>
              <p className='text-3xl font-extrabold text-emerald-600'>91%</p>
              <p className='text-sm text-[#6b7fa8]'>Overall SLA compliance</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

function SettingsPage() {
  const [activeSetting, setActiveSetting] = useState('General');
  const settings = ['General', 'Agents & Teams', 'SLA Policies', 'Automation', 'Email settings', 'Integrations', 'Security', 'Branding'];

  return (
    <>
      <PageHeader title='Settings' subtitle='Configure your service desk, teams, and automation rules'>
        <Button><Check size={16} /> Save changes</Button>
      </PageHeader>
      <div className='grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]'>
        <div className='overflow-hidden rounded-[13px] border border-[#e4e9f4] bg-white'>
          {settings.map((item) => (
            <button key={item} onClick={() => setActiveSetting(item)} className={`flex w-full items-center gap-2 border-b border-[#f3f5fb] px-4 py-3 text-left text-sm font-semibold transition last:border-b-0 ${activeSetting === item ? 'bg-blue-50 text-[#2563EB]' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Settings size={16} /> {item}
            </button>
          ))}
        </div>
        <div className='space-y-4'>
          <Card title={`${activeSetting} settings`}>
            <div className='space-y-4 p-6'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <label className='space-y-1 text-sm font-bold text-slate-700'>Portal name<input className='w-full rounded-lg border border-[#d1d9ef] px-3 py-2 font-medium outline-none focus:border-[#2563EB]' defaultValue='IT Support Center' /></label>
                <label className='space-y-1 text-sm font-bold text-slate-700'>Support email<input className='w-full rounded-lg border border-[#d1d9ef] px-3 py-2 font-medium outline-none focus:border-[#2563EB]' defaultValue='support@company.com' /></label>
                <label className='space-y-1 text-sm font-bold text-slate-700'>Time zone<select className='w-full rounded-lg border border-[#d1d9ef] px-3 py-2 font-medium outline-none focus:border-[#2563EB]'><option>Africa/Lagos (GMT+1)</option><option>UTC</option></select></label>
                <label className='space-y-1 text-sm font-bold text-slate-700'>Business hours<select className='w-full rounded-lg border border-[#d1d9ef] px-3 py-2 font-medium outline-none focus:border-[#2563EB]'><option>Mon-Fri, 8am-6pm</option><option>24/7</option></select></label>
              </div>
            </div>
          </Card>
          <Card title='Notifications & features'>
            <div className='divide-y divide-[#f3f5fb] px-6'>
              {['Email notifications', 'SLA breach alerts', 'Auto-assign tickets', 'AI ticket suggestions', 'Requester portal', 'CSAT surveys', 'Change advisory board (CAB)'].map((item, index) => (
                <ToggleRow key={item} title={item} description={featureDescription(item)} enabled={index !== 2} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function featureDescription(item) {
  const descriptions = {
    'Email notifications': 'Send agents email alerts for new and updated tickets',
    'SLA breach alerts': 'Notify agents 1 hour before SLA deadline',
    'Auto-assign tickets': 'Round-robin assignment to available agents',
    'AI ticket suggestions': 'Show related knowledge base articles when a ticket is created',
    'Requester portal': 'Allow employees to submit and track tickets via the self-service portal',
    'CSAT surveys': 'Send automated satisfaction surveys after ticket resolution',
    'Change advisory board (CAB)': 'Require CAB approval for standard change requests'
  };

  return descriptions[item];
}

function ToggleRow({ title, description, enabled }) {
  const [on, setOn] = useState(enabled);

  return (
    <div className='flex items-center justify-between gap-4 py-4'>
      <div>
        <h4 className='text-sm font-extrabold text-[#0F1B3D]'>{title}</h4>
        <p className='mt-1 text-xs text-[#6b7fa8]'>{description}</p>
      </div>
      <button onClick={() => setOn(!on)} className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-[#2563EB]' : 'bg-[#d1d9ef]'}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${on ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}

function NewTicketModal({ open, onClose, onCreated }) {
  const [priority, setPriority] = useState('Medium');
  const [form, setForm] = useState({
    requester: '',
    category: 'Hardware',
    title: '',
    description: '',
    assignedTo: '',
    dueDate: ''
  });
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await api.post('/tickets', {
        title: form.title,
        description: form.description || form.title,
        category: form.category,
        priority
      });
      await onCreated?.();
      onClose();
      setForm({ requester: '', category: 'Hardware', title: '', description: '', assignedTo: '', dueDate: '' });
      setPriority('Medium');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#0F1B3D]/45 p-4' onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className='max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl'>
        <div className='flex items-center justify-between border-b border-[#eef1f8] px-6 py-5'>
          <h3 className='flex items-center gap-2 font-extrabold text-[#0F1B3D]'><Ticket size={18} className='text-[#2563EB]' /> Log new incident</h3>
          <button onClick={onClose} className='text-slate-400 hover:text-slate-700'><X size={20} /></button>
        </div>
        <div className='space-y-4 p-6'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <label className='block space-y-1 text-xs font-extrabold text-slate-700'>Requester<input className='w-full rounded-lg border border-[#d1d9ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50' placeholder='Search employee...' value={form.requester} onChange={(event) => update('requester', event.target.value)} /></label>
            <label className='block space-y-1 text-xs font-extrabold text-slate-700'>Category<select className='w-full rounded-lg border border-[#d1d9ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50' value={form.category} onChange={(event) => update('category', event.target.value)}><option>Hardware</option><option>Software</option><option>Network</option><option>Account Access</option><option>Email</option><option>Other</option></select></label>
          </div>
          <label className='block space-y-1 text-xs font-extrabold text-slate-700'>Subject<input className='w-full rounded-lg border border-[#d1d9ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50' placeholder='Brief description of the issue' value={form.title} onChange={(event) => update('title', event.target.value)} /></label>
          <label className='block space-y-1 text-xs font-extrabold text-slate-700'>Description<textarea className='min-h-24 w-full resize-y rounded-lg border border-[#d1d9ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50' placeholder='Detailed description, steps to reproduce, error messages...' value={form.description} onChange={(event) => update('description', event.target.value)} /></label>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <label className='block space-y-1 text-xs font-extrabold text-slate-700'>Assign to<select className='w-full rounded-lg border border-[#d1d9ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50' value={form.assignedTo} onChange={(event) => update('assignedTo', event.target.value)}><option>Auto-assign</option><option>Sarah K.</option><option>Michael O.</option><option>Amaka A.</option><option>Tunde J.</option></select></label>
            <label className='block space-y-1 text-xs font-extrabold text-slate-700'>Due date<input className='w-full rounded-lg border border-[#d1d9ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50' type='date' value={form.dueDate} onChange={(event) => update('dueDate', event.target.value)} /></label>
          </div>
          <div>
            <p className='mb-2 text-xs font-extrabold text-slate-700'>Priority</p>
            <div className='grid grid-cols-4 gap-2'>
              {['Low', 'Medium', 'High', 'Critical'].map((item) => (
                <button key={item} onClick={() => setPriority(item)} className={`rounded-lg border p-3 text-center text-xs font-extrabold transition ${priority === item ? badgeClass(item).replace('text-', 'border-').replace('bg-', 'bg-') : 'border-[#e4e9f4] bg-white text-slate-600'}`}>{item}</button>
              ))}
            </div>
          </div>
        </div>
        <div className='flex justify-end gap-3 border-t border-[#eef1f8] px-6 py-4'>
          <Button variant='secondary' onClick={onClose}>Cancel</Button>
          <Button onClick={submit}><Check size={16} /> {saving ? 'Creating...' : 'Create incident'}</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, as, options, type = 'text', placeholder }) {
  const classes = 'w-full rounded-lg border border-[#d1d9ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50';

  return (
    <label className='block space-y-1 text-xs font-extrabold text-slate-700'>
      {label}
      {as === 'textarea' ? <textarea className={`${classes} min-h-24 resize-y`} placeholder={placeholder} /> : as === 'select' ? (
        <select className={classes}>{options.map((option) => <option key={option}>{option}</option>)}</select>
      ) : <input className={classes} type={type} placeholder={placeholder} />}
    </label>
  );
}

function TicketDetailPage({ showPage, ticketId = 'INC-2847' }) {
  const [tab, setTab] = useState('conversation');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fallbackMessages = [
    ['John Adeyemi', 'Requester', 'JA', 'blue', 'May 10 - 9:14 AM', 'My laptop screen started flickering after installing the Windows 11 update yesterday. The display shows horizontal artifacts and occasionally goes black every few minutes. I tried restarting and rolling back the display driver, but the issue persists.'],
    ['System', 'Automation', 'SYS', 'dark', 'May 10 - 9:15 AM', 'Ticket assigned to Sarah K. from the Hardware team. SLA: first response within 2h and resolution within 8h.'],
    ['Sarah K.', 'Support agent', 'SK', 'dark', 'May 10 - 10:58 AM', 'Hi John, thanks for the detailed report. This is a known issue with KB5034123 on certain Dell XPS models. Please update the display driver, uninstall the update if needed, then restart and monitor for 30 minutes.'],
    ['John Adeyemi', 'Requester', 'JA', 'blue', 'May 11 - 8:47 AM', 'Thanks Sarah. Uninstalling the update reduced the frequency, but it still flickers every 30 minutes. Should I bring the laptop in for inspection?'],
    ['Sarah K.', 'Support agent', 'SK', 'dark', 'May 11 - 10:12 AM', 'Yes, please bring it to IT Room 204 tomorrow between 9am and 12pm. We will run diagnostics and check the display cable and panel.']
  ];

  const loadTicket = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get(`/tickets/${ticketId}`);
      setTicket(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load this ticket.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const messages = ticket?.comments?.length
    ? ticket.comments.map((comment) => [
      comment.author?.name || 'System',
      comment.authorRole === 'staff' ? 'Support agent' : comment.authorRole === 'admin' ? 'Admin' : 'Requester',
      initials(comment.author?.name || 'System'),
      comment.authorRole === 'user' ? 'blue' : 'dark',
      comment.createdAt ? new Date(comment.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '',
      comment.message
    ])
    : fallbackMessages;

  const notes = [
    ['Sarah K.', 'SK', 'May 10 - 11:05 AM', 'This is the 3rd ticket this week related to KB5034123 on Dell XPS laptops. We may need to create a problem record and notify Dell XPS users.'],
    ['Michael O.', 'MO', 'May 10 - 2:30 PM', 'Confirmed on 2 other tickets. I will create PRB-0015 and link this ticket. Dell says a hotfix driver is expected within 48-72 hours.']
  ];

  return (
    <>
      <div className='mb-5 flex items-center gap-2 text-xs font-semibold text-[#9ca3c8]'>
        <button onClick={() => showPage('dashboard')} className='text-[#2563EB] hover:underline'>Home</button>
        <ChevronRight size={13} />
        <button onClick={() => showPage('incidents')} className='text-[#2563EB] hover:underline'>Incidents</button>
        <ChevronRight size={13} />
        {ticket?.ticketNumber || ticketId}
      </div>

      {(loading || error) && (
        <div className={`mb-4 rounded-lg border px-4 py-3 text-sm font-semibold ${error ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-blue-100 bg-blue-50 text-[#2563EB]'}`}>
          {error || 'Loading ticket...'}
        </div>
      )}

      <div className='grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]'>
        <div>
          <section className='mb-4 rounded-[13px] border border-[#e4e9f4] bg-white p-6'>
            <div className='mb-3 flex flex-wrap items-center gap-2 text-xs font-extrabold text-[#2563EB]'>
              {ticket?.ticketNumber || ticketId} <Badge>{ticket?.status || 'In Progress'}</Badge><Badge>{ticket?.priority || 'High'} priority</Badge>
            </div>
            <h1 className='max-w-4xl text-xl font-extrabold leading-snug text-[#0F1B3D]'>{ticket?.title || 'Laptop screen flickering and display artifacts after Windows update'}</h1>
            <div className='mt-4 flex flex-wrap gap-4 text-xs font-medium text-[#6b7fa8]'>
              <span className='flex items-center gap-1'><Laptop size={15} /> {ticket?.category || 'Hardware'}</span>
              <span className='flex items-center gap-1'><Users size={15} /> {ticket?.createdBy?.name || 'John Adeyemi'}</span>
              <span className='flex items-center gap-1'><CalendarDays size={15} /> Opened {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'May 10, 2026'}</span>
              <span className='flex items-center gap-1'><CheckCircle2 size={15} /> Assigned to {ticket?.assignedTo?.name || 'Unassigned'}</span>
              <span className='flex items-center gap-1 font-extrabold text-amber-600'><Clock3 size={15} /> SLA: {ticket?.sla?.resolutionDue || 'On track'}</span>
            </div>
          </section>

          <Card>
            <div className='flex overflow-x-auto border-b-2 border-[#eef1f8]'>
              {[
                ['conversation', MessageCircle, 'Conversation'],
                ['notes', ShieldCheck, 'Internal notes'],
                ['time', Clock3, 'Time tracked'],
                ['linked', LinkIcon, 'Linked items']
              ].map(([id, Icon, label]) => (
                <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition ${tab === id ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#6b7fa8] hover:text-[#2563EB]'}`}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>

            {tab === 'conversation' && <Thread messages={messages} />}
            {tab === 'notes' && <Thread messages={notes.map(([name, code, time, body]) => [name, 'Internal', code, 'amber', time, body])} internal />}
            {tab === 'time' && (
              <div className='p-5'>
                <div className='mb-4 flex items-center justify-between'>
                  <div><p className='text-2xl font-extrabold text-[#0F1B3D]'>1h 42m</p><p className='text-xs text-[#6b7fa8]'>Total time tracked</p></div>
                  <Button><Plus size={15} /> Log time</Button>
                </div>
                {[
                  ['Initial triage and diagnosis', 'Sarah K. - May 10, 2026', '45 min'],
                  ['Follow-up communication and research', 'Sarah K. - May 11, 2026', '32 min'],
                  ['Problem record investigation', 'Michael O. - May 10, 2026', '25 min']
                ].map((entry) => (
                  <div key={entry[0]} className='flex items-center gap-3 border-b border-[#f3f5fb] py-3 last:border-b-0'>
                    <Avatar name={entry[1]} tone='dark' />
                    <div className='flex-1'><p className='text-sm font-bold text-[#1a2340]'>{entry[0]}</p><p className='text-xs text-[#9ca3c8]'>{entry[1]}</p></div>
                    <b className='text-sm text-[#0F1B3D]'>{entry[2]}</b>
                  </div>
                ))}
              </div>
            )}
            {tab === 'linked' && (
              <div className='space-y-4 p-5'>
                <LinkedItem tone='amber' icon={Bug} title='KB5034123 causes display flickering on Dell XPS laptops' meta='PRB-0015 - 4 incidents linked - Under investigation' badge='Known error' />
                <LinkedItem tone='blue' icon={Laptop} title='Dell XPS 15 (2024) - AST-0441' meta='Assigned to John Adeyemi - Floor 3, Finance - Warranty: Jan 2027' badge='In use' />
              </div>
            )}
          </Card>

          <ReplyBox ticketId={ticketId} onSent={loadTicket} />
        </div>

        <TicketSidebar ticket={ticket} />
      </div>
    </>
  );
}

function Thread({ messages, internal = false }) {
  return (
    <div className='divide-y divide-[#f3f5fb]'>
      {messages.map(([name, role, code, tone, time, body]) => (
        <article key={`${name}-${time}`} className='p-5'>
          <div className='mb-3 flex items-center gap-3'>
            <Avatar name={code} tone={tone} />
            <b className='text-sm text-[#0F1B3D]'>{name}</b>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${internal ? 'bg-amber-50 text-amber-700' : role === 'Support agent' ? 'bg-blue-50 text-blue-700' : 'text-[#9ca3c8]'}`}>{role}</span>
            <span className='ml-auto text-xs text-[#9ca3c8]'>{time}</span>
          </div>
          <p className={`ml-11 rounded-xl p-4 text-sm leading-7 ${internal ? 'border-l-4 border-amber-400 bg-amber-50 text-slate-700' : role === 'Support agent' ? 'border-l-4 border-[#2563EB] bg-[#F4F8FF] text-slate-700' : role === 'Automation' ? 'bg-slate-100 italic text-[#6b7fa8]' : 'text-slate-700'}`}>{body}</p>
        </article>
      ))}
    </div>
  );
}

function ReplyBox({ ticketId, onSent }) {
  const [mode, setMode] = useState('reply');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  const sendReply = async () => {
    if (!draft.trim()) return;
    setSending(true);

    try {
      await api.post(`/tickets/${ticketId}/comments`, { message: draft });
      setDraft('');
      await onSent?.();
    } finally {
      setSending(false);
    }
  };

  return (
    <section className='mt-4 overflow-hidden rounded-[13px] border border-[#e4e9f4] bg-white'>
      <div className='flex border-b border-[#eef1f8]'>
        <button onClick={() => setMode('reply')} className={`px-4 py-3 text-sm font-bold ${mode === 'reply' ? 'bg-[#F4F8FF] text-[#2563EB]' : 'text-[#6b7fa8]'}`}>Reply to requester</button>
        <button onClick={() => setMode('note')} className={`px-4 py-3 text-sm font-bold ${mode === 'note' ? 'bg-amber-50 text-amber-700' : 'text-[#6b7fa8]'}`}>Internal note</button>
      </div>
      <div className='flex gap-1 border-b border-[#eef1f8] px-3 py-2 text-[#9ca3c8]'>
        {[BoldIcon, ItalicIcon, LinkIcon, List, Code2].map((Icon, index) => <button key={index} className='rounded-md p-1.5 hover:bg-slate-100 hover:text-slate-700'><Icon size={16} /></button>)}
        <button className='ml-auto rounded-md p-1.5 text-[#2563EB] hover:bg-blue-50'><FileText size={16} /></button>
      </div>
      <textarea className='min-h-28 w-full resize-y border-none px-4 py-4 text-sm outline-none' placeholder={mode === 'reply' ? 'Write your reply...' : 'Write an internal note...'} value={draft} onChange={(event) => setDraft(event.target.value)} />
      <div className='flex flex-wrap items-center justify-between gap-3 border-t border-[#eef1f8] px-4 py-3'>
        <div className='flex flex-wrap gap-2'>
          <button className='flex items-center gap-2 rounded-lg border border-[#d1d9ef] px-3 py-2 text-xs font-bold text-[#6b7fa8]'><Paperclip size={14} /> Attach</button>
          <select className='rounded-lg border border-[#d1d9ef] px-3 py-2 text-xs font-semibold text-slate-700'><option>Keep as In Progress</option><option>Resolve after send</option><option>Close after send</option></select>
        </div>
        <button onClick={sendReply} disabled={sending || !draft.trim()} className='flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-extrabold text-white hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60'><Send size={15} /> {sending ? 'Sending...' : 'Send reply'}</button>
      </div>
    </section>
  );
}

function BoldIcon(props) {
  return <span {...props} className={`font-black ${props.className || ''}`}>B</span>;
}

function ItalicIcon(props) {
  return <span {...props} className={`font-serif italic ${props.className || ''}`}>I</span>;
}

function LinkedItem({ tone, icon: Icon, title, meta, badge }) {
  const styles = tone === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-[#2563EB]';
  return (
    <div className={`flex items-center gap-4 rounded-xl p-4 ${styles}`}>
      <Icon size={24} />
      <div className='flex-1'><h4 className='font-extrabold text-[#0F1B3D]'>{title}</h4><p className='mt-1 text-xs text-[#6b7fa8]'>{meta}</p></div>
      <Badge>{badge}</Badge>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <section className='mb-4 overflow-hidden rounded-[13px] border border-[#e4e9f4] bg-white'>
      <div className='flex items-center justify-between border-b border-[#eef1f8] px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#9ca3c8]'>{title}<span className='normal-case tracking-normal text-[#2563EB]'>Edit</span></div>
      {children}
    </section>
  );
}

function InfoRow({ label, value, badge }) {
  return (
    <div className='flex items-start justify-between gap-3 border-b border-[#f3f5fb] px-4 py-3 last:border-b-0'>
      <span className='text-xs text-[#6b7fa8]'>{label}</span>
      {badge ? <Badge>{value}</Badge> : <span className='max-w-40 text-right text-xs font-bold text-[#1a2340]'>{value}</span>}
    </div>
  );
}

function TicketSidebar({ ticket }) {
  return (
    <aside>
      <InfoCard title='Ticket details'>
        <InfoRow label='Status' value={ticket?.status || 'In Progress'} badge />
        <InfoRow label='Priority' value={ticket?.priority || 'High'} badge />
        <InfoRow label='Category' value={ticket?.category || 'Hardware'} />
        <InfoRow label='Sub-category' value='Laptop / Display' />
        <InfoRow label='Assigned to' value={ticket?.assignedTo?.name || 'Unassigned'} />
        <InfoRow label='Team' value={ticket?.category || 'Hardware'} />
        <InfoRow label='Requester' value={ticket?.createdBy?.name || 'John Adeyemi'} />
        <InfoRow label='Department' value={ticket?.createdBy?.department || 'Finance'} />
        <InfoRow label='Source' value='Portal' />
      </InfoCard>
      <InfoCard title='SLA status'>
        <InfoRow label='First response' value='Met (1h 44m)' />
        <InfoRow label='Resolution due' value='2h remaining' />
        <InfoRow label='Priority SLA' value='8h (High)' />
      </InfoCard>
      <InfoCard title='Activity timeline'>
        <ul className='space-y-4 p-4'>
          {['Agent replied', 'Requester replied', 'Linked to PRB-0015', 'Agent responded', 'Assigned to Sarah K.', 'Ticket created'].map((item, index) => (
            <li key={item} className='flex gap-3 text-xs text-[#6b7fa8]'>
              <span className={`mt-1 h-2 w-2 rounded-full ${index === 5 ? 'bg-emerald-500' : index === 2 ? 'bg-amber-500' : 'bg-[#2563EB]'}`} />
              <span><b className='block text-[#1a2340]'>{item}</b>May {11 - Math.min(index, 1)}, 2026</span>
            </li>
          ))}
        </ul>
      </InfoCard>
    </aside>
  );
}

function SelfServicePortalPage({ showPage }) {
  return (
    <>
      <section className='relative mb-7 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F1B3D] via-[#162252] to-[#1a2f6e] px-8 py-12 text-center'>
        <div className='absolute left-1/2 top-0 h-64 w-[520px] -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl' />
        <div className='relative'>
          <h1 className='text-4xl font-extrabold text-white'>Hi John, how can we <span className='text-blue-300'>help you?</span></h1>
          <p className='mt-3 text-sm text-blue-100/80'>Search articles, browse the service catalog, or track your existing tickets - all in one place.</p>
          <div className='mx-auto mt-7 flex max-w-xl items-center gap-3 rounded-xl bg-white p-2 pl-5 shadow-2xl shadow-slate-950/30'>
            <Search size={20} className='text-[#9ca3bb]' />
            <input className='min-w-0 flex-1 outline-none' placeholder='Describe your issue or search articles...' />
            <button className='rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white'>Search</button>
          </div>
          <div className='mx-auto mt-8 grid max-w-3xl grid-cols-2 divide-white/10 overflow-hidden rounded-xl bg-white/5 md:grid-cols-4 md:divide-x'>
            {['12k+|Issues resolved', '98%|Satisfaction', '2 min|Avg response', '24/7|Support'].map((item) => {
              const [num, label] = item.split('|');
              return <div key={label} className='p-4'><p className='text-2xl font-extrabold text-white'>{num}</p><p className='text-xs text-blue-100/60'>{label}</p></div>;
            })}
          </div>
        </div>
      </section>

      <p className='mb-3 text-xs font-extrabold uppercase tracking-wider text-[#9ca3c8]'>What do you need?</p>
      <div className='mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6'>
        {[
          ['Report an issue', 'Something not working? Log an IT ticket.', Plus, 'bg-blue-50 text-[#2563EB]', 'ticketDetail'],
          ['Request a service', 'Laptop, software license, access, and more.', AppWindow, 'bg-violet-50 text-violet-600', 'catalog'],
          ['Browse guides', 'Step-by-step articles and how-to guides.', BookOpen, 'bg-emerald-50 text-emerald-600', 'kb'],
          ['My requests', 'Track and update your open tickets.', List, 'bg-amber-50 text-amber-600', 'requests'],
          ['Reset password', 'Unlock account or reset your password.', ShieldCheck, 'bg-cyan-50 text-cyan-700', 'ticketDetail'],
          ['Report outage', 'System down or widespread issue.', AlertTriangle, 'bg-red-50 text-red-600', 'ticketDetail']
        ].map(([title, desc, Icon, tone, target]) => (
          <button key={title} onClick={() => showPage(target)} className='rounded-[13px] border border-[#e4e9f4] bg-white p-5 text-center transition hover:-translate-y-0.5 hover:border-[#2563EB] hover:shadow-lg hover:shadow-blue-600/10'>
            <span className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}><Icon size={23} /></span>
            <h4 className='text-sm font-extrabold text-[#0F1B3D]'>{title}</h4>
            <p className='mt-1 text-xs text-[#6b7fa8]'>{desc}</p>
          </button>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]'>
        <div className='space-y-4'>
          <Card title='My open tickets' icon={Ticket} action={<Button variant='secondary'>View all</Button>}>
            <PortalTicket icon={Laptop} title='Laptop screen flickering after Windows update' meta='INC-2847 - Hardware - Assigned to Sarah K.' badge='In Progress' />
            <PortalTicket icon={AppWindow} title='New laptop request - Dell XPS 15' meta='SR-0192 - Awaiting manager approval' badge='Awaiting approval' />
            <PortalTicket icon={Wifi} title='VPN connection dropping at home office' meta='INC-2801 - Resolved by Michael O.' badge='Resolved' />
          </Card>
          <Card title='Recommended for you' icon={Flame}>
            <PortalTicket icon={BookOpen} title='How to fix screen flickering on Dell XPS' meta='Hardware - 5 min read - 1,248 views' />
            <PortalTicket icon={BookOpen} title='Requesting a software license - step by step' meta='Software - 3 min read - 891 views' />
            <PortalTicket icon={BookOpen} title='Connecting to company VPN from home' meta='Network - 4 min read - 2,814 views' />
          </Card>
        </div>
        <div className='space-y-4'>
          <Announcement title='Email server maintenance' label='Planned maintenance' body='Scheduled May 14, 11pm-1am. Outlook and webmail will be unavailable during this window.' />
          <Announcement title='KB5034123 Windows update' label='Known issue' body='Affecting Dell XPS laptops. Do not install this update. Fix expected within 48h.' danger />
          <InfoCard title='System status'>
            {['Email', 'VPN', 'File storage', 'Portal'].map((item) => <InfoRow key={item} label={item} value='Operational' />)}
          </InfoCard>
          <div className='rounded-[13px] bg-[#0F1B3D] p-5 text-center text-white'>
            <span className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/20 text-blue-300'><LifeBuoy size={24} /></span>
            <h3 className='font-extrabold'>Need urgent help?</h3>
            <p className='mt-2 text-xs text-blue-100/70'>Call the IT helpline or start a live chat.</p>
            <button className='mt-4 w-full rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-extrabold'>Start live chat</button>
          </div>
        </div>
      </div>
    </>
  );
}

function PortalTicket({ icon: Icon, title, meta, badge }) {
  return (
    <div className='flex cursor-pointer items-center gap-3 border-b border-[#f3f5fb] px-4 py-4 transition last:border-b-0 hover:bg-[#f8faff]'>
      <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]'><Icon size={20} /></span>
      <div className='min-w-0 flex-1'><h4 className='text-sm font-bold text-[#1a2340]'>{title}</h4><p className='mt-1 text-xs text-[#9ca3c8]'>{meta}</p></div>
      {badge ? <Badge>{badge}</Badge> : <ChevronRight size={18} className='text-[#bfcfe8]' />}
    </div>
  );
}

function Announcement({ title, label, body, danger = false }) {
  return (
    <div className={`rounded-[13px] p-5 text-white ${danger ? 'bg-gradient-to-br from-red-950 to-red-800' : 'bg-gradient-to-br from-[#0F1B3D] to-[#162252]'}`}>
      <p className={`mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide ${danger ? 'text-red-300' : 'text-blue-300'}`}><Wrench size={16} /> {label}</p>
      <h4 className='font-extrabold'>{title}</h4>
      <p className='mt-2 text-xs leading-5 text-blue-100/75'>{body}</p>
    </div>
  );
}

function UsersRolesPage({ openInvite, users }) {
  const userItems = users?.length
    ? users.map((user) => [user.name, user.email, initials(user.name), user.role === 'admin' ? 'Admin' : user.role === 'staff' ? 'Agent' : 'Requester', user.isActive === false ? 'Inactive' : 'Active', user.isActive !== false])
    : null;

  return (
    <>
      <PageHeader title='Users & Role Management' subtitle='Manage agents, requesters, and access permissions'>
        <Button onClick={openInvite}><UserPlus size={16} /> Invite user</Button>
      </PageHeader>
      <div className='mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5'>
        <StatCard label='Total users' value='84' />
        <StatCard label='Admins' value='3' accent='text-violet-600' />
        <StatCard label='Agents' value='12' accent='text-[#2563EB]' />
        <StatCard label='Requesters' value='69' accent='text-emerald-600' />
        <StatCard label='Pending invites' value='4' accent='text-amber-600' />
      </div>
      <div className='grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]'>
        <div className='space-y-4'>
          <Card title='Agents & admins' icon={ShieldCheck} action={<input className='rounded-lg border border-[#d1d9ef] px-3 py-2 text-sm outline-none' placeholder='Search agents...' />}>
            <div className='flex flex-wrap gap-2 px-4 pt-3'>
              {['All roles', 'Admins', 'Agents', 'Viewers'].map((tab, index) => <button key={tab} className={`rounded-full border px-4 py-1.5 text-xs font-bold ${index === 0 ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-[#e4e9f4] text-[#6b7fa8]'}`}>{tab}</button>)}
            </div>
            <div className='divide-y divide-[#f3f5fb]'>
              {(userItems || [
                ['IT Director', 'itdirector@company.com', 'IT', 'Admin', 'Active', true],
                ['Sarah K.', 'sarah.k@company.com', 'SK', 'Agent', 'Active', true],
                ['Michael O.', 'michael.o@company.com', 'MO', 'Agent', 'Active', true],
                ['Amaka A.', 'amaka.a@company.com', 'AA', 'Agent', 'Active', true],
                ['Tunde J.', 'tunde.j@company.com', 'TJ', 'Agent', 'Away', false],
                ['Ngozi G.', 'ngozi.g@company.com', 'NG', 'Agent', 'Pending', false]
              ]).map((person) => <UserRow key={person[1]} person={person} />)}
            </div>
          </Card>
          <Card title='Teams' icon={Users} action={<Button variant='secondary'><Plus size={14} /> Add team</Button>}>
            <DataTable headers={['Team name', 'Category', 'Members', 'Open tickets', 'Lead']} rows={[
              ['Hardware', 'Hardware support', '3 agents', '7', 'Sarah K.'],
              ['Network', 'Network & connectivity', '2 agents', '4', 'Michael O.'],
              ['Software', 'Applications & licensing', '2 agents', '3', 'Amaka A.'],
              ['Account Access', 'Identity & access', '1 agent', '2', 'Tunde J.']
            ]} renderCell={(cell, index) => index === 0 ? <b>{cell}</b> : index === 3 ? <b className='text-[#2563EB]'>{cell}</b> : cell} />
          </Card>
        </div>
        <div>
          <p className='mb-3 text-xs font-extrabold uppercase tracking-wider text-[#6b7fa8]'>Role definitions</p>
          <RoleCard title='Administrator' badge='Admin' selected permissions={['Manage agents & roles', 'Configure automation rules', 'Access all reports', 'Approve changes (CAB)', 'Manage SLA policies']} />
          <RoleCard title='Agent' badge='Agent' permissions={['Handle assigned tickets', 'View team metrics', 'Create knowledge articles']} denied={['Manage agents & roles', 'Approve changes (CAB)']} />
          <RoleCard title='Viewer' badge='Viewer' permissions={['View reports (read-only)', 'View tickets']} denied={['Create or modify tickets', 'Configure automation']} />
        </div>
      </div>
    </>
  );
}

function UserRow({ person }) {
  const [name, email, code, role, status, online] = person;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${status === 'Pending' ? 'bg-amber-50/60' : ''}`}>
      <span className={`h-2 w-2 rounded-full ${online ? 'bg-emerald-500' : status === 'Pending' ? 'bg-amber-500' : 'bg-slate-400'}`} />
      <Avatar name={code} tone={role === 'Admin' ? 'dark' : status === 'Pending' ? 'amber' : 'blue'} />
      <div className='min-w-0 flex-1'><h4 className='text-sm font-bold text-[#1a2340]'>{name}</h4><p className='text-xs text-[#9ca3c8]'>{email}</p></div>
      <Badge>{role}</Badge>
      <Badge>{status}</Badge>
      <button className='rounded-lg border border-[#e4e9f4] p-2 text-[#9ca3c8] hover:border-[#2563EB] hover:text-[#2563EB]'><Edit3 size={15} /></button>
      <button className='rounded-lg border border-[#e4e9f4] p-2 text-[#9ca3c8] hover:border-red-500 hover:text-red-600'><Trash2 size={15} /></button>
    </div>
  );
}

function RoleCard({ title, badge, permissions = [], denied = [], selected = false }) {
  return (
    <article className={`mb-3 rounded-[13px] border p-5 ${selected ? 'border-[#2563EB] bg-[#F4F8FF]' : 'border-[#e4e9f4] bg-white'}`}>
      <div className='mb-3 flex items-center justify-between'><h4 className='font-extrabold text-[#0F1B3D]'>{title}</h4><Badge>{badge}</Badge></div>
      <p className='mb-4 text-xs leading-5 text-[#6b7fa8]'>{title === 'Administrator' ? 'Full access to all settings, users, reports, and configurations.' : title === 'Agent' ? 'Handle and resolve assigned tickets.' : 'Read-only access to tickets and reports.'}</p>
      <div className='space-y-2 text-xs font-medium text-slate-700'>
        {permissions.map((item) => <p key={item} className='flex items-center gap-2'><Check size={15} className='text-emerald-600' /> {item}</p>)}
        {denied.map((item) => <p key={item} className='flex items-center gap-2'><X size={15} className='text-slate-300' /> {item}</p>)}
      </div>
    </article>
  );
}

function AutomationPage({ openRule, automationRules }) {
  const rules = automationRules?.length ? automationRules.map((rule) => ({
    id: rule._id,
    name: rule.name,
    desc: rule.description,
    trigger: rule.trigger,
    condition: rule.conditions?.[0] || 'No condition',
    actions: rule.actions || [],
    meta: `Triggered ${rule.executions || 0} times`,
    enabled: rule.active
  })) : [
    { name: 'Auto-assign critical tickets to senior agents', desc: 'Immediately routes critical-priority tickets to available senior agents', trigger: 'Ticket created', condition: 'Priority = Critical', actions: ['Assign to Senior Agent', 'Notify IT Director'], meta: 'Triggered 142 times', enabled: true },
    { name: 'SLA breach alert - 1 hour warning', desc: 'Sends email and in-app alert before SLA deadline', trigger: 'SLA: 1h remaining', condition: 'Status not Resolved', actions: ['Email agent', 'Alert team lead'], meta: 'Triggered 89 times', enabled: true },
    { name: 'Auto-close resolved tickets after 48 hours', desc: 'Closes tickets with no requester reply after resolution', trigger: '48h after resolved', condition: 'No requester reply', actions: ['Close ticket', 'Send CSAT survey'], meta: 'Triggered 318 times', enabled: true },
    { name: 'Route hardware tickets to Hardware team', desc: 'Automatically assigns Hardware category tickets to the Hardware team', trigger: 'Ticket created', condition: 'Category = Hardware', actions: ['Assign group: Hardware'], meta: 'Triggered 412 times', enabled: true },
    { name: 'Escalate unassigned tickets after 30 min', desc: 'Notifies team lead if ticket remains unassigned', trigger: '30 min after created', condition: 'Unassigned', actions: ['Escalate to team lead'], meta: 'Inactive', enabled: false }
  ];

  return (
    <>
      <PageHeader title='Automation Rules' subtitle='Automate ticket routing, escalations, notifications, and SLA actions'>
        <Button onClick={openRule}><Plus size={16} /> New rule</Button>
      </PageHeader>
      <div className='grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]'>
        <div>
          <p className='mb-3 text-xs font-extrabold uppercase tracking-wider text-[#9ca3c8]'>Active rules</p>
          {rules.map((rule) => <AutomationRule key={rule[0]} rule={rule} />)}
        </div>
        <aside className='space-y-4'>
          <AutomationStat title='Total executions (30 days)' value='1,284' sub='Up 14% vs last month' />
          <AutomationStat title='Hours saved (est.)' value='48h' sub='Based on avg. manual task time' tone='text-emerald-600' />
          <AutomationStat title='Active rules' value='6' sub='2 inactive - 0 errors' tone='text-[#2563EB]' />
          <section className='rounded-[13px] border-2 border-dashed border-blue-200 bg-white p-5'>
            <h4 className='mb-4 flex items-center gap-2 font-extrabold text-[#0F1B3D]'><Wand2 size={18} className='text-violet-600' /> Quick rule builder</h4>
            <Field label='When (trigger)' as='select' options={['Ticket is created', 'Ticket is updated', 'SLA is about to breach', 'Ticket is resolved']} />
            <Field label='If (condition)' as='select' options={['Priority = Critical', 'Category = Hardware', 'Status = Open', 'Source = Portal']} />
            <Field label='Then (action)' as='select' options={['Assign to agent', 'Assign to team', 'Send email notification', 'Change priority']} />
            <button onClick={openRule} className='mt-2 w-full rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-extrabold text-white'>Save rule</button>
          </section>
        </aside>
      </div>
    </>
  );
}

function AutomationRule({ rule }) {
  const { id, name, desc, trigger, condition, actions, meta, enabled } = rule;
  const [on, setOn] = useState(enabled);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    const nextValue = !on;
    setOn(nextValue);

    if (!id) return;

    setSaving(true);
    try {
      const { data } = await api.patch(`/automation/${id}/toggle`);
      setOn(data.active);
    } catch {
      setOn(!nextValue);
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className={`mb-3 rounded-[13px] border border-[#e4e9f4] bg-white p-5 transition hover:border-blue-200 hover:shadow-md ${!on ? 'opacity-60' : ''}`}>
      <div className='mb-4 flex items-start justify-between gap-4'>
        <div><h3 className='font-extrabold text-[#0F1B3D]'>{name}</h3><p className='mt-1 text-xs text-[#6b7fa8]'>{desc}</p></div>
        <button onClick={toggle} disabled={saving} className={`relative h-6 w-11 rounded-full transition disabled:opacity-60 ${on ? 'bg-[#2563EB]' : 'bg-[#d1d9ef]'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${on ? 'left-6' : 'left-1'}`} /></button>
      </div>
      <div className='mb-4 flex flex-wrap items-center gap-2'>
        <RuleChip tone='blue' icon={Flame}>{trigger}</RuleChip><ChevronRight size={16} className='text-[#9ca3c8]' />
        <RuleChip tone='violet' icon={Search}>{condition}</RuleChip><ChevronRight size={16} className='text-[#9ca3c8]' />
        {actions.map((action) => <RuleChip key={action} tone='green' icon={CheckCircle2}>{action}</RuleChip>)}
      </div>
      <div className='flex items-center justify-between border-t border-[#f3f5fb] pt-3 text-xs text-[#9ca3c8]'>
        <span>{meta}</span>
        <div className='flex gap-2'><button className='rounded-lg border border-[#e4e9f4] p-2 hover:text-[#2563EB]'><Edit3 size={14} /></button><button className='rounded-lg border border-[#e4e9f4] p-2 hover:text-red-600'><Trash2 size={14} /></button></div>
      </div>
    </article>
  );
}

function RuleChip({ children, tone, icon: Icon }) {
  const styles = tone === 'violet' ? 'bg-violet-50 text-violet-700' : tone === 'green' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700';
  return <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold ${styles}`}><Icon size={13} /> {children}</span>;
}

function AutomationStat({ title, value, sub, tone = 'text-[#0F1B3D]' }) {
  return <div className='rounded-[13px] border border-[#e4e9f4] bg-white p-5'><p className='text-xs font-extrabold uppercase tracking-wide text-[#6b7fa8]'>{title}</p><p className={`mt-2 text-4xl font-extrabold ${tone}`}>{value}</p><p className='mt-1 text-xs text-[#9ca3c8]'>{sub}</p></div>;
}

function InviteModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: 'staff', department: 'Hardware', note: '' });
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async () => {
    if (!form.email.trim()) return;
    setSaving(true);
    try {
      await api.post('/auth/register', {
        name: `${form.firstName} ${form.lastName}`.trim() || form.email,
        email: form.email,
        password: 'password123',
        role: form.role,
        department: form.department
      });
      await onCreated?.();
      onClose();
      setForm({ firstName: '', lastName: '', email: '', role: 'staff', department: 'Hardware', note: '' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title='Invite new user' icon={UserPlus} onClose={onClose}>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <label className='block space-y-1 text-xs font-extrabold text-slate-700'>First name<input className='w-full rounded-lg border border-[#d1d9ef] px-3 py-2 text-sm outline-none focus:border-[#2563EB]' placeholder='e.g. Ngozi' value={form.firstName} onChange={(event) => update('firstName', event.target.value)} /></label>
        <label className='block space-y-1 text-xs font-extrabold text-slate-700'>Last name<input className='w-full rounded-lg border border-[#d1d9ef] px-3 py-2 text-sm outline-none focus:border-[#2563EB]' placeholder='e.g. Adeyemi' value={form.lastName} onChange={(event) => update('lastName', event.target.value)} /></label>
      </div>
      <label className='mt-4 block space-y-1 text-xs font-extrabold text-slate-700'>Work email<input className='w-full rounded-lg border border-[#d1d9ef] px-3 py-2 text-sm outline-none focus:border-[#2563EB]' type='email' placeholder='ngozi@company.com' value={form.email} onChange={(event) => update('email', event.target.value)} /></label>
      <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
        <label className='block space-y-1 text-xs font-extrabold text-slate-700'>Role<select className='w-full rounded-lg border border-[#d1d9ef] px-3 py-2 text-sm outline-none focus:border-[#2563EB]' value={form.role} onChange={(event) => update('role', event.target.value)}><option value='staff'>Agent</option><option value='admin'>Administrator</option><option value='user'>Viewer / Requester</option></select></label>
        <label className='block space-y-1 text-xs font-extrabold text-slate-700'>Assign to team<select className='w-full rounded-lg border border-[#d1d9ef] px-3 py-2 text-sm outline-none focus:border-[#2563EB]' value={form.department} onChange={(event) => update('department', event.target.value)}><option>Hardware</option><option>Network</option><option>Software</option><option>Account Access</option></select></label>
      </div>
      <label className='mt-4 block space-y-1 text-xs font-extrabold text-slate-700'>Personal note<textarea className='min-h-20 w-full rounded-lg border border-[#d1d9ef] px-3 py-2 text-sm outline-none focus:border-[#2563EB]' placeholder='Add a welcome message to the invite email...' value={form.note} onChange={(event) => update('note', event.target.value)} /></label>
      <ModalActions onClose={onClose} onAction={submit} action={saving ? 'Sending...' : 'Send invite'} icon={Send} />
    </ModalShell>
  );
}

function RuleModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', description: '', active: true });
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await api.post('/automation', {
        name: form.name,
        description: form.description,
        trigger: 'Ticket is created',
        conditions: ['Priority = Critical'],
        actions: ['Assign to agent'],
        active: form.active
      });
      await onCreated?.();
      onClose();
      setForm({ name: '', description: '', active: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title='Save automation rule' icon={Bot} onClose={onClose}>
      <label className='block space-y-1 text-xs font-extrabold text-slate-700'>Rule name<input className='w-full rounded-lg border border-[#d1d9ef] px-3 py-2 text-sm outline-none focus:border-[#2563EB]' placeholder='e.g. Route critical tickets to senior agents' value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
      <label className='mt-4 block space-y-1 text-xs font-extrabold text-slate-700'>Description<input className='w-full rounded-lg border border-[#d1d9ef] px-3 py-2 text-sm outline-none focus:border-[#2563EB]' placeholder='Brief description of what this rule does' value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
      <div className='mb-4 rounded-xl bg-[#F4F8FF] p-4 text-sm text-slate-700'><b className='mb-2 block text-[#2563EB]'>Rule summary</b>When <b>ticket is created</b> and <b>priority = Critical</b>, then <b>assign to agent</b>.</div>
      <ToggleRow title='Enable rule immediately' description='The rule starts running after you save it.' enabled />
      <ModalActions onClose={onClose} onAction={submit} action={saving ? 'Saving...' : 'Save rule'} icon={Check} />
    </ModalShell>
  );
}

function ModalShell({ title, icon: Icon, children, onClose }) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#0F1B3D]/50 p-4' onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className='max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl'>
        <div className='flex items-center justify-between border-b border-[#eef1f8] px-6 py-5'><h3 className='flex items-center gap-2 font-extrabold text-[#0F1B3D]'><Icon size={18} className='text-[#2563EB]' /> {title}</h3><button onClick={onClose} className='text-slate-400 hover:text-slate-700'><X size={20} /></button></div>
        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
}

function ModalActions({ onClose, onAction, action, icon: Icon }) {
  return (
    <div className='-mx-6 -mb-6 mt-5 flex justify-end gap-3 border-t border-[#eef1f8] px-6 py-4'>
      <Button variant='secondary' onClick={onClose}>Cancel</Button>
      <Button onClick={onAction || onClose}><Icon size={16} /> {action}</Button>
    </div>
  );
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    ['bot', "Hi John, I'm your IT support assistant. How can I help you today?"],
    ['bot', 'I noticed you have an open ticket INC-2847 about your laptop screen. Would you like an update on that?']
  ]);
  const [draft, setDraft] = useState('');

  const send = (text) => {
    const message = text || draft.trim();
    if (!message) return;
    setDraft('');
    setMessages((current) => [...current, ['user', message], ['bot', chatReply(message)]]);
  };

  return (
    <>
      <div className='fixed bottom-7 right-7 z-50'>
        {!open && <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white'>2</span>}
        <button onClick={() => setOpen(!open)} className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition hover:scale-105 ${open ? 'bg-red-500' : 'bg-[#2563EB] shadow-blue-600/35'}`}>{open ? <X size={25} /> : <Bot size={26} />}</button>
      </div>
      {open && (
        <section className='fixed bottom-24 right-7 z-50 flex max-h-[520px] w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl'>
          <div className='flex items-center gap-3 bg-[#0F1B3D] px-4 py-4'>
            <span className='flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-white'><Bot size={20} /></span>
            <div><h4 className='font-extrabold text-white'>IT Support Assistant</h4><p className='text-xs text-blue-100/70'>Online - typically replies instantly</p></div>
            <button onClick={() => setOpen(false)} className='ml-auto text-blue-100/60 hover:text-white'><X size={18} /></button>
          </div>
          <div className='flex-1 space-y-3 overflow-y-auto bg-[#F8FAFF] p-4'>
            {messages.map(([type, text], index) => <ChatMessage key={index} type={type} text={text} />)}
          </div>
          <div className='flex flex-wrap gap-2 px-3 py-2'>
            {['Update on INC-2847', 'New ticket', 'Talk to agent', 'Reset password'].map((item) => <button key={item} onClick={() => send(item)} className='rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#2563EB] hover:bg-[#2563EB] hover:text-white'>{item}</button>)}
          </div>
          <div className='flex gap-2 border-t border-[#eef1f8] p-3'>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} className='min-w-0 flex-1 rounded-lg border border-[#d1d9ef] px-3 py-2 text-sm outline-none focus:border-[#2563EB]' placeholder='Type your message...' />
            <button onClick={() => send()} className='rounded-lg bg-[#2563EB] p-2.5 text-white'><Send size={18} /></button>
          </div>
        </section>
      )}
    </>
  );
}

function chatReply(message) {
  const key = message.toLowerCase();
  if (key.includes('2847')) return 'Your ticket INC-2847 is In Progress. Sarah K. scheduled a hardware inspection for tomorrow at IT Room 204 between 9am and 12pm.';
  if (key.includes('new ticket')) return 'I can help you log a new ticket. Choose Hardware, Software, Network, or Account Access, then describe the issue.';
  if (key.includes('agent')) return 'Connecting you to an available agent now. Sarah K. from Hardware is online and will join shortly.';
  if (key.includes('password')) return 'Go to company.portal.com/reset, enter your work email, then use the reset link within 30 minutes.';
  return 'Thanks for your message. I can create a support ticket for this issue so an agent can follow up.';
}

function ChatMessage({ type, text }) {
  const isUser = type === 'user';
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${isUser ? 'bg-[#2563EB] text-white' : 'bg-[#0F1B3D] text-blue-300'}`}>{isUser ? 'JA' : <Bot size={15} />}</span>
      <div className={`max-w-[240px] rounded-xl px-4 py-3 text-sm leading-6 ${isUser ? 'rounded-br bg-[#2563EB] text-white' : 'rounded-bl bg-white text-[#1a2340] shadow-sm'}`}>
        {text}
        <p className={`mt-1 text-[10px] ${isUser ? 'text-blue-100' : 'text-[#9ca3c8]'}`}>Just now</p>
      </div>
    </div>
  );
}

function Dashboard({ initialPage = 'dashboard', initialTicketId }) {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [page, setPage] = useState(initialPage);
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [ruleOpen, setRuleOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(initialTicketId || 'INC-2847');
  const [loadingData, setLoadingData] = useState(true);
  const [apiError, setApiError] = useState('');
  const [data, setData] = useState({
    summary: null,
    ticketRows: tickets,
    requestRows: requests,
    problemRows: problems,
    changeRows: changes,
    assetRows: assets,
    articleRows: articles,
    catalogRows: catalog,
    report: null,
    users: [],
    automationRules: []
  });

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const openTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    setPage('ticketDetail');
    navigate(`/incidents/${ticketId}`);
  };

  const loadPortalData = async () => {
    setLoadingData(true);
    setApiError('');

    try {
      const [
        summaryRes,
        ticketsRes,
        requestsRes,
        problemsRes,
        changesRes,
        assetsRes,
        articlesRes,
        catalogRes,
        reportRes,
        usersRes,
        automationRes
      ] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/tickets'),
        api.get('/requests'),
        api.get('/problems'),
        api.get('/changes'),
        api.get('/assets'),
        api.get('/knowledge'),
        api.get('/catalog'),
        api.get('/reports/service-desk').catch(() => ({ data: null })),
        api.get('/users').catch(() => ({ data: [] })),
        api.get('/automation').catch(() => ({ data: [] }))
      ]);

      setData({
        summary: summaryRes.data,
        ticketRows: toTicketRows(ticketsRes.data),
        requestRows: toRequestRows(requestsRes.data),
        problemRows: toProblemRows(problemsRes.data),
        changeRows: toChangeRows(changesRes.data),
        assetRows: toAssetRows(assetsRes.data),
        articleRows: toArticleRows(articlesRes.data),
        catalogRows: toCatalogRows(catalogRes.data),
        report: reportRes.data,
        users: usersRes.data,
        automationRules: automationRes.data
      });
    } catch (error) {
      setApiError(error.response?.data?.message || 'Could not load live backend data. Showing built-in demo data.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  useEffect(() => {
    setPage(initialPage);
    if (initialTicketId) setSelectedTicketId(initialTicketId);
  }, [initialPage, initialTicketId]);

  const navGroupsWithBadges = navGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      if (item.id === 'incidents') {
        return { ...item, badge: String(data.summary?.tickets?.open ?? item.badge) };
      }

      if (item.id === 'requests') {
        return { ...item, badge: String(data.summary?.requests?.pending ?? item.badge) };
      }

      return item;
    })
  }));

  const pages = {
    ticketDetail: <TicketDetailPage showPage={setPage} ticketId={selectedTicketId} />,
    portal: <SelfServicePortalPage showPage={setPage} />,
    users: <UsersRolesPage openInvite={() => setInviteOpen(true)} users={data.users} />,
    automation: <AutomationPage openRule={() => setRuleOpen(true)} automationRules={data.automationRules} />,
    dashboard: <DashboardHome openModal={() => setModalOpen(true)} showPage={setPage} summary={data.summary} ticketRows={data.ticketRows} />,
    incidents: <IncidentsPage openModal={() => setModalOpen(true)} ticketRows={data.ticketRows} openTicket={openTicket} />,
    requests: <RequestsPage showPage={setPage} requestRows={data.requestRows} />,
    problems: <ProblemsPage problemRows={data.problemRows} />,
    changes: <ChangesPage changeRows={data.changeRows} />,
    catalog: <CatalogPage catalogRows={data.catalogRows} />,
    assets: <AssetsPage assetRows={data.assetRows} />,
    kb: <KnowledgePage articleRows={data.articleRows} />,
    reports: <ReportsPage report={data.report} />,
    settings: <SettingsPage />
  };

  return (
    <div className='min-h-screen bg-[#F0F2F8] text-[#1a2340]'>
      <header className='sticky top-0 z-40 flex h-14 items-center gap-4 bg-[#0F1B3D] px-5'>
        <button onClick={() => setPage('dashboard')} className='flex shrink-0 items-center gap-2 text-sm font-extrabold tracking-tight text-white'>
          <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]'><LifeBuoy size={18} /></span>
          IT Support Center
        </button>
        <div className='relative ml-2 hidden max-w-sm flex-1 md:block'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7fa8]' size={16} />
          <input className='w-full rounded-lg border border-white/10 bg-white/10 py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-[#6b7fa8] focus:border-blue-400' placeholder='Search tickets, assets, articles...' />
        </div>
        <div className='ml-auto flex items-center gap-3'>
          <Link to='/' className='hidden rounded-lg px-3 py-2 text-sm font-bold text-blue-100 transition hover:bg-white/10 md:inline-flex'>Support Home</Link>
          <button className='relative text-[#6b7fa8] transition hover:text-white'><Bell size={19} /><span className='absolute right-0 top-0 h-2 w-2 rounded-full border border-[#0F1B3D] bg-red-500' /></button>
          <button className='text-[#6b7fa8] transition hover:text-white'><HelpCircle size={19} /></button>
          <button onClick={handleLogout} className='text-[#6b7fa8] transition hover:text-white'><LogOut size={19} /></button>
          <span className='flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-xs font-extrabold text-white'>{initials(user?.name || 'John Admin')}</span>
        </div>
      </header>

      <div className='flex'>
        <aside className='sticky top-14 hidden h-[calc(100vh-56px)] w-[220px] shrink-0 overflow-y-auto border-r border-[#e4e9f4] bg-white md:flex md:flex-col'>
          <nav className='flex-1 px-2 py-3'>
            {navGroupsWithBadges.map((group) => (
              <div key={group.label} className='mb-3'>
                <p className='px-3 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-[#9ca3c8]'>{group.label}</p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = page === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPage(item.id)}
                      className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${active ? 'bg-[#EEF3FE] text-[#2563EB]' : 'text-[#4b5a7a] hover:bg-[#F0F4FF] hover:text-[#2563EB]'}`}
                    >
                      <Icon size={18} />
                      <span className='min-w-0 flex-1'>{item.label}</span>
                      {item.badge && <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white ${item.amber ? 'bg-amber-600' : 'bg-[#2563EB]'}`}>{item.badge}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className='border-t border-[#eef1f8] p-2'>
            <button onClick={() => setPage('settings')} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${page === 'settings' ? 'bg-[#EEF3FE] text-[#2563EB]' : 'text-[#4b5a7a] hover:bg-[#F0F4FF] hover:text-[#2563EB]'}`}>
              <Settings size={18} /> Settings
            </button>
          </div>
        </aside>

        <main className='min-w-0 flex-1 overflow-y-auto p-5 lg:p-7'>
          {(loadingData || apiError) && (
            <div className={`mb-4 rounded-lg border px-4 py-3 text-sm font-semibold ${apiError ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-blue-100 bg-blue-50 text-[#2563EB]'}`}>
              {apiError || 'Loading live backend data...'}
            </div>
          )}
          {pages[page]}
        </main>
      </div>

      <NewTicketModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={loadPortalData} />
      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} onCreated={loadPortalData} />
      <RuleModal open={ruleOpen} onClose={() => setRuleOpen(false)} onCreated={loadPortalData} />
      <ChatWidget />
    </div>
  );
}

export default Dashboard;
