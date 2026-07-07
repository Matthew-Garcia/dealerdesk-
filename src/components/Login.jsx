import { ROLES } from '../data.js';

const ROLE_BLURB = {
  Advisor: 'Create and manage repair orders, assign technicians, talk to customers.',
  Technician: 'View assigned repair orders and update job status.',
  Manager: 'Full access, including shop metrics and revenue.',
};

export default function Login({ onSelectRole }) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="brand" style={{ justifyContent: 'center', marginBottom: 4 }}>
          <span className="brand-mark">DealerDesk</span>
        </div>
        <div className="login-sub">Select a role to sign in</div>
        <div className="login-roles">
          {ROLES.map((role) => (
            <button key={role} className="login-role-btn" onClick={() => onSelectRole(role)}>
              <span className="login-role-name">{role}</span>
              <span className="login-role-blurb">{ROLE_BLURB[role]}</span>
            </button>
          ))}
        </div>
        <div className="login-note">
          Demo build — this is a simplified role picker, not real authentication.
          A production version would verify credentials against a backend.
        </div>
      </div>
    </div>
  );
}
