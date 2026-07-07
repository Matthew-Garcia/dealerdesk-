import { useEffect, useState } from 'react';
import Login from './components/Login.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import Tickets from './components/Tickets.jsx';
import Customers from './components/Customers.jsx';
import Vehicles from './components/Vehicles.jsx';
import Parts from './components/Parts.jsx';
import TicketModal from './components/TicketModal.jsx';
import { loadState, saveState, nextTicketId } from './data.js';

const ROLE_KEY = 'dealerdesk-role';

export default function App() {
  const [state, setState] = useState(loadState);
  const [role, setRole] = useState(() => sessionStorage.getItem(ROLE_KEY) || '');
  const [view, setView] = useState('dashboard');
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  function selectRole(r) {
    sessionStorage.setItem(ROLE_KEY, r);
    setRole(r);
  }

  function logout() {
    sessionStorage.removeItem(ROLE_KEY);
    setRole('');
    setView('dashboard');
  }

  if (!role) {
    return <Login onSelectRole={selectRole} />;
  }

  const { customers, vehicles, technicians, parts, tickets } = state;
  const openCount = tickets.filter((t) => t.status !== 'Completed').length;
  const activeTicket = tickets.find((t) => t.id === activeTicketId) || null;

  function addCustomer(customer) {
    const id = `c${Date.now()}`;
    setState((s) => ({ ...s, customers: [...s.customers, { id, ...customer }] }));
  }

  function addVehicle(vehicle) {
    const id = `v${Date.now()}`;
    setState((s) => ({ ...s, vehicles: [...s.vehicles, { id, ...vehicle }] }));
  }

  function addPart(part) {
    const id = `p${Date.now()}`;
    setState((s) => ({ ...s, parts: [...s.parts, { id, ...part }] }));
  }

  function saveTicket(data) {
    const now = new Date().toISOString();

    if (activeTicket) {
      setState((s) => ({
        ...s,
        tickets: s.tickets.map((t) => {
          if (t.id !== activeTicket.id) return t;
          const statusChanged = data.status !== t.status;
          const history = statusChanged ? [...t.history, { status: data.status, at: now }] : t.history;
          const completedAt = data.status === 'Completed'
            ? (t.completedAt || now.slice(0, 10))
            : (data.status !== 'Completed' ? null : t.completedAt);
          return { ...t, ...data, history, completedAt };
        }),
      }));
      setActiveTicketId(null);
    } else {
      const id = nextTicketId(tickets);
      const createdAt = now.slice(0, 10);
      const newTicket = {
        id,
        createdAt,
        completedAt: data.status === 'Completed' ? createdAt : null,
        history: [{ status: data.status, at: now }],
        ...data,
      };
      setState((s) => ({ ...s, tickets: [...s.tickets, newTicket] }));
      setShowNewTicket(false);
    }
  }

  function deleteTicket(id) {
    setState((s) => ({ ...s, tickets: s.tickets.filter((t) => t.id !== id) }));
    setActiveTicketId(null);
  }

  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} openCount={openCount} role={role} onLogout={logout} />
      <main className="main">
        {view === 'dashboard' && (
          <Dashboard
            tickets={tickets}
            customers={customers}
            vehicles={vehicles}
            technicians={technicians}
            role={role}
            onOpenTicket={setActiveTicketId}
          />
        )}
        {view === 'tickets' && (
          <Tickets
            tickets={tickets}
            customers={customers}
            vehicles={vehicles}
            technicians={technicians}
            onOpenTicket={setActiveTicketId}
            onNewTicket={() => setShowNewTicket(true)}
          />
        )}
        {view === 'customers' && (
          <Customers customers={customers} vehicles={vehicles} onAddCustomer={addCustomer} />
        )}
        {view === 'vehicles' && (
          <Vehicles vehicles={vehicles} customers={customers} tickets={tickets} onAddVehicle={addVehicle} />
        )}
        {view === 'parts' && (
          <Parts parts={parts} onAddPart={addPart} />
        )}
      </main>

      {(activeTicket || showNewTicket) && (
        <TicketModal
          ticket={activeTicket}
          customers={customers}
          vehicles={vehicles}
          technicians={technicians}
          parts={parts}
          role={role}
          onSave={saveTicket}
          onDelete={deleteTicket}
          onClose={() => { setActiveTicketId(null); setShowNewTicket(false); }}
        />
      )}
    </div>
  );
}
