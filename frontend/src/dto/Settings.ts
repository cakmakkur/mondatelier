export interface Settings {
  profileId: string | null;
  theme: "themeA" | "themeB" | "themeC";
  language: "EN" | "DE";
  notifications: boolean;
  eventPreferredCity: string;
  eventPreferredCountry: string;
  animations: boolean;
}

export const defaultSettings: Settings = {
  profileId: "",
  theme: "themeA",
  language: "EN",
  notifications: true,
  eventPreferredCity: "",
  eventPreferredCountry: "",
  animations: true,
};
