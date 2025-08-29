import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../auth/AuthContext";
import { useModalContext } from "../../context/ModalContext";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import BgFx1 from "../fx/BgFx1";

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
  const timerRef = useRef<number | undefined>(undefined);

  const confirmationRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
    const sanitizedUsername = e.target.value;
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
      if (response && response.status === 200) {
        confirmationRef.current?.classList.add("auth_success--fade-in");
        containerRef.current?.classList.add("auth_wrapper--success");
        formRef.current?.classList.add("auth_form_div--fade-out");
        timerRef.current = setTimeout(() => {
          setComponentState(undefined);
        }, 800);
      } else if (response?.status === 400) {
        console.error("Bad credentials");
        setError("Wrong email or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed");
    }
  };

  const handleForgotPassword = () => {
    setComponentState(ForgotPassword);
  };

  const handleCreateAccount = () => {
    setComponentState(Signup);
  };

  return (
    <div
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
      className="auth_wrapper"
    >
      <BgFx1 />
      <form
        ref={formRef}
        onClick={(e) => e.stopPropagation()}
        className="auth_form_div"
        onSubmit={(e) => handleClick(e)}
      >
        <div className="auth_popup_header">
          <img className="auth_popup_favicon" src="favicon.png" alt="" />
          <h1>Login to your account</h1>
        </div>

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
            <button
              onClick={handleForgotPassword}
              style={{ marginTop: "15px" }}
              className="forgot_psw_btn"
            >
              Forgot password?
            </button>
          </div>
        </label>
        {error && <span className="error__message__span">{error}</span>}
        <div className="login_div_btns">
          <button className="default_btn popup_login_btn" type="submit">
            Login
          </button>
        </div>

        <div onClick={handleCreateAccount} className="login_div_create_account">
          <h4>Don't have an account yet?</h4>
          <button>Create an Account Now</button>
        </div>
      </form>
      {/* confirmation animation*/}
      <div ref={confirmationRef} className="auth_success">
        <img src="/check_60dp_48752C_FILL0_wght400_GRAD0_opsz48.svg" alt="" />
      </div>
    </div>
  );
}
