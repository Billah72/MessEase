import React from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  BarChart3, 
  Table, 
  Receipt, 
  DollarSign, 
  FileText 
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useMess } from '../../context/MessContext';
import { StatCard } from '../../components/common/StatCard';
import { formatBDT } from '../../services/calculations';

export const ManagerReportsPage: React.FC = () => {
  const { settings, memberSummaries, overallStats, expenses, bazarTrips } = useMess();

  const handleExportExcel = () => {
    const dataRows = memberSummaries.map((m, idx) => ({
      'SL': idx + 1,
      'Member Name': m.memberName,
      'Email': m.email,
      'Room': m.roomNo || 'N/A',
      'Total Deposited (BDT)': m.totalDeposited,
      'Total Meals': m.totalMealsCount,
      'Meal Cost (BDT)': m.mealCost,
      'Shared Utilities (BDT)': m.sharedFixedCost,
      'Total Expense (BDT)': m.totalCost,
      'Net Balance (BDT)': m.balance,
      'Status': m.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mess_Report');
    XLSX.writeFile(workbook, `${settings.messName}_Monthly_Audit_${settings.activeMonth}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(5, 150, 105);
    doc.text(settings.messName, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Monthly Final Audit Sheet • Month: ${settings.activeMonth} • Manager: Sakib Hasan`, 14, 26);
    doc.text(`Address: ${settings.address}`, 14, 31);

    doc.setFontSize(10);
    doc.setTextColor(30);
    doc.text(`Total Bazar: BDT ${overallStats.totalBazarCost} | Total Consumed Meals: ${overallStats.totalMealsConsumed} | Live Meal Rate: BDT ${overallStats.currentMealRate.toFixed(2)}`, 14, 40);
    doc.text(`Total Fund Inflow: BDT ${overallStats.totalFundDeposits} | Outflow: BDT ${overallStats.totalExpenses} | Treasury Balance: BDT ${overallStats.currentMessBalance}`, 14, 46);

    const tableBody = memberSummaries.map((m, idx) => [
      idx + 1,
      m.memberName,
      m.roomNo || '-',
      `BDT ${m.totalDeposited}`,
      m.totalMealsCount,
      `BDT ${m.mealCost}`,
      `BDT ${m.sharedFixedCost}`,
      `BDT ${m.totalCost}`,
      `${m.balance >= 0 ? '+' : ''}BDT ${m.balance}`,
      m.status
    ]);

    autoTable(doc, {
      startY: 52,
      head: [['#', 'Member', 'Room', 'Deposited', 'Meals', 'Meal Cost', 'Utilities', 'Total Cost', 'Balance', 'Status']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [5, 150, 105], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2.5 }
    });

    doc.save(`${settings.messName}_Audit_${settings.activeMonth}.pdf`);
  };

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileSpreadsheet size={28} color="var(--primary-600)" />
            <span>Monthly Audit Reports & Exports</span>
          </h1>
          <p className="page-subtitle">
            Export official monthly mess statements, member consumption sheets, and download PDF/Excel reports
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExportPDF} className="btn btn-primary btn-sm">
            <Download size={15} /> Download PDF Statement
          </button>
          <button onClick={handleExportExcel} className="btn btn-secondary btn-sm">
            <Download size={15} /> Export Excel / CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <StatCard
          label="Total Food Shopping"
          value={formatBDT(overallStats.totalBazarCost)}
          subtext="Monthly Bazar Purchases"
          icon={Receipt}
          color="emerald"
        />

        <StatCard
          label="Live Meal Rate"
          value={`৳${overallStats.currentMealRate.toFixed(2)}`}
          subtext="Per weighted meal"
          icon={BarChart3}
          color="amber"
        />

        <StatCard
          label="Total Member Dues"
          value={formatBDT(overallStats.totalDueAmount)}
          subtext="Payable to Manager"
          icon={DollarSign}
          color="red"
        />

        <StatCard
          label="Total Member Advances"
          value={formatBDT(overallStats.totalAdvanceAmount)}
          subtext="Excess deposits in fund"
          icon={DollarSign}
          color="blue"
        />
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Table size={18} color="var(--primary-600)" />
            <span>Member Audit Statement ({settings.activeMonth})</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table" style={{ fontSize: '0.825rem' }}>
            <thead>
              <tr>
                <th>SL</th>
                <th>Member Name</th>
                <th>Room</th>
                <th style={{ textAlign: 'right' }}>Total Deposited</th>
                <th style={{ textAlign: 'center' }}>Total Meals</th>
                <th style={{ textAlign: 'right' }}>Meal Cost (৳)</th>
                <th style={{ textAlign: 'right' }}>Shared Utility (৳)</th>
                <th style={{ textAlign: 'right' }}>Total Cost (৳)</th>
                <th style={{ textAlign: 'right' }}>Net Balance (৳)</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {memberSummaries.map((m, idx) => (
                <tr key={m.memberId}>
                  <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{m.memberName}</td>
                  <td>{m.roomNo || '-'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatBDT(m.totalDeposited)}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{m.totalMealsCount}</td>
                  <td style={{ textAlign: 'right' }}>{formatBDT(m.mealCost)}</td>
                  <td style={{ textAlign: 'right' }}>{formatBDT(m.sharedFixedCost)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatBDT(m.totalCost)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: m.balance >= 0 ? 'var(--primary-700)' : 'var(--danger-600)' }}>
                    {m.balance >= 0 ? `+${formatBDT(m.balance)}` : formatBDT(m.balance)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${m.status === 'ADVANCE' ? 'badge-success' : 'badge-danger'}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--slate-100)', fontWeight: 800 }}>
                <td colSpan={3} style={{ padding: '12px 14px' }}>MESS TOTALS</td>
                <td style={{ textAlign: 'right', color: 'var(--primary-800)' }}>{formatBDT(overallStats.totalFundDeposits)}</td>
                <td style={{ textAlign: 'center' }}>{overallStats.totalMealsConsumed}</td>
                <td style={{ textAlign: 'right' }}>{formatBDT(overallStats.totalBazarCost)}</td>
                <td style={{ textAlign: 'right' }}>{formatBDT(overallStats.totalUtilityCost)}</td>
                <td style={{ textAlign: 'right' }}>{formatBDT(overallStats.totalExpenses)}</td>
                <td style={{ textAlign: 'right', color: 'var(--primary-800)' }}>{formatBDT(overallStats.currentMessBalance)}</td>
                <td style={{ textAlign: 'center' }}>-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
