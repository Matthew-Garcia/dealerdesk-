import { useState, Fragment } from 'react';
import { decodeVin, ticketTotal } from '../data.js';
import VinScanner from './VinScanner.jsx';

export default function Vehicles({ vehicles, customers, tickets, onAddVehicle }) {
  const [showForm, setShowForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? '');
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [vin, setVin] = useState('');
  const [mileage, setMileage] = useState('');
  const [decodeStatus, setDecodeStatus] = useState('');

  async function handleDecode(vinToDecode) {
    const v = (vinToDecode ?? vin).trim();
    if (v.length !== 17) {
      setDecodeStatus('VIN must be 17 characters.');
      return;
    }
    setDecodeStatus('Decoding…');
    try {
      const result = await decodeVin(v);
      if (!result.valid) {
        setDecodeStatus(result.errorText || 'No match found for that VIN.');
        return;
      }
      setYear(result.year);
      setMake(result.make);
      setModel(result.model);
      setDecodeStatus(`Decoded: ${result.year} ${result.make} ${result.model}`);
    } catch (e) {
      setDecodeStatus('VIN lookup failed — check your connection and try again.');
    }
  }

  function handleScanDetected(scannedVin) {
    setVin(scannedVin);
    setShowScanner(false);
    if (scannedVin.length === 17) handleDecode(scannedVin);
  }

  function handleSubmit() {
    if (!make.trim() || !model.trim()) return;
    onAddVehicle({
      customerId,
      year: year.trim(),
      make: make.trim(),
      model: model.trim(),
      vin: vin.trim(),
      mileage: Number(mileage) || 0,
    });
    setYear(''); setMake(''); setModel(''); setVin(''); setMileage(''); setDecodeStatus(''); setShowForm(false);
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Vehicles</div>
          <div className="page-sub">{vehicles.length} on file</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add Vehicle'}
        </button>
      </div>

      {showForm && (
        <div className="stat-card" style={{ marginBottom: 20 }}>
          <div className="field">
            <label>Owner</label>
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="field">
            <label>VIN</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="17-character VIN"
                style={{ flex: 1 }}
              />
              <button className="btn" type="button" onClick={() => handleDecode()}>Decode VIN</button>
              <button className="btn" type="button" onClick={() => setShowScanner(true)}>Scan</button>
            </div>
            {decodeStatus && <div className="decode-status">{decodeStatus}</div>}
          </div>

          <div className="field-row">
            <div className="field">
              <label>Year</label>
              <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2022" />
            </div>
            <div className="field">
              <label>Mileage</label>
              <input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} placeholder="42000" />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Make</label>
              <input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Toyota" />
            </div>
            <div className="field">
              <label>Model</label>
              <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Camry" />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleSubmit}>Save Vehicle</button>
        </div>
      )}

      {showScanner && (
        <VinScanner onDetected={handleScanDetected} onClose={() => setShowScanner(false)} />
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Owner</th>
            <th>VIN</th>
            <th>Mileage</th>
            <th>History</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => {
            const history = tickets.filter((t) => t.vehicleId === v.id);
            const isOpen = expandedId === v.id;
            return (
              <Fragment key={v.id}>
                <tr onClick={() => setExpandedId(isOpen ? null : v.id)} style={{ cursor: 'pointer' }}>
                  <td>{v.year} {v.make} {v.model}</td>
                  <td>{customers.find((c) => c.id === v.customerId)?.name ?? '—'}</td>
                  <td className="mono">{v.vin}</td>
                  <td>{v.mileage.toLocaleString()} mi</td>
                  <td>{history.length} order{history.length === 1 ? '' : 's'} {isOpen ? '▲' : '▼'}</td>
                </tr>
                {isOpen && (
                  <tr>
                    <td colSpan={5} style={{ background: 'var(--ink)', padding: '10px 16px' }}>
                      {history.length === 0 ? (
                        <span className="page-sub">No repair orders yet for this vehicle.</span>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {history.map((t) => (
                            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                              <span className="mono">{t.id}</span>
                              <span style={{ flex: 1, margin: '0 12px', color: 'var(--text-dim)' }}>{t.complaint}</span>
                              <span>{t.status}</span>
                              <span className="mono" style={{ marginLeft: 12 }}>${ticketTotal(t).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

