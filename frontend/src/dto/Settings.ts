export interface Settings {
  profileId: string;
  theme: "themeA" | "themeB" | "themeC";
  language: "en" | "de";
  notifications: boolean;
  cookieConsent: boolean;
  eventPreferredCity: string;
  animations: boolean;
}

export const defaultSettings: Settings = {
  profileId: "",
  theme: "themeA",
  language: "en",
  notifications: true,
  cookieConsent: false,
  eventPreferredCity: "",
  animations: true,
};
