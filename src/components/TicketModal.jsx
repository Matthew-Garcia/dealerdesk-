import { useState } from 'react';
import { STATUSES } from '../data.js';
import { downloadTicketPdf } from '../pdf.js';

const emptyLine = () => ({ desc: '', qty: 1, price: 0, partId: '' });

export default function TicketModal({ ticket, customers, vehicles, technicians, parts, role, onSave, onDelete, onClose }) {
  const isNew = !ticket;
  const [customerId, setCustomerId] = useState(ticket?.customerId ?? customers[0]?.id ?? '');
  const [vehicleId, setVehicleId] = useState(ticket?.vehicleId ?? '');
  const [technicianId, setTechnicianId] = useState(ticket?.technicianId ?? '');
  const [estimatedHours, setEstimatedHours] = useState(ticket?.estimatedHours ?? '');
  const [complaint, setComplaint] = useState(ticket?.complaint ?? '');
  const [status, setStatus] = useState(ticket?.status ?? 'Open');
  const [lines, setLines] = useState(ticket?.lines?.length ? [...ticket.lines] : [emptyLine()]);

  const vehiclesForCustomer = vehicles.filter((v) => v.customerId === customerId);
  const customer = customers.find((c) => c.id === customerId);
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  const technician = technicians.find((t) => t.id === technicianId);
  const canDelete = role !== 'Technician';

  function updateLine(idx, field, value) {
    setLines((prev) => {
      const next = [...prev];
      if (field === 'partId') {
        const part = parts.find((p) => p.id === value);
        next[idx] = {
          ...next[idx],
          partId: value,
          desc: part ? part.name : next[idx].desc,
          price: part ? part.unitCost : next[idx].price,
        };
      } else {
        next[idx] = { ...next[idx], [field]: field === 'desc' ? value : Number(value) };
      }
      return next;
    });
  }

  function addLine() {
    setLines((prev) => [...prev, emptyLine()]);
  }

  function removeLine(idx) {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSave() {
    if (!complaint.trim()) return;
    const cleanLines = lines.filter((l) => l.desc.trim());
    onSave({
      customerId,
      vehicleId,
      technicianId: technicianId || null,
      estimatedHours: estimatedHours === '' ? null : Number(estimatedHours),
      complaint: complaint.trim(),
      status,
      lines: cleanLines,
    });
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{isNew ? 'New Service Ticket' : `Edit ${ticket.id}`}</div>

        <div className="field-row">
          <div className="field">
            <label>Customer</label>
            <select value={customerId} onChange={(e) => { setCustomerId(e.target.value); setVehicleId(''); }}>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Vehicle</label>
            <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
              <option value="">Select vehicle</option>
              {vehiclesForCustomer.map((v) => (
                <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Assigned Technician</label>
            <select value={technicianId} onChange={(e) => setTechnicianId(e.target.value)}>
              <option value="">Unassigned</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>{t.name} — {t.specialty}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Est. Labor Hours</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="e.g. 2.5"
            />
          </div>
        </div>

        <div className="field">
          <label>Customer Concern</label>
          <textarea
            rows={3}
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            placeholder="Describe the reported issue..."
          />
        </div>

        <div className="field">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Line Items (parts &amp; labor)</label>
          {lines.map((line, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <div className="line-item-row">
                <select value={line.partId || ''} onChange={(e) => updateLine(idx, 'partId', e.target.value)}>
                  <option value="">Custom line / labor</option>
                  {parts.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (${p.unitCost})</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={line.qty}
                  onChange={(e) => updateLine(idx, 'qty', e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  value={line.price}
                  onChange={(e) => updateLine(idx, 'price', e.target.value)}
                />
                <button className="remove-line" onClick={() => removeLine(idx)} title="Remove line">×</button>
              </div>
              <input
                placeholder="Description"
                value={line.desc}
                onChange={(e) => updateLine(idx, 'desc', e.target.value)}
                style={{ width: '100%', background: 'var(--ink)', border: '1px solid var(--steel-light)', borderRadius: 3, padding: '7px 9px', fontSize: 13 }}
              />
            </div>
          ))}
          <button className="btn btn-ghost" style={{ paddingLeft: 0 }} onClick={addLine}>+ Add line item</button>
        </div>

        {!isNew && ticket.history?.length > 0 && (
          <div className="field">
            <label>Status Timeline</label>
            <div className="timeline">
              {ticket.history.map((h, i) => (
                <div key={i} className="timeline-row">
                  <span className="timeline-status">{h.status}</span>
                  <span className="timeline-time">{new Date(h.at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-actions">
          {!isNew && (
            <button
              className="btn"
              onClick={() => downloadTicketPdf(ticket, customer, vehicle, technician)}
              style={{ marginRight: 'auto' }}
            >
              Download PDF
            </button>
          )}
          {!isNew && canDelete && (
            <button className="btn" style={{ color: 'var(--stop)' }} onClick={() => onDelete(ticket.id)}>
              Delete
            </button>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Ticket</button>
        </div>
      </div>
    </div>
  );
}
