import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../auth/AuthContext";
import { useModalContext } from "../../context/ModalContext";
import AuthBgEffect from "./AuthBgEffect";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { setComponentState } = useModalContext();

  const { login } = useAuthContext();

  // INPUT FX
  const emailPhRef = useRef<HTMLSpanElement>(null);
  const passwordPhRef = useRef<HTMLSpanElement>(null);
  const [focus, setFocus] = useState("");

  useEffect(() => {
    emailPhRef.current?.classList.remove("form__ph__text--active");
    passwordPhRef.current?.classList.remove("form__ph__text--active");

    if (focus === "username" || email !== "") {
      emailPhRef.current?.classList.add("form__ph__text--active");
    }
    if (focus === "password" || password !== "") {
      passwordPhRef.current?.classList.add("form__ph__text--active");
    }
  }, [focus, email, password]);

  // Sanitization
  const sanitize = (input: string) => input.trim().replace(/[^\w\s@.]/gi, "");

  const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedUsername = sanitize(e.target.value);
    setEmail(sanitizedUsername);
  };

  const handleSetPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedPassword = sanitize(e.target.value);
    setPassword(sanitizedPassword);
  };

  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      console.log("Login response:", response);
      if (response && response.status === 200) {
        // close the modal on successful login
        setComponentState(undefined);
      } else if (response?.status === 400) {
        console.error("Bad credentials");
        setError("Wrong email or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed");
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="auth_wrapper">
      <AuthBgEffect />
      <form
        onClick={(e) => e.stopPropagation()}
        className="auth_form_div"
        onSubmit={(e) => handleClick(e)}
      >
        <h1 style={{ color: "black", marginBottom: "30px" }}>
          Log in your account
        </h1>

        <label htmlFor="email" className="login__label">
          <input
            className="login__input"
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => handleSetUsername(e)}
            onFocus={() => setFocus("email")}
            onBlur={() => setFocus("")}
            required
          />
          <span ref={emailPhRef} className="form__ph__text">
            Email
          </span>
        </label>
        <label htmlFor="password" className="login__label">
          <input
            className="login__input"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => handleSetPassword(e)}
            onFocus={() => setFocus("password")}
            onBlur={() => setFocus("")}
            required
          />
          <span ref={passwordPhRef} className="form__ph__text">
            Password
          </span>
          <div style={{ marginTop: "3px" }}>
            <a style={{ marginTop: "15px" }} className="forgot_psw_btn" href="">
              Forgot password?
            </a>
          </div>
        </label>
        {error && <span className="error__message__span">{error}</span>}
        <div className="login_div_btns">
          <button className="default_btn popup_login_btn" type="submit">
            Login
          </button>
        </div>

        <div className="login_div_create_account">
          <h4>Don't have an account yet?</h4>
          <a href="">Create an Account Now</a>
        </div>
      </form>
    </div>
  );
}
