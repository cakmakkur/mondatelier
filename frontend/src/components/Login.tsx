import { useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import { useModalContext } from "../context/ModalContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setComponentState } = useModalContext();

  const { login } = useAuthContext();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      console.log("Login response:", response);
      if (response && response.status === 200) {
        // close the modal on successful login
        setComponentState(undefined);
      } else if (response?.status === 400) {
        console.error("Bad credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="auth_div">
      <form onClick={(e) => e.stopPropagation()} className="auth_form_div">
        <h2>Login</h2>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />

        <button onClick={(e) => handleClick(e)}>Login</button>
      </form>
    </div>
  );
}
