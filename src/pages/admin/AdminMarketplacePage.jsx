import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import {
  getAdminBuyers,
  getAdminProduceLots,
  updateBuyerStatus,
  updateProduceStatus,
  deleteProduceLot,
} from '../../services/adminService';

export default function AdminMarketplacePage() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('buyers'); // 'buyers' | 'produce'

  // Buyers state
  const [buyers, setBuyers] = useState([]);
  const [buyersTotal, setBuyersTotal] = useState(0);
  const [buyersPage, setBuyersPage] = useState(1);
  const [buyersLimit] = useState(10);
  const [buyersQuery, setBuyersQuery] = useState('');

  // Produce lots state
  const [produce, setProduce] = useState([]);
  const [produceTotal, setProduceTotal] = useState(0);
  const [producePage, setProducePage] = useState(1);
  const [produceLimit] = useState(10);
  const [produceQuery, setProduceQuery] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isDestructive: false,
  });

  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === 'buyers') {
        const res = getAdminBuyers({
          search: buyersQuery,
          page: buyersPage,
          limit: buyersLimit,
        });
        setBuyers(res.data);
        setBuyersTotal(res.total);
      } else {
        const res = getAdminProduceLots({
          search: produceQuery,
          page: producePage,
          limit: produceLimit,
        });
        setProduce(res.data);
        setProduceTotal(res.total);
      }
    } catch (err) {
      console.error('Error fetching marketplace data:', err);
      setError(err.message || 'Unable to load marketplace data.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, buyersQuery, buyersPage, buyersLimit, produceQuery, producePage, produceLimit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleBuyerVerify = (buyer) => {
    const nextV = !buyer.verified;
    updateBuyerStatus(buyer.id, buyer.status, nextV);
    loadData();
  };

  const handleToggleBuyerStatus = (buyer) => {
    const nextS = buyer.status === 'suspended' ? 'active' : 'suspended';
    setConfirmModal({
      isOpen: true,
      title: `${nextS === 'suspended' ? 'Suspend' : 'Activate'} Buyer`,
      message: `Set "${buyer.businessName}" to ${nextS}?`,
      isDestructive: nextS === 'suspended',
      onConfirm: () => {
        updateBuyerStatus(buyer.id, nextS);
        setConfirmModal({ isOpen: false });
        loadData();
      },
    });
  };

  const handleToggleProduceStatus = (lot) => {
    const nextS = lot.status === 'hidden' ? 'active' : 'hidden';
    setConfirmModal({
      isOpen: true,
      title: `${nextS === 'hidden' ? 'Hide' : 'Activate'} Produce Lot`,
      message: `Set produce lot "${lot.crop}" (${lot.id}) to ${nextS}?`,
      isDestructive: nextS === 'hidden',
      onConfirm: () => {
        updateProduceStatus(lot.id, nextS);
        setConfirmModal({ isOpen: false });
        loadData();
      },
    });
  };

  const handleDeleteProduce = (lot) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Produce Lot',
      message: `Are you sure you want to permanently delete harvest lot "${lot.crop}"? This action cannot be undone.`,
      isDestructive: true,
      onConfirm: () => {
        deleteProduceLot(lot.id);
        setConfirmModal({ isOpen: false });
        loadData();
      },
    });
  };

  const buyerColumns = [
    {
      header: 'Business Name',
      key: 'name',
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <span className="material-symbols-outlined text-lg">storefront</span>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-on-surface truncate max-w-[200px]">{b.businessName}</div>
            <div className="text-[11px] text-on-surface-variant truncate">{b.contactPerson} · {b.buyerType}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Purchased Crops',
      key: 'crops',
      render: (b) => (
        <span className="text-xs text-on-surface font-medium truncate max-w-[150px] block">
          {(b.cropsPurchased || ['Wheat', 'Rice']).join(', ')}
        </span>
      ),
    },
    {
      header: 'Current Requirement',
      key: 'requirement',
      render: (b) => (
        <span className="text-xs text-primary font-semibold truncate max-w-[200px] block">
          {b.currentRequirement || 'Bulk Sourcing'}
        </span>
      ),
    },
    {
      header: 'Location',
      key: 'location',
      render: (b) => (
        <span className="text-xs text-on-surface-variant truncate max-w-[140px] block">
          {b.locationEn}
        </span>
      ),
    },
    {
      header: 'Verified',
      key: 'verified',
      render: (b) => (
        <button
          type="button"
          onClick={() => handleToggleBuyerVerify(b)}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer border ${
            b.verified
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60 hover:bg-emerald-100'
              : 'bg-surface-container text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[13px]">
            {b.verified ? 'verified' : 'radio_button_unchecked'}
          </span>
          {b.verified ? 'Verified' : 'Unverified'}
        </button>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (b) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => handleToggleBuyerStatus(b)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              b.status === 'suspended' ? 'text-primary hover:bg-surface-container' : 'text-amber-700 hover:bg-amber-50'
            }`}
            title={b.status === 'suspended' ? 'Activate Buyer' : 'Suspend Buyer'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {b.status === 'suspended' ? 'check_circle' : 'block'}
            </span>
          </button>
        </div>
      ),
    },
  ];

  const produceColumns = [
    {
      header: 'Crop & Lot',
      key: 'crop',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 text-xl">
            {p.imageEmoji || '🌾'}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-on-surface truncate">{p.crop} ({p.variety || 'Grade A'})</div>
            <div className="text-[11px] text-on-surface-variant font-mono truncate">{p.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Farmer Seller',
      key: 'farmer',
      render: (p) => (
        <div className="text-xs">
          <span className="font-bold text-on-surface block">{p.farmerName}</span>
          <span className="text-[11px] text-on-surface-variant">{p.farmerPhone}</span>
        </div>
      ),
    },
    {
      header: 'Quantity',
      key: 'qty',
      render: (p) => (
        <span className="text-xs font-bold text-on-surface">
          {p.quantity || `${p.quantityNum || 100} Qtl`}
        </span>
      ),
    },
    {
      header: 'Price / Rate',
      key: 'price',
      render: (p) => (
        <span className="text-xs font-bold text-primary">
          {p.priceFormatted || `₹${p.pricePerQuintal || 2400} / Qtl`}
        </span>
      ),
    },
    {
      header: 'Location',
      key: 'location',
      render: (p) => (
        <span className="text-xs text-on-surface-variant truncate max-w-[140px] block">
          {p.location || 'Meerut, UP'}
        </span>
      ),
    },
    {
      header: 'Quality Grade',
      key: 'grade',
      render: (p) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface">
          {p.qualityGrade || 'Grade A'}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (p) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
            p.status === 'hidden'
              ? 'bg-surface-container text-on-surface border-outline-variant/40'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
          }`}
        >
          {p.status === 'hidden' ? 'Hidden' : 'Active'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => handleToggleProduceStatus(p)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              p.status === 'hidden' ? 'text-primary hover:bg-surface-container' : 'text-amber-700 hover:bg-amber-50'
            }`}
            title={p.status === 'hidden' ? 'Show Lot' : 'Hide Lot'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {p.status === 'hidden' ? 'visibility' : 'visibility_off'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleDeleteProduce(p)}
            className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors cursor-pointer"
            title="Delete Lot"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Best Buyers & Produce Marketplace"
      subtitle="Supervise farmer harvest lots, wholesale buyers, mandi agents, and buying tenders."
      lang={lang}
      setLang={setLang}
    >
      {/* Tab Switcher Pills matching Farmer Helper pill filter */}
      <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant/40 shadow-xs w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('buyers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'buyers'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          Wholesale Buyers & Mandi Traders ({buyersTotal})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('produce')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'produce'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          Farmer Produce Listings ({produceTotal})
        </button>
      </div>

      {activeTab === 'buyers' ? (
        <AdminTable
          columns={buyerColumns}
          data={buyers}
          keyField="id"
          isLoading={isLoading}
          error={error}
          onRetry={loadData}
          emptyMessage="No wholesale buyers found."
          searchQuery={buyersQuery}
          onSearchChange={(q) => {
            setBuyersQuery(q);
            setBuyersPage(1);
          }}
          searchPlaceholder="Search buyer by business name, crop, location..."
          pagination={{
            page: buyersPage,
            totalPages: Math.ceil(buyersTotal / buyersLimit) || 1,
            total: buyersTotal,
            limit: buyersLimit,
            onPageChange: (p) => setBuyersPage(p),
          }}
        />
      ) : (
        <AdminTable
          columns={produceColumns}
          data={produce}
          keyField="id"
          isLoading={isLoading}
          error={error}
          onRetry={loadData}
          emptyMessage="No farm produce lots found."
          searchQuery={produceQuery}
          onSearchChange={(q) => {
            setProduceQuery(q);
            setProducePage(1);
          }}
          searchPlaceholder="Search produce lots by crop, farmer, variety..."
          pagination={{
            page: producePage,
            totalPages: Math.ceil(produceTotal / produceLimit) || 1,
            total: produceTotal,
            limit: produceLimit,
            onPageChange: (p) => setProducePage(p),
          }}
        />
      )}

      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false })}
      />
    </AdminLayout>
  );
}
