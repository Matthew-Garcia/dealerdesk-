const STORAGE_KEY = 'dealerdesk-service-desk-v2';

export const STATUSES = ['Open', 'In Progress', 'Waiting on Parts', 'Completed'];
export const ROLES = ['Advisor', 'Technician', 'Manager'];

const today = () => new Date().toISOString().slice(0, 10);

const seed = {
  customers: [
    { id: 'c1', name: 'Renee Castillo', phone: '281-555-0142', email: 'renee.castillo@email.com' },
    { id: 'c2', name: 'David Oyelaran', phone: '832-555-0198', email: 'd.oyelaran@email.com' },
    { id: 'c3', name: 'Marisol Vega', phone: '713-555-0117', email: 'marisol.vega@email.com' },
  ],
  vehicles: [
    { id: 'v1', customerId: 'c1', year: '2019', make: 'Toyota', model: 'Camry', vin: '4T1BF1FK7KU123456', mileage: 78200 },
    { id: 'v2', customerId: 'c2', year: '2021', make: 'Ford', model: 'F-150', vin: '1FTFW1E8XMFA65432', mileage: 41300 },
    { id: 'v3', customerId: 'c3', year: '2017', make: 'Honda', model: 'Civic', vin: '2HGFC2F59HH512309', mileage: 102450 },
  ],
  technicians: [
    { id: 't1', name: 'Marcus Webb', specialty: 'Electrical / Diagnostics' },
    { id: 't2', name: 'Priya Nair', specialty: 'Engine / Drivetrain' },
    { id: 't3', name: 'Jordan Reyes', specialty: 'General Service' },
  ],
  parts: [
    { id: 'p1', sku: 'IGN-COIL-04', name: 'Ignition Coil Pack', qty: 14, unitCost: 64 },
    { id: 'p2', sku: 'TMB-KIT-01', name: 'Timing Belt + Water Pump Kit', qty: 4, unitCost: 410 },
    { id: 'p3', sku: 'SPK-PLG-04', name: 'Spark Plug (each)', qty: 40, unitCost: 14 },
    { id: 'p4', sku: 'BRK-PAD-FR', name: 'Front Brake Pad Set', qty: 8, unitCost: 89 },
    { id: 'p5', sku: 'FUSE-80A', name: '80A Power Steering Fuse', qty: 22, unitCost: 9 },
  ],
  tickets: [
    {
      id: 'RO-10231',
      customerId: 'c1',
      vehicleId: 'v1',
      technicianId: 't1',
      complaint: 'Intermittent loss of communication with BCM. Customer reports dash warning lights flicker on rough roads.',
      status: 'In Progress',
      estimatedHours: 3,
      createdAt: '2026-07-01',
      completedAt: null,
      lines: [
        { desc: 'Diagnostic - CAN bus scope analysis', qty: 1, price: 145 },
        { desc: 'Repair chafed harness section', qty: 1, price: 220 },
      ],
      history: [
        { status: 'Open', at: '2026-07-01T08:10:00' },
        { status: 'In Progress', at: '2026-07-02T09:00:00' },
      ],
    },
    {
      id: 'RO-10232',
      customerId: 'c2',
      vehicleId: 'v2',
      technicianId: 't2',
      complaint: 'Check engine light on. Customer says truck idles rough cold.',
      status: 'Waiting on Parts',
      estimatedHours: 2,
      createdAt: '2026-07-03',
      completedAt: null,
      lines: [
        { desc: 'OBD-II diagnostic scan', qty: 1, price: 89 },
        { desc: 'Ignition coil pack (x2)', qty: 2, price: 64 },
      ],
      history: [
        { status: 'Open', at: '2026-07-03T10:05:00' },
        { status: 'Waiting on Parts', at: '2026-07-03T14:20:00' },
      ],
    },
    {
      id: 'RO-10233',
      customerId: 'c3',
      vehicleId: 'v3',
      technicianId: 't3',
      complaint: 'Routine 100k mile service - timing belt, water pump, spark plugs.',
      status: 'Completed',
      estimatedHours: 4,
      createdAt: '2026-06-28',
      completedAt: '2026-06-29',
      lines: [
        { desc: 'Timing belt + water pump kit', qty: 1, price: 410 },
        { desc: 'Spark plugs (x4)', qty: 4, price: 14 },
        { desc: 'Labor - 100k service', qty: 1, price: 260 },
      ],
      history: [
        { status: 'Open', at: '2026-06-28T08:00:00' },
        { status: 'In Progress', at: '2026-06-28T09:30:00' },
        { status: 'Completed', at: '2026-06-29T16:45:00' },
      ],
    },
    {
      id: 'RO-10234',
      customerId: 'c1',
      vehicleId: 'v1',
      technicianId: null,
      complaint: 'Squealing noise on braking, front end.',
      status: 'Open',
      estimatedHours: 1.5,
      createdAt: today(),
      completedAt: null,
      lines: [],
      history: [{ status: 'Open', at: `${today()}T08:00:00` }],
    },
  ],
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read local storage, using seed data', e);
  }
  return seed;
}

export function loadState() {
  return load();
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not persist state', e);
  }
}

export function nextTicketId(tickets) {
  const nums = tickets
    .map((t) => parseInt(t.id.replace('RO-', ''), 10))
    .filter((n) => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 10230) + 1;
  return `RO-${next}`;
}

export function ticketTotal(ticket) {
  return ticket.lines.reduce((sum, l) => sum + l.qty * l.price, 0);
}

// Average time from createdAt to completedAt, in hours, across completed tickets.
export function avgRepairHours(tickets) {
  const done = tickets.filter((t) => t.status === 'Completed' && t.completedAt);
  if (!done.length) return null;
  const totalHours = done.reduce((sum, t) => {
    const start = new Date(t.createdAt).getTime();
    const end = new Date(t.completedAt).getTime();
    return sum + Math.max(0, (end - start) / (1000 * 60 * 60));
  }, 0);
  return totalHours / done.length;
}

export function revenueToday(tickets) {
  const t = today();
  return tickets
    .filter((tk) => tk.status === 'Completed' && tk.completedAt === t)
    .reduce((sum, tk) => sum + ticketTotal(tk), 0);
}

export function carsInShop(tickets) {
  return tickets.filter((t) => t.status !== 'Completed').length;
}

// NHTSA vPIC free public API - no key required.
export async function decodeVin(vin) {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${encodeURIComponent(vin)}?format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('VIN decode request failed');
  const data = await res.json();
  const r = data?.Results?.[0];
  if (!r) throw new Error('No VIN data returned');
  return {
    year: r.ModelYear || '',
    make: r.Make || '',
    model: r.Model || '',
    valid: !!(r.Make && r.Model),
    errorText: r.ErrorText && r.ErrorText.startsWith('0') ? '' : r.ErrorText,
  };
}
