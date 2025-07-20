import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../auth/AuthContext";
import { useModalContext } from "../../context/ModalContext";
import AuthBgEffect from "./AuthBgEffect";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const sliderDivRef = useRef<HTMLDivElement>(null);

  const { setComponentState } = useModalContext();
  const { signup } = useAuthContext();

  // INPUT FX
  const emailPhRef = useRef<HTMLSpanElement>(null);
  const passwordPhRef = useRef<HTMLSpanElement>(null);
  const repeatPasswordPhRef = useRef<HTMLSpanElement>(null);
  const [focus, setFocus] = useState("");

  useEffect(() => {
    emailPhRef.current?.classList.remove("form__ph__text--active");
    passwordPhRef.current?.classList.remove("form__ph__text--active");
    repeatPasswordPhRef.current?.classList.remove("form__ph__text--active");

    if (focus === "username" || email !== "") {
      emailPhRef.current?.classList.add("form__ph__text--active");
    }
    if (focus === "password" || password !== "") {
      passwordPhRef.current?.classList.add("form__ph__text--active");
    }
    if (focus === "repeatPassword" || repeatPassword !== "") {
      repeatPasswordPhRef.current?.classList.add("form__ph__text--active");
    }
  }, [focus, email, password, repeatPassword]);

  // Sanitization
  const sanitize = (input: string) => input.trim().replace(/[^\w\s@.]/gi, "");

  const handleSetEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedUsername = sanitize(e.target.value);
    setEmail(sanitizedUsername);
  };

  const handleSetPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedPassword = sanitize(e.target.value);
    setPassword(sanitizedPassword);
  };

  const handleSetRepeatPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedPassword = sanitize(e.target.value);
    setRepeatPassword(sanitizedPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await signup({ email, password });
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

  const handleValidateAndSwipe = () => {
    if (!sliderDivRef.current) return;

    sliderDivRef.current.style.transform = "translateX(-400px)";
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="auth_wrapper">
      <AuthBgEffect />
      <div ref={sliderDivRef} className="auth_slider_div">
        <form className="auth_form_div">
          <h1>Signup</h1>
          <label htmlFor="userType"></label>
          <label htmlFor="email" className="login__label">
            <input
              className="login__input"
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => handleSetEmail(e)}
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
          </label>
          <label htmlFor="repeatPassword" className="login__label">
            <input
              className="login__input"
              type="repeatPassword"
              id="repeatPassword"
              name="repeatPassword"
              value={repeatPassword}
              onChange={(e) => handleSetRepeatPassword(e)}
              onFocus={() => setFocus("repeatPassword")}
              onBlur={() => setFocus("")}
              required
            />
            <span ref={repeatPasswordPhRef} className="form__ph__text">
              Repeat password
            </span>
          </label>
          {error && <span className="error__message__span">{error}</span>}
          <div>
            <button
              onClick={handleValidateAndSwipe}
              className="default_btn popup_continue_btn"
              type="button"
            >
              Create an account
            </button>
          </div>
          <div style={{ width: "300px", marginTop: "50px" }}>
            Already have an account?
            <a style={{ marginTop: "15px" }} className="forgot_psw_btn" href="">
              <br />
              Login
            </a>
          </div>
        </form>
        <form className="auth_form_div" onSubmit={(e) => handleSubmit(e)}>
          second page
        </form>
      </div>
    </div>
  );
}
