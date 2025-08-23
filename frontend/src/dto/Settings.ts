export interface Settings {
  profileId: string | null;
  theme: "themeA" | "themeB" | "themeC";
  language: "en" | "de";
  notifications: boolean;
  eventPreferredCity: string;
  eventPreferredCountry: string;
  animations: boolean;
}

export const defaultSettings: Settings = {
  profileId: "",
  theme: "themeA",
  language: "en",
  notifications: true,
  eventPreferredCity: "",
  eventPreferredCountry: "",
  animations: true,
};
