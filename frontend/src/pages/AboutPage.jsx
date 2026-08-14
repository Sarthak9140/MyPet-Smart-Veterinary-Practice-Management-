import React from 'react';
import { PublicNavbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  Stethoscope,
  CheckCircle2,
  ShieldAlert,
  Bell,
  Syringe,
  Package,
  HeartHandshake
} from 'lucide-react';

export const AboutPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {!user && <PublicNavbar />}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12 flex-1">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold">
            <Stethoscope className="w-4 h-4" /> About MyPet SaaS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Smart Veterinary Practice Management
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            MyPet is built specifically to solve the real-world operational challenges veterinary doctors face daily — keeping pet records accurate, tracking vaccine schedules, and preventing missed booster dates.
          </p>
        </div>

        {/* The Real World Problem */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-rose-500" /> The Real-World Problem We Solve
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Veterinary doctors treat dozens of pets every week. A pet receives a vaccine today, but the doctor needs to track:
          </p>

          <ul className="grid sm:grid-cols-2 gap-3 text-xs font-medium text-slate-700">
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Which pet received the vaccine?
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Which specific vaccine was administered?
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> On what exact date was it given?
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> When should the pet receive the next booster dose?
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Which pets are due for vaccination today or this week?
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Which pet vaccinations are already overdue?
            </li>
          </ul>

          <p className="text-slate-600 text-sm leading-relaxed pt-2">
            Relying on physical paper notebooks, scattered spreadsheets, or memory frequently leads to forgotten booster dates. <strong>MyPet digitizes all patient records and automatically reminds the practice when a vaccination is approaching.</strong>
          </p>
        </div>

        {/* How MyPet Works */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 text-center">How MyPet Operates</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center">1</div>
              <h4 className="font-bold text-slate-900 text-sm">Register Pet & Owner</h4>
              <p className="text-xs text-slate-500">Store complete patient vitals, breed, weight, medical notes, and owner phone contact.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center">2</div>
              <h4 className="font-bold text-slate-900 text-sm">Record Vaccination</h4>
              <p className="text-xs text-slate-500">Save vaccine name, dose, batch number, administered date, and next scheduled booster date.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center">3</div>
              <h4 className="font-bold text-slate-900 text-sm">Automated Reminders</h4>
              <p className="text-xs text-slate-500">MyPet monitors schedule status daily (2 days, 1 day, today, overdue) and generates non-duplicate alerts.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center">4</div>
              <h4 className="font-bold text-slate-900 text-sm">Inventory Control</h4>
              <p className="text-xs text-slate-500">Track vaccine stocks, medicines, suppliers, low-stock warnings, and expiration dates.</p>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="bg-gradient-to-br from-brand-950 to-slate-900 p-8 sm:p-12 rounded-3xl text-white space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <HeartHandshake className="w-7 h-7 text-brand-400" /> Key Practice Benefits
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Zero Forgotten Vaccinations</h4>
                <p className="text-xs text-slate-400 mt-1">Automated reminders ensure every patient receives timely booster doses.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Save Hours Every Week</h4>
                <p className="text-xs text-slate-400 mt-1">Instant global search and patient history lookup replaces manual searching through notebooks.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Strict Data Isolation</h4>
                <p className="text-xs text-slate-400 mt-1">Every doctor account is securely isolated. Your clinic data is private and encrypted.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Inventory Peace of Mind</h4>
                <p className="text-xs text-slate-400 mt-1">Never run out of essential vaccines or let medicines expire silently in the shelf.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
