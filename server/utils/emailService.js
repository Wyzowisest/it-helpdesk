import { Resend } from 'resend';

let resend;

const getResend = () => {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
};

const getFromEmail = () => process.env.FROM_EMAIL || 'onboarding@resend.dev';
const getClientUrl = () => process.env.CLIENT_URL || 'http://localhost:5173';

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const sendEmail = async (options) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not configured. Skipping email send.');
    return null;
  }

  const result = await getResend().emails.send(options);

  if (result.error) {
    console.error('Resend email failed:', {
      name: result.error.name,
      message: result.error.message,
      statusCode: result.error.statusCode
    });
    throw new Error(result.error.message);
  }

  console.log(`Email sent to ${options.to}: ${result.data?.id || 'queued'}`);
  return result.data;
};

const shell = (subtitle, body) => `
  <div style="font-family:Segoe UI,sans-serif;max-width:560px;margin:0 auto;background:#f4f6fb;padding:32px;">
    <div style="background:#0F1B3D;border-radius:12px;padding:28px 32px;text-align:center;margin-bottom:24px;">
      <h1 style="color:#fff;font-size:22px;margin:0;">IT Support Center</h1>
      <p style="color:#94a3c8;font-size:13px;margin:6px 0 0;">${subtitle}</p>
    </div>
    <div style="background:#fff;border-radius:12px;padding:28px 32px;border:1px solid #e4e9f4;">
      ${body}
    </div>
  </div>
`;

export const sendVerificationEmail = async (user, token) => {
  const link = `${getClientUrl()}/verify-email?token=${token}`;
  const name = escapeHtml(user.name);

  await sendEmail({
    from: getFromEmail(),
    to: user.email,
    subject: 'Verify your IT Support Center account',
    html: shell('Verify your email address', `
      <p style="font-size:15px;color:#1a2340;">Hi <strong>${name}</strong>,</p>
      <p style="font-size:14px;color:#374151;line-height:1.6;">
        You've been invited to join the IT Support Center.
        Click the button below to verify your email and activate your account.
      </p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${link}" style="background:#2563EB;color:#fff;padding:12px 32px;border-radius:9px;font-size:14px;font-weight:700;text-decoration:none;display:inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="font-size:12px;color:#9ca3c8;text-align:center;">
        This link expires in 24 hours. If you didn't request this, ignore this email.
      </p>
      <hr style="border:none;border-top:1px solid #eef1f8;margin:20px 0;"/>
      <p style="font-size:12px;color:#9ca3c8;">
        Or copy this link into your browser:<br/>
        <a href="${link}" style="color:#2563EB;word-break:break-all;">${link}</a>
      </p>
    `)
  });
};

export const sendPasswordResetEmail = async (user, token) => {
  const link = `${getClientUrl()}/reset-password?token=${token}`;
  const name = escapeHtml(user.name);

  await sendEmail({
    from: getFromEmail(),
    to: user.email,
    subject: 'Reset your IT Support Center password',
    html: shell('Password reset request', `
      <p style="font-size:15px;color:#1a2340;">Hi <strong>${name}</strong>,</p>
      <p style="font-size:14px;color:#374151;line-height:1.6;">
        We received a request to reset your password.
        Click the button below to choose a new password.
      </p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${link}" style="background:#2563EB;color:#fff;padding:12px 32px;border-radius:9px;font-size:14px;font-weight:700;text-decoration:none;display:inline-block;">
          Reset Password
        </a>
      </div>
      <p style="font-size:12px;color:#9ca3c8;text-align:center;">
        This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
      </p>
    `)
  });
};

