/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Plus,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Globe,
  User,
  LogOut,
  LogIn,
  ChevronDown,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { Logo } from './Logo.tsx';
import { useI18n } from '../context/I18nContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { SupportedLanguage } from '../i18n/translations.ts';

export type ActiveTab =
  | 'home'
  | 'dashboard'
  | 'inventory'
  | 'expiry_monitor'
  | 'agent_solution'
  | 'redistribution'
  | 'analytics'
  | 'history'
  | 'settings'
  | 'login';

interface TopBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenAddItem: () => void;
  onResetData: () => void;
  pendingActionsCount: number;
  isAiConnected: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddItem,
  onResetData,
  pendingActionsCount,
  isAiConnected,
}) => {
  const { language, setLanguage, availableLanguages, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs transition-colors duration-200 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between gap-1 sm:gap-3 h-16 w-full">
          {/* Zone 1: Animated Brand Logo Lockup */}
          <div onClick={() => onSelectTab('home')} className="shrink-0 cursor-pointer">
            <Logo size="sm" showTagline={false} />
          </div>

          {/* Zone 2: Navigation Links (Clean Single-Line Typography) */}
          <nav className="hidden 2xl:flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onSelectTab('home')}
              className={`py-5 px-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'home'
                  ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-500 font-bold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('navHome')}
            </button>
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`py-5 px-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-500 font-bold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('navDashboard')}
            </button>
            <button
              onClick={() => onSelectTab('inventory')}
              className={`py-5 px-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'inventory'
                  ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-500 font-bold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('navInventory')}
            </button>
            <button
              onClick={() => onSelectTab('expiry_monitor')}
              className={`py-5 px-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'expiry_monitor'
                  ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-500 font-bold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('navExpiryMonitor')}
            </button>
            <button
              onClick={() => onSelectTab('agent_solution')}
              className={`py-5 px-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 flex items-center gap-1 ${
                activeTab === 'agent_solution'
                  ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-500 font-bold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('navAgentSolution')}</span>
              {pendingActionsCount > 0 && (
                <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 rounded-sm font-bold">
                  {pendingActionsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onSelectTab('redistribution')}
              className={`py-5 px-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'redistribution'
                  ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-500 font-bold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('navRedistribution')}
            </button>
            <button
              onClick={() => onSelectTab('analytics')}
              className={`py-5 px-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'analytics'
                  ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-500 font-bold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('navAnalytics')}
            </button>
            <button
              onClick={() => onSelectTab('history')}
              className={`py-5 px-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'history'
                  ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-500 font-bold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('navHistory')}
            </button>
          </nav>

          {/* Zone 3: Controls (Lang Switcher + Theme Toggle + CTA + User) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* 7-Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="inline-flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Select Language (7 Indian Languages)"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span className="hidden md:inline font-mono">
                  {availableLanguages.find((l) => l.code === language)?.nativeName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
              </button>

              {isLangDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs font-medium animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setIsLangDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    Indian Languages ({availableLanguages.length})
                  </div>
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as SupportedLanguage);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        language === lang.code
                          ? 'text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-50/50 dark:bg-emerald-950/30'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({lang.name})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={onResetData}
              title="Reset sample canteen scenarios"
              className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('resetDemoData')}</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenAddItem}
              className="inline-flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs whitespace-nowrap"
              title={t('addStockItem')}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('addStockItem')}</span>
            </button>

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-300 dark:border-emerald-700"
                  title={user?.email}
                >
                  {user?.name.slice(0, 1) || 'U'}
                </button>

                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{user?.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-sm">
                        {user?.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectTab('settings');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {t('navSettings')}
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('navLogout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onSelectTab('login')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('navLogin')}</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="2xl:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="2xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1 text-xs font-semibold">
          <button
            onClick={() => {
              onSelectTab('home');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('navHome')}
          </button>
          <button
            onClick={() => {
              onSelectTab('dashboard');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('navDashboard')}
          </button>
          <button
            onClick={() => {
              onSelectTab('inventory');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('navInventory')}
          </button>
          <button
            onClick={() => {
              onSelectTab('expiry_monitor');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('navExpiryMonitor')}
          </button>
          <button
            onClick={() => {
              onSelectTab('agent_solution');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span>{t('navAgentSolution')}</span>
            {pendingActionsCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded-sm font-bold">
                {pendingActionsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              onSelectTab('redistribution');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('navRedistribution')}
          </button>
          <button
            onClick={() => {
              onSelectTab('analytics');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('navAnalytics')}
          </button>
          <button
            onClick={() => {
              onSelectTab('history');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('navHistory')}
          </button>
          <button
            onClick={() => {
              onSelectTab('settings');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('navSettings')}
          </button>
        </div>
      )}
    </header>
  );
};
