import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ConfirmModal } from '../components/ConfirmModal';
import api from '../services/api';
import {
  Syringe,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  X,
  Calendar,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export const VaccinationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);

  // Search, Filter, Sort States
  const [search, setSearch] = useState('');
  const [petType, setPetType] = useState('All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [sort, setSort] = useState('next_soonest');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVac, setEditingVac] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    petId: searchParams.get('petId') || '',
    vaccineName: '',
    vaccineType: 'Core Vaccine',
    vaccinationDate: new Date().toISOString().split('T')[0],
    nextVaccinationDate: '',
    dose: '1st Dose',
    batchNumber: '',
    notes: ''
  });

  const { addToast } = useToast();

  const fetchVaccinations = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/vaccinations?search=${search}&petType=${petType}&status=${status}&sort=${sort}`
      );
      if (res.data.success) {
        setVaccinations(res.data.data);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load vaccination schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      const res = await api.get('/pets');
      if (res.data.success) {
        setPets(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVaccinations();
    fetchPets();
    if (searchParams.get('action') === 'add') {
      openAddModal();
    }
  }, [petType, status, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchVaccinations();
  };

  const clearFilters = () => {
    setSearch('');
    setPetType('All');
    setStatus('All');
    setSort('next_soonest');
  };

  const openAddModal = () => {
    setEditingVac(null);
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    setFormData({
      petId: searchParams.get('petId') || (pets.length > 0 ? pets[0]._id : ''),
      vaccineName: 'Rabies Vaccine',
      vaccineType: 'Core Vaccine',
      vaccinationDate: today.toISOString().split('T')[0],
      nextVaccinationDate: nextYear.toISOString().split('T')[0],
      dose: 'Annual Booster',
      batchNumber: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingVac(record);
    setFormData({
      petId: record.petId?._id || '',
      vaccineName: record.vaccineName || '',
      vaccineType: record.vaccineType || 'Core Vaccine',
      vaccinationDate: record.vaccinationDate ? record.vaccinationDate.split('T')[0] : '',
      nextVaccinationDate: record.nextVaccinationDate ? record.nextVaccinationDate.split('T')[0] : '',
      dose: record.dose || '',
      batchNumber: record.batchNumber || '',
      notes: record.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveVaccination = async (e) => {
    e.preventDefault();
    try {
      if (editingVac) {
        await api.put(`/vaccinations/${editingVac._id}`, formData);
        addToast('Vaccination record updated');
      } else {
        await api.post('/vaccinations', formData);
        addToast('Vaccination record added');
      }
      setIsModalOpen(false);
      fetchVaccinations();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save vaccination record', 'error');
    }
  };

  const handleDeleteVaccination = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/vaccinations/${deleteId}`);
      addToast('Vaccination record deleted');
      setDeleteId(null);
      fetchVaccinations();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete record', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vaccination Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track vaccination schedules, record doses, and manage automated upcoming/overdue reminders
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition shadow-md shadow-brand-600/20 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Vaccination Record
        </button>
      </div>

      {/* Advanced Search, Filters & Sorting Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid md:grid-cols-12 gap-3 items-center">
          {/* Global Search */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pet, owner, phone, vaccine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition"
            />
          </form>

          {/* Status Filter */}
          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-semibold text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Overdue">Overdue</option>
              <option value="Due Today">Due Today</option>
              <option value="Due Soon">Due Soon</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-semibold text-slate-700"
            >
              <option value="next_soonest">Next Date: Soonest First</option>
              <option value="next_latest">Next Date: Latest First</option>
              <option value="pet_asc">Pet Name (A → Z)</option>
              <option value="pet_desc">Pet Name (Z → A)</option>
              <option value="vaccine_latest">Last Vaccine (Latest)</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="md:col-span-2 flex justify-end">
            <button
              onClick={clearFilters}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Vaccination Schedule Table */}
      {loading ? (
        <LoadingSkeleton count={5} height="h-16" />
      ) : vaccinations.length === 0 ? (
        <EmptyState
          title="No Vaccination Records Found"
          description="No vaccination records match your search or filter criteria. Add a record to start automated reminder tracking."
          actionText="Add Vaccination Record"
          onAction={openAddModal}
          icon={Syringe}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Pet Patient</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Vaccine & Dose</th>
                  <th className="px-6 py-4">Given Date</th>
                  <th className="px-6 py-4">Next Vaccination</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {vaccinations.map((vac) => (
                  <tr key={vac._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                          {vac.petId?.petName?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{vac.petId?.petName || 'Unknown Pet'}</p>
                          <p className="text-[10px] text-slate-400">{vac.petId?.breed || 'Mixed'} ({vac.petId?.petType})</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{vac.ownerId?.name || 'N/A'}</p>
                      <p className="text-slate-500 text-[10px]">{vac.ownerId?.phone}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{vac.vaccineName}</p>
                      <p className="text-[10px] text-slate-500">{vac.dose} • Batch: {vac.batchNumber || 'N/A'}</p>
                    </td>

                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {new Date(vac.vaccinationDate).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-900">
                      {new Date(vac.nextVaccinationDate).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                          vac.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-300'
                            : vac.status === 'Due Today'
                            ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                            : vac.status === 'Due Soon'
                            ? 'bg-brand-100 text-brand-800 ring-1 ring-brand-300'
                            : 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300'
                        }`}
                      >
                        {vac.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(vac)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(vac._id)}
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

      {/* Add / Edit Vaccination Modal */}
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
              {editingVac ? 'Edit Vaccination Record' : 'Add Vaccination Record'}
            </h2>

            <form onSubmit={handleSaveVaccination} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient Pet *</label>
                <select
                  value={formData.petId}
                  onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-semibold text-slate-900"
                >
                  <option value="">-- Choose Pet --</option>
                  {pets.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.petName} ({p.breed} • Owner: {p.ownerId?.name || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vaccine Name *</label>
                  <input
                    type="text"
                    value={formData.vaccineName}
                    onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                    required
                    placeholder="e.g. Rabies Vaccine"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vaccine Type</label>
                  <input
                    type="text"
                    value={formData.vaccineType}
                    onChange={(e) => setFormData({ ...formData, vaccineType: e.target.value })}
                    placeholder="e.g. Core Vaccine"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vaccination Date *</label>
                  <input
                    type="date"
                    value={formData.vaccinationDate}
                    onChange={(e) => setFormData({ ...formData, vaccinationDate: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Next Vaccination Date *</label>
                  <input
                    type="date"
                    value={formData.nextVaccinationDate}
                    onChange={(e) => setFormData({ ...formData, nextVaccinationDate: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-bold text-brand-700"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dose</label>
                  <input
                    type="text"
                    value={formData.dose}
                    onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                    placeholder="e.g. Annual Booster"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    placeholder="e.g. RB-2026-90"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Notes</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Record observations, reactions, or next checkup instructions..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                />
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
                  {editingVac ? 'Save Changes' : 'Record Vaccination'}
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
        onConfirm={handleDeleteVaccination}
        title="Delete Vaccination Record?"
        message="Are you sure you want to delete this vaccination record from the schedule?"
        loading={deleteLoading}
      />
    </div>
  );
};
