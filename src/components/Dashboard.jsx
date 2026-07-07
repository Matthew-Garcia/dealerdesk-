import { ticketTotal, avgRepairHours, revenueToday, carsInShop } from '../data.js';
import TicketCard from './TicketCard.jsx';

export default function Dashboard({ tickets, customers, vehicles, technicians, role, onOpenTicket }) {
  const open = tickets.filter((t) => t.status === 'Open').length;
  const inShop = carsInShop(tickets);
  const avgHours = avgRepairHours(tickets);
  const todayRevenue = revenueToday(tickets);
  const completedRevenue = tickets
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => sum + ticketTotal(t), 0);

  const recent = [...tickets]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4);

  const showRevenue = role !== 'Technician';

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Shop floor overview — {tickets.length} total repair orders on file</div>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-label">Cars in Shop</div>
          <div className="stat-value signal">{inShop}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Open (Unassigned Work)</div>
          <div className="stat-value stop">{open}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Repair Time</div>
          <div className="stat-value">{avgHours ? `${avgHours.toFixed(1)} hr` : '—'}</div>
        </div>
        {showRevenue && (
          <div className="stat-card">
            <div className="stat-label">Revenue Today</div>
            <div className="stat-value go">${todayRevenue.toLocaleString()}</div>
          </div>
        )}
      </div>

      {showRevenue && (
        <div className="page-sub" style={{ marginBottom: 20 }}>
          Total completed revenue on file: <strong style={{ color: 'var(--text)' }}>${completedRevenue.toLocaleString()}</strong>
        </div>
      )}

      <div className="page-sub" style={{ marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11 }}>
        Recent Activity
      </div>
      <div className="ticket-grid">
        {recent.map((t) => (
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
    </div>
  );
}
