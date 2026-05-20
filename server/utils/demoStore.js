export const demoUsers = [
  {
    _id: 'user-admin-1',
    name: 'IT Director',
    email: 'itdirector@company.com',
    password: '$2b$10$YGJNTnOzGLlCaCCXK3SOu.tfw4LFdfpuXfsv7tBjl3IBJtS7LP/Wu',
    role: 'admin',
    department: 'IT',
    isActive: true
  },
  {
    _id: 'user-staff-1',
    name: 'Sarah K.',
    email: 'sarah.k@company.com',
    password: '$2b$10$YGJNTnOzGLlCaCCXK3SOu.tfw4LFdfpuXfsv7tBjl3IBJtS7LP/Wu',
    role: 'staff',
    department: 'Hardware',
    isActive: true
  },
  {
    _id: 'user-staff-2',
    name: 'Michael O.',
    email: 'michael.o@company.com',
    password: '$2b$10$YGJNTnOzGLlCaCCXK3SOu.tfw4LFdfpuXfsv7tBjl3IBJtS7LP/Wu',
    role: 'staff',
    department: 'Network',
    isActive: true
  },
  {
    _id: 'user-user-1',
    name: 'John Adeyemi',
    email: 'john.adeyemi@company.com',
    password: '$2b$10$YGJNTnOzGLlCaCCXK3SOu.tfw4LFdfpuXfsv7tBjl3IBJtS7LP/Wu',
    role: 'user',
    department: 'Finance',
    isActive: true
  }
];

export const demoTickets = [
  {
    _id: 'ticket-2847',
    ticketNumber: 'INC-2847',
    type: 'Incident',
    title: 'Laptop screen flickering after Windows update',
    description: 'Dell XPS 15 display flickers after Windows update KB5034123.',
    category: 'Hardware',
    priority: 'High',
    status: 'In Progress',
    createdBy: demoUsers[3],
    assignedTo: demoUsers[1],
    sla: { firstResponseMet: true, resolutionDue: '2h remaining', target: '8h' },
    comments: [
      { _id: 'comment-1', message: 'My laptop screen started flickering after the Windows update.', author: demoUsers[3], authorRole: 'user', createdAt: '2026-05-10T09:14:00.000Z' },
      { _id: 'comment-2', message: 'Please bring it to IT Room 204 tomorrow between 9am and 12pm.', author: demoUsers[1], authorRole: 'staff', createdAt: '2026-05-11T10:12:00.000Z' }
    ],
    createdAt: '2026-05-10T09:14:00.000Z',
    updatedAt: '2026-05-11T10:12:00.000Z'
  },
  {
    _id: 'ticket-2831',
    ticketNumber: 'INC-2831',
    type: 'Incident',
    title: 'Cannot access shared drive on company network',
    description: 'Finance shared drive denies access after AD migration.',
    category: 'Network',
    priority: 'Critical',
    status: 'Open',
    createdBy: { _id: 'user-user-2', name: 'Emeka A.', email: 'emeka.a@company.com', department: 'Finance', role: 'user' },
    assignedTo: demoUsers[2],
    comments: [],
    createdAt: '2026-05-10T08:05:00.000Z',
    updatedAt: '2026-05-10T11:05:00.000Z'
  },
  {
    _id: 'ticket-2819',
    ticketNumber: 'INC-2819',
    type: 'Incident',
    title: 'Outlook not syncing emails since yesterday',
    description: 'Mailbox sync hangs on Outlook desktop client.',
    category: 'Email',
    priority: 'Medium',
    status: 'In Progress',
    createdBy: { _id: 'user-user-3', name: 'Funke O.', email: 'funke.o@company.com', department: 'HR', role: 'user' },
    assignedTo: { _id: 'user-staff-3', name: 'Amaka A.', email: 'amaka.a@company.com', role: 'staff' },
    comments: [],
    createdAt: '2026-05-09T12:30:00.000Z',
    updatedAt: '2026-05-10T15:00:00.000Z'
  },
  {
    _id: 'ticket-2804',
    ticketNumber: 'INC-2804',
    type: 'Incident',
    title: 'Password reset not working for portal login',
    description: 'Password reset link expires immediately.',
    category: 'Account Access',
    priority: 'Low',
    status: 'Open',
    createdBy: { _id: 'user-user-4', name: 'Kemi B.', email: 'kemi.b@company.com', department: 'Operations', role: 'user' },
    assignedTo: { _id: 'user-staff-4', name: 'Tunde J.', email: 'tunde.j@company.com', role: 'staff' },
    comments: [],
    createdAt: '2026-05-08T09:00:00.000Z',
    updatedAt: '2026-05-08T12:00:00.000Z'
  },
  {
    _id: 'ticket-2798',
    ticketNumber: 'INC-2798',
    type: 'Incident',
    title: 'Printer offline - Finance floor 3',
    description: 'HP LaserJet is offline for all Finance users.',
    category: 'Hardware',
    priority: 'Medium',
    status: 'Resolved',
    createdBy: { _id: 'user-user-5', name: 'Rita A.', email: 'rita.a@company.com', department: 'Finance', role: 'user' },
    assignedTo: demoUsers[1],
    comments: [],
    createdAt: '2026-05-07T09:00:00.000Z',
    updatedAt: '2026-05-07T16:00:00.000Z',
    resolvedAt: '2026-05-07T16:00:00.000Z'
  }
];

