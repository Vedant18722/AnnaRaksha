/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { Logo } from './Logo.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useI18n } from '../context/I18nContext.tsx';

interface LoginPageProps {
  onBackToHome: () => void;
  onSuccessLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome, onSuccessLogin }) => {
  const { login, fillDemoUser } = useAuth();
  const { t } = useI18n();

  const [email, setEmail] = useState('manager@campusmess.edu.in');
  const [password, setPassword] = useState('Admin@123');
  const [role, setRole] = useState<'Kitchen Manager' | 'Food Safety Officer' | 'Hostel Mess Supervisor'>('Kitchen Manager');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await login(email, password, role);
      if (res.success) {
        onSuccessLogin();
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMessage('Network or server error during sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    fillDemoUser();
    onSuccessLogin();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col items-center text-center space-y-2">
          <button
            onClick={onBackToHome}
            className="self-start inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          <Logo size="lg" showTagline={false} />

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-4">
            Institutional Access Sign In
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to manage canteen stock, authorize agent proposals, and sign audit dispatch slips.
          </p>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs space-y-1.5 text-emerald-950 dark:text-emerald-200">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Demo Mode Active
            </span>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-[11px] font-bold underline hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              1-Click Demo Login
            </button>
          </div>
          <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-normal">
            Pre-configured with credentials for Chef Rajesh Sharma (Campus Kitchen Steward).
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-800 dark:text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@campusmess.edu.in"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Kitchen Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Kitchen Manager">Kitchen Manager / Chief Steward</option>
              <option value="Food Safety Officer">Food Safety & Sanitation Officer</option>
              <option value="Hostel Mess Supervisor">Hostel Dining Hall Supervisor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-400 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
