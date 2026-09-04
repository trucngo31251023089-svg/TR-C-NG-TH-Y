/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId } from './types';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { E2EEVaultModal } from './components/E2EEVaultModal';
import { AtelierAccountModal } from './components/AtelierAccountModal';
import { HomeScreen } from './screens/HomeScreen';
import { AboutUsScreen } from './screens/AboutUsScreen';
import { WebARScannerScreen } from './screens/WebARScannerScreen';
import { CollaborativePortalScreen } from './screens/CollaborativePortalScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { DesignStudioScreen } from './screens/DesignStudioScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);

  // Scroll to top when changing screen
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#121316] text-[#e3e2e6] flex flex-col selection:bg-[#d6cebe] selection:text-[#1f1d18] relative">
        {/* Luxury Navigation Bar */}
        <Navbar
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenVault={() => setIsVaultOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
        />

        {/* Main Dynamic Screen Content */}
        <main className="flex-1 w-full">
          {currentScreen === 'home' && (
            <HomeScreen onNavigate={(screen) => setCurrentScreen(screen)} />
          )}

          {currentScreen === 'design-studio' && (
            <DesignStudioScreen onNavigate={(screen) => setCurrentScreen(screen)} />
          )}

          {currentScreen === 'webar-scanner' && (
            <WebARScannerScreen onNavigate={(screen) => setCurrentScreen(screen)} />
          )}

          {currentScreen === 'collaborative-portal' && (
            <CollaborativePortalScreen onNavigate={(screen) => setCurrentScreen(screen)} />
          )}

          {currentScreen === 'about-us' && (
            <AboutUsScreen onNavigate={(screen) => setCurrentScreen(screen)} />
          )}

          {currentScreen === 'checkout' && (
            <CheckoutScreen onNavigate={(screen) => setCurrentScreen(screen)} />
          )}
        </main>

        {/* Luxury Maison Archival Footer */}
        {currentScreen !== 'webar-scanner' && (
          <Footer
            onNavigate={(screen) => setCurrentScreen(screen)}
            onOpenVault={() => setIsVaultOpen(true)}
          />
        )}

        {/* Modals */}
        <E2EEVaultModal
          isOpen={isVaultOpen}
          onClose={() => setIsVaultOpen(false)}
        />

        <AtelierAccountModal
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />
      </div>
    </AuthProvider>
  );
}
