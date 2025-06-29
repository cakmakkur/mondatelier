import React, { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

interface ModalContextType {
  renderModal: "login" | "signup" | null;
  setRenderModal: React.Dispatch<
    React.SetStateAction<"login" | "signup" | null>
  >;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "useModalContext must be used within a ModalContextProvider"
    );
  }
  return context;
};

interface ModalContextProviderProps {
  children: ReactNode;
}

export const ModalContextProvider = ({
  children,
}: ModalContextProviderProps) => {
  const [renderModal, setRenderModal] = useState<"login" | "signup" | null>(
    null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const value: ModalContextType = {
    renderModal,
    setRenderModal,
    isSidebarOpen,
    setIsSidebarOpen,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
