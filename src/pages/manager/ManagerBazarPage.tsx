import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Search, 
  Store, 
  DollarSign, 
  Calendar, 
  CheckCircle2 
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { BazarItem } from '../../types';
import { Modal } from '../../components/common/Modal';
import { StatCard } from '../../components/common/StatCard';
import { formatBDT } from '../../services/calculations';

export const ManagerBazarPage: React.FC = () => {
  const { bazarTrips, addBazarTrip, deleteBazarTrip, users, overallStats } = useMess();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formDate, setFormDate] = useState('2026-09-12');
  const [formShopperId, setFormShopperId] = useState(users.find(u => u.role === 'MEMBER')?.id || users[0].id);
  const [formStore, setFormStore] = useState('Dhanmondi Krishi Market');
  const [formNotes, setFormNotes] = useState('');
  const [formItems, setFormItems] = useState<Array<Omit<BazarItem, 'id'>>>([
    { name: '', quantity: 1, unit: 'kg', unitPrice: 0, totalPrice: 0, category: 'VEGETABLES' }
  ]);

  const handleAddItemRow = () => {
    setFormItems(prev => [
      ...prev,
      { name: '', quantity: 1, unit: 'kg', unitPrice: 0, totalPrice: 0, category: 'VEGETABLES' }
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (formItems.length === 1) return;
    setFormItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof Omit<BazarItem, 'id'>, value: any) => {
    setFormItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        const qty = field === 'quantity' ? Number(value) : item.quantity;
        const price = field === 'unitPrice' ? Number(value) : item.unitPrice;
        item.totalPrice = Math.round(qty * price);
      }
      updated[index] = item;
      return updated;
    });
  };

  const grandTotal = formItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  const handleSubmitBazar = (e: React.FormEvent) => {
    e.preventDefault();
    const shopper = users.find(u => u.id === formShopperId);
    const validItems: BazarItem[] = formItems
      .filter(it => it.name.trim().length > 0)
      .map((it, idx) => ({ ...it, id: `bitem-${Date.now()}-${idx}` }));

    if (validItems.length === 0) {
      alert('Please enter at least one grocery item.');
      return;
    }

    addBazarTrip({
      date: formDate,
      shopperMemberId: formShopperId,
      shopperName: shopper?.name || 'Shopper',
      storeName: formStore,
      items: validItems,
      totalAmount: grandTotal,
      notes: formNotes
    });

    setShowAddModal(false);
    setFormItems([{ name: '', quantity: 1, unit: 'kg', unitPrice: 0, totalPrice: 0, category: 'VEGETABLES' }]);
  };

  const filteredTrips = bazarTrips.filter(trip => 
    trip.shopperName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ShoppingBag size={28} color="var(--primary-600)" />
            <span>Manager Bazar Log & Groceries</span>
          </h1>
          <p className="page-subtitle">
            Log grocery shopping trips, itemized prices, and store vouchers
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} /> Record Bazar Shopping Trip
        </button>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <StatCard
          label="Total Food Shopping"
          value={formatBDT(overallStats.totalBazarCost)}
          subtext="September Month Shopping"
          icon={ShoppingBag}
          color="emerald"
        />

        <StatCard
          label="Total Shopping Trips"
          value={`${bazarTrips.length} Trips`}
          subtext="Logged in system"
          icon={Store}
          color="blue"
        />

        <StatCard
          label="Current Live Meal Rate"
          value={`৳${overallStats.currentMealRate.toFixed(2)}`}
          subtext="Bazar / Consumed Meals"
          icon={DollarSign}
          color="amber"
        />
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: '20px', padding: '14px 18px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input 
            type="text"
            placeholder="Search bazar by product (Rice, Beef, Oil...), shopper, or market..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Trips list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredTrips.map(trip => (
          <div key={trip.id} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--primary-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  🛍️
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--slate-900)' }}>
                    {trip.storeName}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', marginTop: '2px' }}>
                    <span>📅 {trip.date}</span>
                    <span>👤 Shopper: <strong>{trip.shopperName}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Cost</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                    {formatBDT(trip.totalAmount)}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Delete bazar trip of ৳${trip.totalAmount}?`)) deleteBazarTrip(trip.id);
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ color: 'var(--danger-500)' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Items Table */}
            <div className="table-responsive" style={{ background: 'var(--slate-50)' }}>
              <table className="custom-table" style={{ fontSize: '0.825rem' }}>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'center' }}>Quantity</th>
                    <th style={{ textAlign: 'right' }}>Unit Price</th>
                    <th style={{ textAlign: 'right' }}>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {trip.items.map((it, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{it.name}</td>
                      <td>
                        <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                          {it.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>{it.quantity} {it.unit}</td>
                      <td style={{ textAlign: 'right' }}>{formatBDT(it.unitPrice)}/{it.unit}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--slate-900)' }}>
                        {formatBDT(it.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {trip.notes && (
              <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                💬 {trip.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Add Bazar Trip */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Record New Bazar Trip"
        subtitle="Itemized grocery shopping entry"
        maxWidth="680px"
      >
        <form onSubmit={handleSubmitBazar}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Purchase Date</label>
              <input 
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Shopper (Duty Member)</label>
              <select
                value={formShopperId}
                onChange={(e) => setFormShopperId(e.target.value)}
                className="form-control"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.roomNo})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Market / Store Name</label>
            <input 
              type="text"
              required
              placeholder="e.g. Dhanmondi 15 Krishi Market"
              value={formStore}
              onChange={(e) => setFormStore(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Itemized Table */}
          <div style={{ margin: '16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Purchased Grocery Items</span>
              <button 
                type="button"
                onClick={handleAddItemRow}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={14} /> Add Row
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formItems.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    alignItems: 'center',
                    background: 'var(--slate-50)',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <input 
                    type="text"
                    placeholder="Item (e.g. Rice, Beef)"
                    value={item.name}
                    onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    className="form-control"
                    style={{ flex: '2 1 140px', minWidth: '130px', padding: '7px 10px', fontSize: '0.85rem' }}
                    required
                  />

                  <select
                    value={item.category}
                    onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                    className="form-control"
                    style={{ flex: '1 1 100px', minWidth: '95px', padding: '7px 8px', fontSize: '0.8rem' }}
                  >
                    <option value="VEGETABLES">Vegetables</option>
                    <option value="MEAT_FISH">Meat/Fish</option>
                    <option value="GROCERY_OIL">Grocery/Oil</option>
                    <option value="SPICES">Spices</option>
                    <option value="DAIRY_EGG">Egg/Dairy</option>
                    <option value="MISC">Misc</option>
                  </select>

                  <div style={{ display: 'flex', gap: '4px', flex: '1 1 110px' }}>
                    <input 
                      type="number"
                      step="any"
                      min="0.1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="form-control"
                      style={{ padding: '7px 8px', fontSize: '0.85rem', width: '55px' }}
                      required
                    />
                    <select
                      value={item.unit}
                      onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                      className="form-control"
                      style={{ padding: '7px 4px', fontSize: '0.8rem' }}
                    >
                      <option value="kg">kg</option>
                      <option value="liter">ltr</option>
                      <option value="dozen">dz</option>
                      <option value="piece">pc</option>
                      <option value="packet">pkt</option>
                      <option value="bundle">bdl</option>
                    </select>
                  </div>

                  <input 
                    type="number"
                    placeholder="Unit Price ৳"
                    value={item.unitPrice || ''}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    className="form-control"
                    style={{ flex: '1 1 90px', minWidth: '85px', padding: '7px 8px', fontSize: '0.85rem' }}
                    required
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginLeft: 'auto', minWidth: '100px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-700)' }}>
                      ৳{item.totalPrice.toLocaleString()}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItemRow(idx)}
                      disabled={formItems.length === 1}
                      className="btn btn-secondary btn-icon-only"
                      style={{ width: '30px', height: '30px', padding: 0 }}
                    >
                      <Trash2 size={14} color="var(--danger-500)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <span style={{ fontWeight: 700, color: 'var(--primary-900)' }}>Calculated Total Bazar:</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-700)' }}>
              ৳{grandTotal.toLocaleString()}
            </span>
          </div>

          <div className="modal-footer" style={{ padding: '16px 0 0 0', background: 'transparent' }}>
            <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} /> Save Bazar Trip (৳{grandTotal})
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
