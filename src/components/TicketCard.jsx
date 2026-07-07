import { ticketTotal } from '../data.js';

const STAMP_CLASS = {
  Open: 'open',
  'In Progress': 'progress',
  'Waiting on Parts': 'waiting',
  Completed: 'done',
};

export default function TicketCard({ ticket, customer, vehicle, technician, onClick }) {
  return (
    <div className="ticket" onClick={onClick}>
      <div className="ticket-top">
        <div>
          <div className="ticket-id">{ticket.id} · {ticket.createdAt}</div>
          <div className="ticket-customer">{customer?.name ?? 'Unknown customer'}</div>
          <div className="ticket-vehicle">
            {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'No vehicle on file'}
          </div>
        </div>
        <span className={`stamp ${STAMP_CLASS[ticket.status]}`}>{ticket.status}</span>
      </div>
      <div className="ticket-complaint">{ticket.complaint}</div>
      <div className="ticket-meta-row">
        <span>{technician ? technician.name : 'Unassigned'}</span>
        {ticket.estimatedHours ? <span>{ticket.estimatedHours} hr est.</span> : null}
      </div>
      <div className="ticket-foot">
        <span>{ticket.lines.length} line item{ticket.lines.length === 1 ? '' : 's'}</span>
        <span className="ticket-total">${ticketTotal(ticket).toLocaleString()}</span>
      </div>
    </div>
  );
}
