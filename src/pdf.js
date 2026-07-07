import { jsPDF } from 'jspdf';
import { ticketTotal } from './data.js';

export function downloadTicketPdf(ticket, customer, vehicle, technician) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const left = 48;
  let y = 56;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('DealerDesk', left, y);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Repair Order', 540, y, { align: 'right' });

  y += 10;
  doc.setDrawColor(180);
  doc.line(left, y, 564, y);

  y += 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(ticket.id, left, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Opened: ${ticket.createdAt}`, 540, y, { align: 'right' });

  y += 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Customer', left, y);
  doc.text('Vehicle', 320, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(customer?.name ?? 'Unknown customer', left, y);
  doc.text(vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'No vehicle on file', 320, y);
  y += 14;
  doc.text(customer?.phone ?? '', left, y);
  doc.text(vehicle ? `VIN: ${vehicle.vin}` : '', 320, y);
  y += 14;
  doc.text(customer?.email ?? '', left, y);
  doc.text(vehicle ? `${vehicle.mileage.toLocaleString()} mi` : '', 320, y);

  y += 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Status', left, y);
  doc.text('Technician', 320, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(ticket.status, left, y);
  doc.text(technician?.name ?? 'Unassigned', 320, y);
  if (ticket.estimatedHours) {
    y += 14;
    doc.text(`Est. labor: ${ticket.estimatedHours} hr`, left, y);
  }

  y += 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Customer Concern', left, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const complaintLines = doc.splitTextToSize(ticket.complaint || '-', 516);
  doc.text(complaintLines, left, y);
  y += complaintLines.length * 13 + 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Parts & Labor', left, y);
  y += 10;
  doc.setDrawColor(180);
  doc.line(left, y, 564, y);
  y += 16;

  doc.setFontSize(9.5);
  doc.text('Description', left, y);
  doc.text('Qty', 380, y, { align: 'right' });
  doc.text('Price', 460, y, { align: 'right' });
  doc.text('Total', 564, y, { align: 'right' });
  y += 6;
  doc.line(left, y, 564, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  if (!ticket.lines.length) {
    doc.text('No line items recorded.', left, y);
    y += 14;
  } else {
    ticket.lines.forEach((l) => {
      const descLines = doc.splitTextToSize(l.desc, 300);
      doc.text(descLines, left, y);
      doc.text(String(l.qty), 380, y, { align: 'right' });
      doc.text(`$${l.price.toFixed(2)}`, 460, y, { align: 'right' });
      doc.text(`$${(l.qty * l.price).toFixed(2)}`, 564, y, { align: 'right' });
      y += Math.max(descLines.length, 1) * 13 + 4;
    });
  }

  y += 8;
  doc.line(left, y, 564, y);
  y += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total', 460, y, { align: 'right' });
  doc.text(`$${ticketTotal(ticket).toFixed(2)}`, 564, y, { align: 'right' });

  if (ticket.history?.length) {
    y += 34;
    doc.setFontSize(11);
    doc.text('Status Timeline', left, y);
    y += 16;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    ticket.history.forEach((h) => {
      doc.text(`${h.status} — ${new Date(h.at).toLocaleString()}`, left, y);
      y += 13;
    });
  }

  doc.save(`${ticket.id}.pdf`);
}
