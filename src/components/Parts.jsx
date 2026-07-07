import { useState } from 'react';

export default function Parts({ parts, onAddPart }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [qty, setQty] = useState('');
  const [unitCost, setUnitCost] = useState('');

  function handleSubmit() {
    if (!name.trim() || !sku.trim()) return;
    onAddPart({ name: name.trim(), sku: sku.trim().toUpperCase(), qty: Number(qty) || 0, unitCost: Number(unitCost) || 0 });
    setName(''); setSku(''); setQty(''); setUnitCost(''); setShowForm(false);
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Parts Inventory</div>
          <div className="page-sub">{parts.length} SKUs on the shelf</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add Part'}
        </button>
      </div>

      {showForm && (
        <div className="stat-card" style={{ marginBottom: 20 }}>
          <div className="field-row">
            <div className="field">
              <label>Part Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ignition Coil Pack" />
            </div>
            <div className="field">
              <label>SKU</label>
              <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="IGN-COIL-04" />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Qty in Stock</label>
              <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="10" />
            </div>
            <div className="field">
              <label>Unit Cost ($)</label>
              <input type="number" step="0.01" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} placeholder="64.00" />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleSubmit}>Save Part</button>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Part</th>
            <th>Qty in Stock</th>
            <th>Unit Cost</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((p) => (
            <tr key={p.id}>
              <td className="mono">{p.sku}</td>
              <td>{p.name}</td>
              <td style={{ color: p.qty <= 3 ? 'var(--stop)' : 'inherit' }}>
                {p.qty} {p.qty <= 3 && '· low stock'}
              </td>
              <td className="mono">${p.unitCost.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
