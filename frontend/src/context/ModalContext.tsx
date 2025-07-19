import React, { createContext, useState, useContext } from "react";
import type { ComponentType, ReactNode } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import CookiesConsent from "../components/CookiesConsent";

interface ModalContextType {
  Component: ComponentType<never> | undefined;
  setComponentState: (
    component: ComponentType<never> | undefined,
    props?: Record<string, never>
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
  const [Component, setComponent] = useState<ComponentType<never> | undefined>(
    undefined
  );

  const [props, setProps] = useState<Record<string, never>>({});

  if (Object.keys(props).length > 0) {
    setProps(props);
  }

  const setComponentState = (
    component: ComponentType<never> | undefined,
    props: Record<string, never> = {}
  ) => {
    setComponent(() => component);
    if (Object.keys(props).length > 0) {
      setProps(props);
    }
  };

  const value: ModalContextType = {
    Component,
    setComponentState,
  };

  const stopModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setComponent(undefined);
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {Component && (
        <div
          onClick={(e) => {
            stopModal(e);
          }}
          className="modal_backdrop"
        >
          {Component === Login ? (
            <Login {...props} />
          ) : Component === Signup ? (
            <Signup {...props} />
          ) : Component === CookiesConsent ? (
            <CookiesConsent {...props} />
          ) : null}
        </div>
      )}
    </ModalContext.Provider>
  );
};
