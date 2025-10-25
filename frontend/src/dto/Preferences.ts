export interface Preferences {
  id: number | undefined;
  profileId: string;
  preferredCity: string | null;
  preferredCountry: string | null;
  animations: boolean;
  notifications: boolean;
}

export const defaultPreferences: Preferences = {
  id: undefined,
  profileId: "",
  notifications: true,
  preferredCity: null,
  preferredCountry: null,
  animations: true,
};
