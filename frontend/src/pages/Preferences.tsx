import { useUserPreferencesContext } from "../context/PreferencesContext";
import type { Preferences } from "../dto/Preferences";

export default function Preferences() {
  const { preferences, setPreference } = useUserPreferencesContext();

  const handleChange = (
    key: keyof Preferences,
    value: string | boolean | number
  ) => {
    setPreference(key, value);
  };

  return (
    <div
      style={{ paddingTop: "100px", color: "red" }}
      className="preferences_container"
    >
      <h1>User Preferences</h1>
      <form id="preferencesForm">
        <label htmlFor="language">Language:</label>
        <select
          onChange={(e) => handleChange("language", e.target.value)}
          value={preferences?.language}
          id="language"
          name="language"
        >
          <option value="EN">English</option>
          <option value="DE">Deutsch</option>
        </select>

        <label>
          <input
            checked={preferences?.notifications}
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
            checked={preferences?.animations}
            type="checkbox"
            id="animations"
            name="animations"
          />
          Enable Animations
        </label>
      </form>
    </div>
  );
}
