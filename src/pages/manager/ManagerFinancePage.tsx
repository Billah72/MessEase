import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Trash2, 
  Search, 
  DollarSign, 
  CheckCircle2, 
  Flame, 
  Wifi, 
  Zap, 
  Sparkles 
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { Transaction, Expense, PaymentMethod, ExpenseCategory } from '../../types';
import { Modal } from '../../components/common/Modal';
import { StatCard } from '../../components/common/StatCard';
import { formatBDT } from '../../services/calculations';

export const ManagerFinancePage: React.FC = () => {
  const { 
    transactions, 
    expenses, 
    addTransaction, 
    deleteTransaction, 
    addExpense, 
    deleteExpense, 
    users, 
    overallStats 
  } = useMess();

  const [activeTab, setActiveTab] = useState<'DEPOSITS' | 'EXPENSES'>('DEPOSITS');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Form states - Deposit
  const members = users.filter(u => u.role === 'MEMBER');
  const [depMemberId, setDepMemberId] = useState(members[0]?.id || '');
  const [depAmount, setDepAmount] = useState<number>(5000);
  const [depDate, setDepDate] = useState('2026-09-12');
  const [depMethod, setDepMethod] = useState<PaymentMethod>('bKash');
  const [depTrxId, setDepTrxId] = useState('');
  const [depDesc, setDepDesc] = useState('September Mess Deposit');

  // Form states - Expense
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('GAS_CYLINDER');
  const [expAmount, setExpAmount] = useState<number>(1450);
  const [expDate, setExpDate] = useState('2026-09-12');
  const [expDesc, setExpDesc] = useState('Beximco LPG Gas Cylinder 12KG');

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const m = users.find(u => u.id === depMemberId);
    addTransaction({
      date: depDate,
      type: 'DEPOSIT',
      category: 'MEMBER_DEPOSIT',
      memberId: depMemberId,
      memberName: m?.name || 'Member',
      amount: Number(depAmount),
      paymentMethod: depMethod,
      trxId: depTrxId || undefined,
      description: depDesc,
      recordedBy: 'Sakib Hasan (Manager)',
      status: 'VERIFIED'
    });
    setShowDepositModal(false);
    setDepTrxId('');
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      date: expDate,
      category: expCategory,
      amount: Number(expAmount),
      description: expDesc,
      paidByName: 'Sakib Hasan (Manager)'
    });
    setShowExpenseModal(false);
    setExpDesc('');
  };

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Wallet size={28} color="var(--primary-600)" />
            <span>Mess Treasury & Finance Control</span>
          </h1>
          <p className="page-subtitle">
            Record member deposit collections, utility bills (Gas, Maid, WiFi), and manage cash flow
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowDepositModal(true)}
            className="btn btn-primary"
          >
            <Plus size={16} /> Record Member Payment
          </button>
          <button 
            onClick={() => setShowExpenseModal(true)}
            className="btn btn-secondary"
          >
            <Plus size={16} /> Add Utility Bill
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <StatCard
          label="Current Treasury Balance"
          value={formatBDT(overallStats.currentMessBalance)}
          subtext="Net liquidity in fund"
          icon={Wallet}
          color="emerald"
          badgeText="Active Fund"
          badgeType="success"
        />

        <StatCard
          label="Total Collected Deposits"
          value={formatBDT(overallStats.totalFundDeposits)}
          subtext={`${transactions.filter(t => t.type === 'DEPOSIT').length} Verified Member Payments`}
          icon={ArrowDownLeft}
          color="blue"
        />

        <StatCard
          label="Total Outflow Expenses"
          value={formatBDT(overallStats.totalExpenses)}
          subtext={`Bazar: ${formatBDT(overallStats.totalBazarCost)} | Utility: ${formatBDT(overallStats.totalUtilityCost)}`}
          icon={ArrowUpRight}
          color="red"
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('DEPOSITS')}
          className={`btn btn-sm ${activeTab === 'DEPOSITS' ? 'btn-primary' : 'btn-outline'}`}
        >
          💳 Member Payments ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('EXPENSES')}
          className={`btn btn-sm ${activeTab === 'EXPENSES' ? 'btn-primary' : 'btn-outline'}`}
        >
          ⚡ Shared Utility Bills ({expenses.length})
        </button>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: '16px', padding: '12px 16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input 
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {activeTab === 'DEPOSITS' ? (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Member Name</th>
                <th>Method</th>
                <th>Trx ID</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter(t => t.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) || t.description.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{tx.memberName}</div>
                    </td>
                    <td>
                      <span className={`badge ${
                        tx.paymentMethod === 'bKash' ? 'badge-purple' :
                        tx.paymentMethod === 'Nagad' ? 'badge-warning' :
                        tx.paymentMethod === 'Rocket' ? 'badge-info' : 'badge-slate'
                      }`}>
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{tx.trxId || 'CASH_VOUCHER'}</td>
                    <td style={{ fontSize: '0.825rem' }}>{tx.description}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: 'var(--primary-700)' }}>
                      {formatBDT(tx.amount)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          if (confirm(`Delete payment of ৳${tx.amount} from ${tx.memberName}?`)) deleteTransaction(tx.id);
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--danger-500)', padding: '4px 8px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses
                .filter(e => e.description.toLowerCase().includes(searchTerm.toLowerCase()) || e.category.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(exp => (
                  <tr key={exp.id}>
                    <td>{exp.date}</td>
                    <td>
                      <span className="badge badge-slate">{exp.category.replace('_', ' ')}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{exp.description}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: 'var(--danger-600)' }}>
                      {formatBDT(exp.amount)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          if (confirm(`Delete expense of ৳${exp.amount}?`)) deleteExpense(exp.id);
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--danger-500)', padding: '4px 8px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Record Member Deposit */}
      <Modal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        title="Record Member Payment Deposit"
        subtitle="Credit funds to member ledger and mess treasury"
      >
        <form onSubmit={handleDepositSubmit}>
          <div className="form-group">
            <label className="form-label">Select Member</label>
            <select
              value={depMemberId}
              onChange={(e) => setDepMemberId(e.target.value)}
              className="form-control"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.roomNo})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Deposit Amount (৳)</label>
              <input 
                type="number"
                required
                min="100"
                step="50"
                value={depAmount}
                onChange={(e) => setDepAmount(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deposit Date</label>
              <input 
                type="date"
                required
                value={depDate}
                onChange={(e) => setDepDate(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                value={depMethod}
                onChange={(e) => setDepMethod(e.target.value as PaymentMethod)}
                className="form-control"
              >
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
                <option value="Cash">Cash in Hand</option>
                <option value="Bank">Bank Transfer</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Trx ID / Slip (Optional)</label>
              <input 
                type="text"
                placeholder="BK991209"
                value={depTrxId}
                onChange={(e) => setDepTrxId(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description Note</label>
            <input 
              type="text"
              value={depDesc}
              onChange={(e) => setDepDesc(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="modal-footer" style={{ padding: '16px 0 0 0', background: 'transparent' }}>
            <button type="button" onClick={() => setShowDepositModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} /> Credit Deposit (৳{depAmount})
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Utility Expense */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Add Shared Utility Bill"
        subtitle="Record expenses like Gas, Maid salary, WiFi, or Repairs"
      >
        <form onSubmit={handleExpenseSubmit}>
          <div className="form-group">
            <label className="form-label">Expense Category</label>
            <select
              value={expCategory}
              onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
              className="form-control"
            >
              <option value="GAS_CYLINDER">LPG Gas Cylinder</option>
              <option value="MAID_SALARY">Cook / Maid Auntie (Khala) Salary</option>
              <option value="INTERNET">WiFi Internet Broadband</option>
              <option value="ELECTRICITY">Electricity Bill</option>
              <option value="WATER">Water / WASA</option>
              <option value="CLEANING">Cleaning & Waste Disposal</option>
              <option value="MAINTENANCE">Plumbing & Maintenance</option>
              <option value="MISC">Miscellaneous</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Amount (৳)</label>
              <input 
                type="number"
                required
                min="10"
                value={expAmount}
                onChange={(e) => setExpAmount(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input 
                type="date"
                required
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Bill Details</label>
            <input 
              type="text"
              required
              placeholder="e.g. Dot Internet 35Mbps bill"
              value={expDesc}
              onChange={(e) => setExpDesc(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="modal-footer" style={{ padding: '16px 0 0 0', background: 'transparent' }}>
            <button type="button" onClick={() => setShowExpenseModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} /> Record Expense (৳{expAmount})
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
