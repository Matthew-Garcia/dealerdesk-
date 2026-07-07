const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'tickets', label: 'Service Tickets' },
  { key: 'customers', label: 'Customers' },
  { key: 'vehicles', label: 'Vehicles' },
  { key: 'parts', label: 'Parts Inventory' },
];

export default function Sidebar({ view, setView, openCount, role, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">DealerDesk</span>
      </div>
      <span className="brand-sub" style={{ marginTop: -22, paddingLeft: 6 }}>Service Desk</span>

      <div className="role-badge">
        Signed in as <strong>{role}</strong>
      </div>

      <nav className="nav" style={{ marginTop: 4 }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-item${view === item.key ? ' active' : ''}`}
            onClick={() => setView(item.key)}
          >
            {item.label}
            {item.key === 'tickets' && openCount > 0 && (
              <span className="count">{openCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <button className="btn btn-ghost" style={{ padding: '6px 0' }} onClick={onLogout}>
          Switch role / sign out
        </button>
        <div style={{ marginTop: 8 }}>
          Local demo build. Data persists in this browser only.
        </div>
      </div>
    </aside>
  );
}
