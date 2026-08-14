import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  ArrowLeft,
  Dog,
  User,
  Phone,
  Mail,
  MapPin,
  Syringe,
  Calendar,
  FileText,
  Plus,
  Weight
} from 'lucide-react';

export const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/pets/${id}`);
        if (res.data.success) {
          setPet(res.data.data);
        }
      } catch (err) {
        console.error(err);
        addToast('Pet record not found', 'error');
        navigate('/pets');
      } finally {
        setLoading(false);
      }
    };
    fetchPetDetail();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton count={3} height="h-32" />;
  }

  if (!pet) return null;

  return (
    <div className="space-y-6 pb-12">
      {/* Back button */}
      <button
        onClick={() => navigate('/pets')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Pets Directory
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            {pet.petName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{pet.petName}</h1>
              <span className="px-3 py-1 bg-brand-100 text-brand-800 text-xs font-bold rounded-full">
                {pet.petId}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {pet.breed} • {pet.petType} • {pet.gender}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/vaccinations?petId=${pet._id}&action=add`)}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition shadow-md shadow-brand-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Vaccination
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Pet Profile Specs & Owner Info */}
        <div className="space-y-6">
          {/* Specs */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Dog className="w-4 h-4 text-brand-600" /> Patient Vitals
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Weight</span>
                <span className="font-bold text-slate-900">{pet.weight ? `${pet.weight} kg` : 'Not recorded'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Color</span>
                <span className="font-bold text-slate-900">{pet.color || 'Not specified'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Date of Birth</span>
                <span className="font-bold text-slate-900">
                  {pet.dateOfBirth ? new Date(pet.dateOfBirth).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>

            {pet.medicalNotes && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Medical Notes</p>
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 font-medium leading-relaxed">
                  {pet.medicalNotes}
                </div>
              </div>
            )}
          </div>

          {/* Owner Info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" /> Owner Details
            </h3>

            <div className="space-y-3 text-xs">
              <p className="font-bold text-slate-900 text-sm">{pet.ownerId?.name || 'Unknown Owner'}</p>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{pet.ownerId?.phone || 'No phone'}</span>
              </div>
              {pet.ownerId?.email && (
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{pet.ownerId.email}</span>
                </div>
              )}
              {pet.ownerId?.address && (
                <div className="flex items-center gap-2.5 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{pet.ownerId.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Vaccination History Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Syringe className="w-5 h-5 text-brand-600" /> Vaccination History Records
              </h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                {pet.vaccinationHistory?.length || 0} Records
              </span>
            </div>

            {!pet.vaccinationHistory || pet.vaccinationHistory.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No vaccination history logged for {pet.petName} yet.
              </div>
            ) : (
              <div className="space-y-4">
                {pet.vaccinationHistory.map((vac) => (
                  <div
                    key={vac._id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:bg-slate-100/60 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{vac.vaccineName}</h4>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {vac.vaccineType} • Batch: {vac.batchNumber || 'N/A'}
                        </span>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          vac.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-700'
                            : vac.status === 'Due Today'
                            ? 'bg-amber-100 text-amber-800'
                            : vac.status === 'Due Soon'
                            ? 'bg-brand-100 text-brand-800'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {vac.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Administered On</span>
                        <span className="font-semibold text-slate-800">
                          {new Date(vac.vaccinationDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Next Booster Due</span>
                        <span className="font-bold text-brand-700">
                          {new Date(vac.nextVaccinationDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {vac.notes && (
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 italic">
                        "{vac.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