export const sendTicketConfirmation = async (user, ticket) => {
  const title = escapeHtml(ticket.title || ticket.subject);

  await sendEmail({
    from: getFromEmail(),
    to: user.email,
    subject: `[${ticket.ticketNumber}] Ticket received - ${title}`,
    html: shell('Ticket confirmation', `
      <p style="font-size:15px;color:#1a2340;">Hi <strong>${escapeHtml(user.name)}</strong>,</p>
      <p style="font-size:14px;color:#374151;">Your support ticket has been received and will be reviewed shortly.</p>
      <div style="background:#F4F8FF;border-radius:10px;padding:16px 20px;margin:20px 0;border-left:4px solid #2563EB;">
        <div style="font-size:12px;color:#9ca3c8;margin-bottom:4px;">Ticket number</div>
        <div style="font-size:18px;font-weight:700;color:#2563EB;">${escapeHtml(ticket.ticketNumber)}</div>
        <div style="font-size:14px;color:#1a2340;margin-top:8px;">${title}</div>
        <div style="margin-top:10px;">
          <span style="font-size:12px;color:#6b7fa8;">Priority: <strong>${escapeHtml(ticket.priority)}</strong></span>
          <span style="font-size:12px;color:#6b7fa8;margin-left:16px;">Category: <strong>${escapeHtml(ticket.category)}</strong></span>
        </div>
      </div>
      <div style="text-align:center;margin:24px 0;">
        <a href="${getClientUrl()}/tickets/${ticket._id}" style="background:#2563EB;color:#fff;padding:11px 28px;border-radius:9px;font-size:14px;font-weight:700;text-decoration:none;display:inline-block;">
          View Ticket
        </a>
      </div>
      <p style="font-size:12px;color:#9ca3c8;text-align:center;">
        You'll receive updates via email as your ticket progresses.
      </p>
    `)
  });
};

export const sendAgentAssignmentEmail = async (agent, ticket) => {
  await sendEmail({
    from: getFromEmail(),
    to: agent.email,
    subject: `[${ticket.ticketNumber}] New ticket assigned to you`,
    html: shell('New ticket assigned', `
      <p style="font-size:15px;color:#1a2340;">Hi <strong>${escapeHtml(agent.name)}</strong>,</p>
      <p style="font-size:14px;color:#374151;">A ticket has been assigned to you that requires your attention.</p>
      <div style="background:#FEF3C7;border-radius:10px;padding:16px 20px;margin:20px 0;border-left:4px solid #d97706;">
        <div style="font-size:18px;font-weight:700;color:#0F1B3D;">${escapeHtml(ticket.ticketNumber)}</div>
        <div style="font-size:14px;color:#374151;margin-top:6px;">${escapeHtml(ticket.title || ticket.subject)}</div>
        <div style="margin-top:10px;">
          <span style="font-size:12px;background:#FEF2F2;color:#dc2626;padding:3px 10px;border-radius:100px;font-weight:700;">
            ${escapeHtml(ticket.priority).toUpperCase()}
          </span>
        </div>
      </div>
      <div style="text-align:center;margin:24px 0;">
        <a href="${getClientUrl()}/incidents/${ticket._id}" style="background:#2563EB;color:#fff;padding:11px 28px;border-radius:9px;font-size:14px;font-weight:700;text-decoration:none;display:inline-block;">
          Open Ticket
        </a>
      </div>
    `)
  });
};

export const sendInviteEmail = async (invitee, token) => {
  const link = `${getClientUrl()}/accept-invite?token=${token}`;

  await sendEmail({
    from: getFromEmail(),
    to: invitee.email,
    subject: "You've been invited to IT Support Center",
    html: shell("You've been invited", `
      <p style="font-size:15px;color:#1a2340;">Hi <strong>${escapeHtml(invitee.name)}</strong>,</p>
      <p style="font-size:14px;color:#374151;line-height:1.6;">
        You've been invited to join the IT Support Center as a <strong>${escapeHtml(invitee.role)}</strong>.
        Click below to set your password and activate your account.
      </p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${link}" style="background:#2563EB;color:#fff;padding:12px 32px;border-radius:9px;font-size:14px;font-weight:700;text-decoration:none;display:inline-block;">
          Accept Invitation
        </a>
      </div>
      <p style="font-size:12px;color:#9ca3c8;text-align:center;">
        This invitation expires in 48 hours.
      </p>
    `)
  });
};