export const demoServiceRequests = [
  { _id: 'sr-0192', requestNumber: 'SR-0192', title: 'New laptop request - Dell XPS 15', requester: 'John Adeyemi', department: 'Finance', status: 'Pending', approvalStatus: 'Awaiting', dueDate: '2026-05-15', createdAt: '2026-05-11T10:00:00.000Z' },
  { _id: 'sr-0191', requestNumber: 'SR-0191', title: 'Software license - Adobe Creative Suite', requester: 'Sola Marcus', department: 'Marketing', status: 'In Progress', approvalStatus: 'Approved', dueDate: '2026-05-14', createdAt: '2026-05-10T11:30:00.000Z' },
  { _id: 'sr-0189', requestNumber: 'SR-0189', title: 'VPN access for remote work', requester: 'Chioma E.', department: 'HR', status: 'Open', approvalStatus: 'Approved', dueDate: '2026-05-13', createdAt: '2026-05-09T08:40:00.000Z' }
];

export const demoProblems = [
  { _id: 'prb-0015', problemNumber: 'PRB-0015', title: 'KB5034123 causes display flickering on Dell XPS laptops', rootCauseStatus: 'Under investigation', linkedIncidents: 4, priority: 'High', status: 'In Progress', owner: 'Sarah K.' },
  { _id: 'prb-0014', problemNumber: 'PRB-0014', title: 'Intermittent VPN disconnections company-wide', rootCauseStatus: 'Under investigation', linkedIncidents: 6, priority: 'High', status: 'In Progress', owner: 'Michael O.' },
  { _id: 'prb-0013', problemNumber: 'PRB-0013', title: 'Outlook sync failures on Exchange 2019', rootCauseStatus: 'Known error', linkedIncidents: 4, priority: 'Medium', status: 'Open', owner: 'Amaka A.' }
];

export const demoChanges = [
  { _id: 'chg-0041', changeNumber: 'CHG-0041', title: 'DB server migration to AWS RDS', type: 'Standard', risk: 'High', status: 'Pending', scheduledAt: '2026-05-14T23:00:00.000Z', requester: 'Emeka O.' },
  { _id: 'chg-0040', changeNumber: 'CHG-0040', title: 'VPN gateway firmware v3.8 upgrade', type: 'Standard', risk: 'Low', status: 'Pending', scheduledAt: '2026-05-15T22:00:00.000Z', requester: 'Sola A.' },
  { _id: 'chg-0039', changeNumber: 'CHG-0039', title: 'Office 365 tenant migration', type: 'Emergency', risk: 'Medium', status: 'Approved', scheduledAt: '2026-05-13T21:00:00.000Z', requester: 'IT Director' }
];

