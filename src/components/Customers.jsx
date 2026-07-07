import { useState } from 'react';

export default function Customers({ customers, vehicles, onAddCustomer }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  function handleSubmit() {
    if (!name.trim()) return;
    onAddCustomer({ name: name.trim(), phone: phone.trim(), email: email.trim() });
    setName(''); setPhone(''); setEmail(''); setShowForm(false);
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Customers</div>
          <div className="page-sub">{customers.length} on file</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add Customer'}
        </button>
      </div>

      {showForm && (
        <div className="stat-card" style={{ marginBottom: 20 }}>
          <div className="field-row">
            <div className="field">
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="555-555-5555" />
            </div>
          </div>
          <div className="field">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
          </div>
          <button className="btn btn-primary" onClick={handleSubmit}>Save Customer</button>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Vehicles</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td className="mono">{c.phone}</td>
              <td>{c.email}</td>
              <td>{vehicles.filter((v) => v.customerId === c.id).length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
