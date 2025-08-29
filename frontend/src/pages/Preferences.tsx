import { useEffect, useState } from "react";
import { useUserPreferencesContext } from "../context/PreferencesContext";
import type { Preferences } from "../dto/Settings";
import { useAuthContext } from "../auth/AuthContext";

export default function Preferences() {
  const { auth } = useAuthContext();
  const { preferences: settings, setPreference: updateUserPreferences } =
    useUserPreferencesContext();
  const [initialSettings, setInitialSettings] = useState<Preferences | null>(
    null
  );

  useEffect(() => {
    setInitialSettings(settings);
  }, []);

  const handleRevertChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!initialSettings) return;

    (Object.keys(initialSettings) as (keyof Preferences)[]).forEach((key) => {
      const value = initialSettings[key];
      updateUserPreferences(key, value);
    });
  };

  const handleChange = (
    key: keyof Preferences,
    value: string | boolean | number
  ) => {
    updateUserPreferences(key, value);
    updateUserPreferences("profileId", auth?.userId || "");
  };

  return (
    <div
      style={{ paddingTop: "100px", color: "red" }}
      className="preferences_container"
    >
      <h1>User Preferences</h1>
      <form id="preferencesForm">
        <label htmlFor="theme">Theme:</label>
        <select
          onChange={(e) => handleChange("theme", e.target.value)}
          value={settings?.theme}
          id="theme"
          name="theme"
        >
          <option value="themeA">Theme A</option>
          <option value="themeB">Theme B</option>
          <option value="themeC">Theme C</option>
        </select>

        <label htmlFor="language">Language:</label>
        <select
          onChange={(e) => handleChange("language", e.target.value)}
          value={settings?.language}
          id="language"
          name="language"
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>

        <label>
          <input
            checked={settings?.notifications}
            onChange={(e) => handleChange("notifications", e.target.checked)}
            type="checkbox"
            id="notifications"
            name="notifications"
          />
          Enable Notifications
        </label>

        <label>
          <input
            onChange={(e) => handleChange("animations", e.target.checked)}
            checked={settings?.animations}
            type="checkbox"
            id="animations"
            name="animations"
          />
          Enable Animations
        </label>
      </form>

      <button onClick={handleRevertChange}>Revert changes</button>
    </div>
  );
}
