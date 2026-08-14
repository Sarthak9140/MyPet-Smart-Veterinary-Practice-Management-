import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ConfirmModal } from '../components/ConfirmModal';
import api from '../services/api';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Edit2,
  Trash2,
  X,
  Minus,
  AlertCircle,
  Calendar,
  DollarSign
} from 'lucide-react';

export const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [stockStatus, setStockStatus] = useState(searchParams.get('stockStatus') || 'All');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Medicine',
    brand: '',
    description: '',
    quantity: 10,
    unit: 'Vials',
    minimumStock: 5,
    price: 0,
    supplier: '',
    expiryDate: '',
    batchNumber: ''
  });

  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/products?search=${search}&category=${category}&stockStatus=${stockStatus}`
      );
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, stockStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleStockAdjust = async (id, action) => {
    try {
      const res = await api.patch(`/products/${id}/stock`, { action, amount: 1 });
      if (res.data.success) {
        addToast(`Stock ${action}d successfully`);
        fetchProducts();
      }
    } catch (err) {
      addToast('Failed to update stock', 'error');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Medicine',
      brand: '',
      description: '',
      quantity: 10,
      unit: 'Vials',
      minimumStock: 5,
      price: 15.0,
      supplier: '',
      expiryDate: '',
      batchNumber: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || '',
      category: p.category || 'Medicine',
      brand: p.brand || '',
      description: p.description || '',
      quantity: p.quantity !== undefined ? p.quantity : 0,
      unit: p.unit || 'Vials',
      minimumStock: p.minimumStock !== undefined ? p.minimumStock : 5,
      price: p.price !== undefined ? p.price : 0,
      supplier: p.supplier || '',
      expiryDate: p.expiryDate ? p.expiryDate.split('T')[0] : '',
      batchNumber: p.batchNumber || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
        addToast('Product updated');
      } else {
        await api.post('/products', formData);
        addToast('Product added to inventory');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/products/${deleteId}`);
      addToast('Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete product', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Dynamic Dashboard Stats
  const totalProducts = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + p.quantity, 0);
  const lowStockCount = products.filter((p) => p.stockStatus === 'Low Stock').length;
  const outOfStockCount = products.filter((p) => p.stockStatus === 'Out of Stock').length;
  const expiringSoonCount = products.filter((p) => p.expiryStatus === 'Expiring Soon' || p.expiryStatus === 'Expired').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Product & Stock Inventory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track veterinary vaccines, medicines, stock levels, suppliers, and expiration warnings
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition shadow-md shadow-brand-600/20 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Inventory Product
        </button>
      </div>

      {/* Inventory Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Products</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Stock Units</p>
          <p className="text-2xl font-extrabold text-brand-600 mt-1">{totalStockUnits}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Low Stock Alert</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{lowStockCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Out of Stock</p>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">{outOfStockCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Expiring / Expired</p>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">{expiringSoonCount}</p>
        </div>
      </div>

      {/* Expiry Alert Banners */}
      {products.some((p) => p.expiryStatus === 'Expiring Soon' || p.expiryStatus === 'Expired') && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Expiration Warnings:
          </div>
          {products
            .filter((p) => p.expiryStatus === 'Expiring Soon' || p.expiryStatus === 'Expired')
            .map((p) => (
              <p key={p._id} className="pl-6 text-[11px]">
                ⚠️ <strong>{p.name}</strong> (Batch: {p.batchNumber || 'N/A'}) - {p.expiryStatus} ({new Date(p.expiryDate).toLocaleDateString()})
              </p>
            ))}
        </div>
      )}

      {/* Toolbar Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search product, brand, supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-semibold"
          >
            <option value="All">All Categories</option>
            <option value="Vaccine">Vaccine</option>
            <option value="Medicine">Medicine</option>
            <option value="Supplement">Supplement</option>
            <option value="Pet Care">Pet Care</option>
            <option value="Medical Supply">Medical Supply</option>
          </select>

          <select
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-semibold"
          >
            <option value="All">All Stock Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      {loading ? (
        <LoadingSkeleton count={5} height="h-16" />
      ) : products.length === 0 ? (
        <EmptyState
          title="No Products in Inventory"
          description="No veterinary products match your filters. Add products to manage stock and supplier orders."
          actionText="Add Product"
          onAction={openAddModal}
          icon={Package}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category & Brand</th>
                  <th className="px-6 py-4">Quantity / Unit</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Expiry Date</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 text-xs">{p.name}</p>
                      <p className="text-[10px] text-slate-400">Supplier: {p.supplier || 'N/A'}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{p.category}</p>
                      <p className="text-[10px] text-slate-400">{p.brand || 'Generic'}</p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStockAdjust(p._id, 'decrease')}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                          title="Decrease Stock"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-extrabold text-slate-900 text-xs px-1">
                          {p.quantity} {p.unit}
                        </span>
                        <button
                          onClick={() => handleStockAdjust(p._id, 'increase')}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                          title="Increase Stock"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">Min Stock: {p.minimumStock}</p>
                    </td>

                    <td className="px-6 py-4 font-extrabold text-slate-900">
                      ₹{p.price?.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      {p.expiryDate ? (
                        <div>
                          <p className="font-semibold text-slate-800">
                            {new Date(p.expiryDate).toLocaleDateString()}
                          </p>
                          {p.expiryStatus !== 'Valid' && (
                            <span className="text-[10px] font-bold text-amber-700">
                              ({p.expiryStatus})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">N/A</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                          p.stockStatus === 'Out of Stock'
                            ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-300'
                            : p.stockStatus === 'Low Stock'
                            ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                            : 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300'
                        }`}
                      >
                        {p.stockStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(p._id)}
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-extrabold text-slate-900 mb-6">
              {editingProduct ? 'Edit Inventory Item' : 'Add Inventory Product'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Rabies Vaccine 10ml"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  >
                    <option value="Vaccine">Vaccine</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Supplement">Supplement</option>
                    <option value="Pet Care">Pet Care</option>
                    <option value="Medical Supply">Medical Supply</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="Vials, Bottles, Boxes..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Stock Alert Level</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minimumStock}
                    onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand / Manufacturer</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Zoetis"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Supplier / Batch No</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="e.g. Merck Health"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition shadow-md shadow-brand-600/20"
                >
                  {editingProduct ? 'Save Changes' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteProduct}
        title="Delete Product?"
        message="Are you sure you want to remove this product from inventory?"
        loading={deleteLoading}
      />
    </div>
  );
};
