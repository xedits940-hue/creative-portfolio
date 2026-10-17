"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import SecretLanyardOverlay from "@/components/common/secret-lanyard-overlay";

interface SecretLanyardContextType {
  isOpen: boolean;
  isUnlocked: boolean;
  openLanyard: () => void;
  closeLanyard: () => void;
  unlockVault: () => void;
  lockVault: () => void;
}

const SecretLanyardContext = createContext<SecretLanyardContextType | null>(null);

export function SecretLanyardProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const openLanyard = useCallback(() => {
    setIsUnlocked(false);
    setIsOpen(true);
  }, []);

  const closeLanyard = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setIsUnlocked(false);
    }, 400);
  }, []);

  const unlockVault = useCallback(() => {
    setIsUnlocked(true);
  }, []);

  const lockVault = useCallback(() => {
    setIsUnlocked(false);
  }, []);

  useEffect(() => {
    const handleOpenEvent = () => openLanyard();
    const handleCloseEvent = () => closeLanyard();

    window.addEventListener("vt-open-lanyard", handleOpenEvent);
    window.addEventListener("vt-close-lanyard", handleCloseEvent);

    return () => {
      window.removeEventListener("vt-open-lanyard", handleOpenEvent);
      window.removeEventListener("vt-close-lanyard", handleCloseEvent);
    };
  }, [openLanyard, closeLanyard]);

  return (
    <SecretLanyardContext.Provider
      value={{
        isOpen,
        isUnlocked,
        openLanyard,
        closeLanyard,
        unlockVault,
        lockVault,
      }}
    >
      {children}
      <SecretLanyardOverlay />
    </SecretLanyardContext.Provider>
  );
}

export function useSecretLanyard() {
  const context = useContext(SecretLanyardContext);
  if (!context) {
    throw new Error("useSecretLanyard must be used within a SecretLanyardProvider");
  }
  return context;
}
