/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useEffect, useState, useContext } from "react";
import type { ComponentType, ReactNode } from "react";

interface ModalContextType {
  Component: ComponentType<any> | undefined;
  setComponentState: (
    component: ComponentType<any> | undefined,
    props?: Record<string, any>
  ) => void;
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
  const [Component, setComponent] = useState<ComponentType<any> | undefined>(
    undefined
  );
  const [props, setProps] = useState<Record<string, unknown>>({});

  const closeModal = () => {
    setComponent(undefined);
    setProps({});
  };

  const setComponentState = (
    component: ComponentType<any> | undefined,
    props: Record<string, any> = {}
  ) => {
    setComponent(() => component);
    setProps(props);
  };

  useEffect(() => {
    if (!Component) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [Component]);

  const value: ModalContextType = {
    Component,
    setComponentState,
  };

  const stopModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    closeModal();
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {Component && (
        <div onClick={stopModal} className="modal_backdrop">
          <div onClick={(e) => e.stopPropagation()}>
            <Component {...props} />
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
