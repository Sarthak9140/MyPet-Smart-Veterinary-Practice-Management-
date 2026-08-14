import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ConfirmModal } from '../components/ConfirmModal';
import api from '../services/api';
import {
  Dog,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Phone,
  User,
  X,
  Filter
} from 'lucide-react';

export const PetsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [petType, setPetType] = useState('All');
  const [owners, setOwners] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    petName: '',
    petType: 'Dog',
    breed: '',
    gender: 'Male',
    dateOfBirth: '',
    weight: '',
    color: '',
    petId: '',
    medicalNotes: '',
    ownerId: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    ownerAddress: ''
  });

  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/pets?search=${search}&petType=${petType}`);
      if (res.data.success) {
        setPets(res.data.data);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch pet records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await api.get('/owners');
      if (res.data.success) {
        setOwners(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPets();
    fetchOwners();
    if (searchParams.get('action') === 'add') {
      openAddModal();
    }
  }, [petType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPets();
  };

  const openAddModal = () => {
    setEditingPet(null);
    setFormData({
      petName: '',
      petType: 'Dog',
      breed: '',
      gender: 'Male',
      dateOfBirth: '',
      weight: '',
      color: '',
      petId: `PET-${Math.floor(1000 + Math.random() * 9000)}`,
      medicalNotes: '',
      ownerId: '',
      ownerName: '',
      ownerPhone: '',
      ownerEmail: '',
      ownerAddress: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pet) => {
    setEditingPet(pet);
    setFormData({
      petName: pet.petName || '',
      petType: pet.petType || 'Dog',
      breed: pet.breed || '',
      gender: pet.gender || 'Male',
      dateOfBirth: pet.dateOfBirth ? pet.dateOfBirth.split('T')[0] : '',
      weight: pet.weight || '',
      color: pet.color || '',
      petId: pet.petId || '',
      medicalNotes: pet.medicalNotes || '',
      ownerId: pet.ownerId?._id || '',
      ownerName: pet.ownerId?.name || '',
      ownerPhone: pet.ownerId?.phone || '',
      ownerEmail: pet.ownerId?.email || '',
      ownerAddress: pet.ownerId?.address || ''
    });
    setIsModalOpen(true);
  };

  const handleSavePet = async (e) => {
    e.preventDefault();
    try {
      if (editingPet) {
        await api.put(`/pets/${editingPet._id}`, formData);
        addToast('Pet profile updated successfully');
      } else {
        await api.post('/pets', formData);
        addToast('Pet registered successfully');
      }
      setIsModalOpen(false);
      fetchPets();
      fetchOwners();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save pet record', 'error');
    }
  };

  const handleDeletePet = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/pets/${deleteId}`);
      addToast('Pet record deleted');
      setDeleteId(null);
      fetchPets();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete pet', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pet Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage pet profiles, owner information, and patient medical history
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition shadow-md shadow-brand-600/20 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Pet
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by pet, breed, ID, or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5" /> Species:
          </span>
          {['All', 'Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map((type) => (
            <button
              key={type}
              onClick={() => setPetType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                petType === type
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Pet Table */}
      {loading ? (
        <LoadingSkeleton count={5} height="h-16" />
      ) : pets.length === 0 ? (
        <EmptyState
          title="No Pets Found"
          description="No registered pet records match your criteria. Add your first pet to start tracking vaccinations and medical histories."
          actionText="Add New Pet"
          onAction={openAddModal}
          icon={Dog}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Pet Info</th>
                  <th className="px-6 py-4">Breed & Gender</th>
                  <th className="px-6 py-4">Owner Info</th>
                  <th className="px-6 py-4">Last Vaccination</th>
                  <th className="px-6 py-4">Next Scheduled</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {pets.map((pet) => (
                  <tr key={pet._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                          {pet.petName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{pet.petName}</p>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">
                            {pet.petId} • {pet.petType}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-slate-900 font-semibold">{pet.breed}</p>
                      <p className="text-slate-400 text-[11px]">{pet.gender} • {pet.weight ? `${pet.weight} kg` : 'N/A'}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {pet.ownerId?.name || 'N/A'}
                      </p>
                      <p className="text-slate-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {pet.ownerId?.phone || 'No phone'}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {pet.lastVaccination ? new Date(pet.lastVaccination).toLocaleDateString() : 'None recorded'}
                    </td>

                    <td className="px-6 py-4">
                      {pet.nextVaccination ? (
                        <div>
                          <p className="font-bold text-slate-900">{new Date(pet.nextVaccination).toLocaleDateString()}</p>
                          <span
                            className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                              pet.nextVaccineStatus === 'Overdue'
                                ? 'bg-rose-100 text-rose-700'
                                : pet.nextVaccineStatus === 'Due Today'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {pet.nextVaccineStatus}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No upcoming</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/pets/${pet._id}`)}
                          className="p-2 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(pet)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(pet._id)}
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

      {/* Add / Edit Pet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-extrabold text-slate-900 mb-6">
              {editingPet ? 'Edit Pet Profile' : 'Register New Pet'}
            </h2>

            <form onSubmit={handleSavePet} className="space-y-6">
              {/* Pet Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 border-b border-slate-100 pb-2">
                  Pet Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pet Name *</label>
                    <input
                      type="text"
                      value={formData.petName}
                      onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                      required
                      placeholder="e.g. Bruno"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pet Type *</label>
                    <select
                      value={formData.petType}
                      onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Reptile">Reptile</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Breed</label>
                    <input
                      type="text"
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                      placeholder="e.g. Golden Retriever"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="e.g. 25.4"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pet Tag / Reg ID</label>
                    <input
                      type="text"
                      value={formData.petId}
                      onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                      placeholder="e.g. PET-1005"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 border-b border-slate-100 pb-2">
                  Owner Information
                </h3>

                {owners.length > 0 && !editingPet && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Existing Owner</label>
                    <select
                      value={formData.ownerId}
                      onChange={(e) => {
                        const sel = owners.find(o => o._id === e.target.value);
                        if (sel) {
                          setFormData({
                            ...formData,
                            ownerId: sel._id,
                            ownerName: sel.name,
                            ownerPhone: sel.phone,
                            ownerEmail: sel.email,
                            ownerAddress: sel.address
                          });
                        } else {
                          setFormData({ ...formData, ownerId: '', ownerName: '', ownerPhone: '' });
                        }
                      }}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                    >
                      <option value="">-- Create New Owner Below --</option>
                      {owners.map((o) => (
                        <option key={o._id} value={o._id}>{o.name} ({o.phone})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Owner Name *</label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Owner Phone *</label>
                    <input
                      type="text"
                      value={formData.ownerPhone}
                      onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                      required
                      placeholder="+91 98765 00000"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medical Notes & Allergies</label>
                <textarea
                  rows="3"
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                  placeholder="Record allergies, dietary restrictions, chronic conditions..."
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
                  {editingPet ? 'Save Changes' : 'Register Pet'}
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
        onConfirm={handleDeletePet}
        title="Delete Pet Record?"
        message="This action will permanently delete this pet profile along with all associated vaccination history records."
        loading={deleteLoading}
      />
    </div>
  );
};
