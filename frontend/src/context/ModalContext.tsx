/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useContext } from "react";
import type { ComponentType, ReactNode } from "react";

interface ModalContextType {
  Component: ComponentType | undefined;
  setComponentState: (
    component: ComponentType | undefined,
    props?: Record<string, any>
  ) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

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

  const setComponentState = (
    component: ComponentType<any> | undefined,
    props: Record<string, any> = {}
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
        <div onClick={stopModal} className="modal_backdrop">
          <div onClick={(e) => e.stopPropagation()}>
            <Component {...props} />
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
