import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/Navbar';
import {
  Syringe,
  BellRing,
  Dog,
  Package,
  BarChart3,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Clock
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-slate-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Copy */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 text-brand-800 text-xs font-semibold border border-brand-200 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Smart Veterinary Practice Management</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Manage Your Veterinary Practice <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-600">Smarter.</span>
              </h1>
              <p className="text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Track pets, vaccinations, automated reminders, and veterinary product inventory — all from one clean and powerful platform.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base transition shadow-xl shadow-brand-600/25 flex items-center justify-center gap-2"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-base border border-slate-300 transition text-center shadow-sm"
                >
                  Doctor Login
                </Link>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-brand-500" /> No credit card required</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-brand-500" /> Setup in 2 minutes</span>
              </div>
            </div>

            {/* Right SaaS Visual Hero Mockup */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-500 to-teal-500 blur-xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
                {/* Mock Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Starlight Veterinary Practice</h4>
                      <p className="text-xs text-slate-400">Vaccination Overview & Alerts</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                    Active Practice
                  </span>
                </div>

                {/* Mock Dynamic Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                    <div className="flex items-center justify-between text-amber-700">
                      <span className="text-xs font-bold uppercase">Due Today</span>
                      <Clock className="w-4 h-4" />
                    </div>
                    <p className="text-2xl font-black text-amber-900 mt-2">1 Pet</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">Bruno (Rabies Vaccine)</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                    <div className="flex items-center justify-between text-rose-700">
                      <span className="text-xs font-bold uppercase">Overdue</span>
                      <Syringe className="w-4 h-4" />
                    </div>
                    <p className="text-2xl font-black text-rose-900 mt-2">1 Pet</p>
                    <p className="text-[11px] text-rose-700 mt-0.5">Rocky (2 days overdue)</p>
                  </div>
                </div>

                {/* Mock List */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Upcoming Reminders</span>
                    <span className="text-brand-600">Auto-Synced</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Max (German Shepherd)</p>
                      <p className="text-[11px] text-slate-500">DHPP Vaccine • Tomorrow</p>
                    </div>
                    <span className="px-2.5 py-1 bg-brand-100 text-brand-700 text-[11px] font-bold rounded-lg">
                      Due Soon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600">Built for Modern Vets</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Everything you need to run your practice smoothly.</h3>
            <p className="text-slate-600 text-base">
              Eliminate manual notebooks and missing booster dates with our automated practice management features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
                <Syringe className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Vaccination Tracking</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Maintain complete vaccination records, doses, batch numbers, and exact next vaccination dates.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <BellRing className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Smart Reminders</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automated background job continuously checks upcoming vaccinations (2 days, 1 day, today, overdue) without missing a date.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                <Dog className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Pet Management</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Organized pet profiles with owner contact info, breed, weight, medical notes, and complete vaccination history.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Package className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Inventory Management</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Track vaccines, medicines, and medical supplies with low stock alerts and expiration warnings.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Smart Dashboard</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                See practice statistics, overdue vaccinations, due today counts, and stock levels at a glance with dynamic charts.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Search & Filters</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Instant multi-field search by pet name, owner phone, vaccine type, or status with multi-criteria filtering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600">Simple Workflow</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">How MyPet Works in 4 Steps</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <span className="w-9 h-9 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center mb-4">1</span>
              <h4 className="font-bold text-slate-900 mb-2">Register Account</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Sign up your clinic account with secure password hashing and isolated doctor data.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <span className="w-9 h-9 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center mb-4">2</span>
              <h4 className="font-bold text-slate-900 mb-2">Add Pet & Owner</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Record pet details, breed, weight, medical notes, and owner phone contact information.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <span className="w-9 h-9 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center mb-4">3</span>
              <h4 className="font-bold text-slate-900 mb-2">Record Vaccination</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Enter current vaccination date and scheduled next booster date with batch number.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <span className="w-9 h-9 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center mb-4">4</span>
              <h4 className="font-bold text-slate-900 mb-2">Automated Alerts</h4>
              <p className="text-xs text-slate-500 leading-relaxed">MyPet automatically checks schedules daily and alerts you for due today and overdue vaccinations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 font-bold text-2xl text-white">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span>My<span className="text-brand-400">Pet</span></span>
          </div>
          <p className="text-sm max-w-md mx-auto text-slate-400">
            Smart Veterinary Practice Management. Manage Pets. Track Vaccinations. Never Miss a Reminder.
          </p>
          <div className="pt-4 text-xs text-slate-500 border-t border-slate-800">
            © {new Date().getFullYear()} MyPet Veterinary SaaS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