export const demoAssets = [
  { _id: 'asset-0441', assetTag: 'AST-0441', name: 'Dell XPS 15 (2024)', type: 'Laptop', assignedTo: 'John Adeyemi', status: 'In use', location: 'Floor 3 - Finance', purchasedAt: '2024-01-10', warrantyUntil: '2027-01-10' },
  { _id: 'asset-0440', assetTag: 'AST-0440', name: 'HP LaserJet Pro MFP', type: 'Printer', assignedTo: 'Finance Dept', status: 'Under repair', location: 'Floor 3 - Finance', purchasedAt: '2022-03-12', warrantyUntil: '2025-03-12' },
  { _id: 'asset-0432', assetTag: 'AST-0432', name: 'Cisco Catalyst 9300 Switch', type: 'Network', assignedTo: 'IT Dept', status: 'Active', location: 'Server Room B', purchasedAt: '2021-08-20', warrantyUntil: '2025-08-20' },
  { _id: 'asset-0415', assetTag: 'AST-0415', name: 'Adobe Creative Cloud (50 seats)', type: 'Software', assignedTo: 'All departments', status: 'Active', location: 'Cloud', purchasedAt: '2026-01-01', warrantyUntil: '2027-01-01' }
];

export const demoCatalogItems = [
  { _id: 'catalog-laptop', name: 'Laptop request', category: 'Hardware', description: 'Request a new or replacement laptop.', sla: '3-5 business days', approvalRequired: true, active: true },
  { _id: 'catalog-monitor', name: 'External monitor', category: 'Hardware', description: 'Request an additional monitor for your workstation.', sla: '2-3 business days', approvalRequired: true, active: true },
  { _id: 'catalog-vpn', name: 'VPN access', category: 'Network', description: 'Request remote access VPN credentials and configuration.', sla: '4 hours', approvalRequired: true, active: true },
  { _id: 'catalog-software', name: 'Software license', category: 'Software', description: 'Request a new or additional software license.', sla: '1-2 business days', approvalRequired: true, active: true }
];

export const demoKnowledgeArticles = [
  { _id: 'kb-001', title: 'How to reset your employee portal password', category: 'Account Access', content: 'Use the password reset page and follow the email link within 30 minutes.', tags: ['password', 'account'], views: 3241, rating: 4.8, published: true, createdBy: demoUsers[1] },
  { _id: 'kb-002', title: 'Connecting to company Wi-Fi or VPN', category: 'Network', content: 'Install the VPN client and sign in with your employee credentials.', tags: ['vpn', 'wifi'], views: 2814, rating: 4.7, published: true, createdBy: demoUsers[2] },
  { _id: 'kb-003', title: 'Fix screen flickering on Dell XPS', category: 'Hardware', content: 'Update display drivers or uninstall KB5034123 if flickering started after Windows Update.', tags: ['dell', 'display'], views: 1248, rating: 4.5, published: true, createdBy: demoUsers[1] }
];

export const demoAutomationRules = [
  { _id: 'rule-001', name: 'Auto-assign critical tickets to senior agents', description: 'Routes critical-priority tickets to senior agents.', trigger: 'Ticket created', conditions: ['Priority = Critical'], actions: ['Assign to Senior Agent', 'Notify IT Director'], active: true, executions: 142 },
  { _id: 'rule-002', name: 'SLA breach alert - 1 hour warning', description: 'Alerts assigned agent and team lead before SLA deadline.', trigger: 'SLA: 1h remaining', conditions: ['Status != Resolved'], actions: ['Email agent', 'Alert team lead'], active: true, executions: 89 },
  { _id: 'rule-003', name: 'Auto-close resolved tickets after 48 hours', description: 'Closes tickets with no requester reply after resolution.', trigger: '48h after resolved', conditions: ['No requester reply'], actions: ['Close ticket', 'Send CSAT survey'], active: true, executions: 318 }
];

export const isDemoDatabase = () => (
  !(process.env.MONGODB_URI || process.env.MONGO_URI) ||
  (process.env.MONGODB_URI || process.env.MONGO_URI) === 'your_mongodb_connection_string'
);

export const nextId = (prefix) => `${prefix}-${Date.now()}`;
