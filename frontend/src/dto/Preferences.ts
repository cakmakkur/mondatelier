export interface Preferences {
  id: number | undefined;
  profileId: string;
  language: "EN" | "DE";
  preferredCity: string | null;
  preferredCountry: string | null;
  animations: boolean;
  notifications: boolean;
}

export const defaultPreferences: Preferences = {
  id: undefined,
  profileId: "",
  language: "EN",
  notifications: true,
  preferredCity: null,
  preferredCountry: null,
  animations: true,
};
