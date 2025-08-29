export interface Preferences {
  id: number | undefined;
  profileId: string;
  language: string;
  preferredCity: string;
  preferredCountry: string;
  animations: boolean;
  notifications: boolean;
}

export const defaultPreferences: Preferences = {
  id: undefined,
  profileId: "",
  language: "en",
  notifications: true,
  preferredCity: "",
  preferredCountry: "",
  animations: true,
};
