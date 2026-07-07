import { useState } from 'react';
import { STATUSES } from '../data.js';
import TicketCard from './TicketCard.jsx';

export default function Tickets({ tickets, customers, vehicles, technicians, onOpenTicket, onNewTicket }) {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();

  const matches = (t) => {
    if (!q) return true;
    const customer = customers.find((c) => c.id === t.customerId);
    const vehicle = vehicles.find((v) => v.id === t.vehicleId);
    return (
      t.id.toLowerCase().includes(q) ||
      vehicle?.vin?.toLowerCase().includes(q) ||
      customer?.name?.toLowerCase().includes(q)
    );
  };

  const filtered = tickets.filter((t) => (filter === 'All' || t.status === filter) && matches(t));
  const sorted = [...filtered].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Service Tickets</div>
          <div className="page-sub">Repair orders across all bays</div>
        </div>
        <button className="btn btn-primary" onClick={onNewTicket}>+ New Ticket</button>
      </div>

      <input
        className="search-input"
        placeholder="Search by RO number, VIN, or customer name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, marginTop: 14 }}>
        {['All', ...STATUSES].map((s) => (
          <button
            key={s}
            className="btn btn-ghost"
            style={{
              borderBottom: filter === s ? '2px solid var(--signal)' : '2px solid transparent',
              borderRadius: 0,
              color: filter === s ? 'var(--text)' : 'var(--text-dim)',
              paddingBottom: 6,
            }}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">No tickets match this search/filter.</div>
      ) : (
        <div className="ticket-grid">
          {sorted.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              customer={customers.find((c) => c.id === t.customerId)}
              vehicle={vehicles.find((v) => v.id === t.vehicleId)}
              technician={technicians.find((tech) => tech.id === t.technicianId)}
              onClick={() => onOpenTicket(t.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
