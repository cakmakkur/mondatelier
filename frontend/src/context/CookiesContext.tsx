import { createContext, useContext, useEffect, useState } from "react";

interface CookieContextType {
  cookies: string[];
  setCookies: React.Dispatch<React.SetStateAction<string[]>>;
  updateCookies: (newCookies: string[], path: string) => void;
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useCookieContext = (): CookieContextType => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error(
      "useCookieContext must be used within a CookieContextProvider"
    );
  }
  return context;
};

export const CookieContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [cookies, setCookies] = useState<string[]>([]);

  useEffect(() => {
    const rawCookies = document.cookie.split("; ").filter(Boolean);
    setCookies(rawCookies);

    const isEnabledCookie = rawCookies.some((cookie) =>
      cookie.startsWith("isEnabled=true")
    );
    setIsEnabled(isEnabledCookie);
  }, []);

  const writeCookie = (key: string, value: string, path: string = "/") => {
    document.cookie = `${key}=${encodeURIComponent(value)}; path=${path}`;
  };

  const updateCookies = (cookiesArr: string[], path: string) => {
    cookiesArr.forEach((cookie) => {
      const [key, value] = cookie.split("=");
      writeCookie(key, value, path);
    });

    const updatedCookies = document.cookie.split("; ").filter(Boolean);
    setCookies(updatedCookies);
  };

  const value: CookieContextType = {
    cookies,
    setCookies,
    updateCookies,
    isEnabled,
    setIsEnabled,
  };

  return (
    <CookieContext.Provider value={value}>{children}</CookieContext.Provider>
  );
};
