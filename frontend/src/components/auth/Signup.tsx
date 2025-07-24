import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../auth/AuthContext";
import { useModalContext } from "../../context/ModalContext";
import AuthBgEffect from "./AuthBgEffect";
import type { SignupDto } from "../../dto/Signup";
import emailValidator from "email-validator";
import Login from "./Login";

const defaultSignupBody: SignupDto = {
  email: "",
  password: "",
  userType: 1,
  firstname: "",
  lastname: "",
  profileName: "",
  dob: new Date(),
  country: "",
  showRealName: false,
};

const BASE_URL = import.meta.env.VITE_BASE_URL;
const COUNTRIES_PATH = import.meta.env.VITE_COUNTRIES_PATH;

/**
 * Signup component for user registration.
 * It is made of two forms in each subpage
 * The first form collects basic user information, email and password
 * Click event validates email and password, checks if passwords match
 * If validation does not pass, it does not slide to the second form
 * It shows error messages for each field
 * The second form is for additionalcompulsory user information
 */
export default function Signup() {
  const { setComponentState } = useModalContext();
  const { signup } = useAuthContext();

  const [countries, setCountries] = useState<string[]>([]);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [repeatPassword, setRepeatPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [repeatPasswordError, setRepeatPasswordError] = useState<string | null>(
    null
  );

  const [signupBody, setSignupBody] = useState<SignupDto>(defaultSignupBody);

  // useEffect(() => {
  //   if (!sliderDivRef.current) return;
  //   sliderDivRef.current.style.transform = "translateX(-400px)";
  // }, []);

  /**
  * Fetches the list of countries from the API.
  /*/
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${COUNTRIES_PATH}`);
        setCountries(await response.json());
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  //**
  // ANIMATION & FX
  //**
  const emailPhRef = useRef<HTMLSpanElement>(null);
  const passwordPhRef = useRef<HTMLSpanElement>(null);
  const repeatPasswordPhRef = useRef<HTMLSpanElement>(null);
  const firstnamePhRef = useRef<HTMLSpanElement>(null);
  const lastnamePhRef = useRef<HTMLSpanElement>(null);
  const profileNamePhRef = useRef<HTMLSpanElement>(null);
  const dobPhRef = useRef<HTMLSpanElement>(null);
  const countryPhRef = useRef<HTMLSpanElement>(null);
  const sliderDivRef = useRef<HTMLDivElement>(null);

  const [focus, setFocus] = useState("");

  useEffect(() => {
    emailPhRef.current?.classList.remove("form__ph__text--active");
    passwordPhRef.current?.classList.remove("form__ph__text--active");
    repeatPasswordPhRef.current?.classList.remove("form__ph__text--active");
    firstnamePhRef.current?.classList.remove("form__ph__text--active");
    lastnamePhRef.current?.classList.remove("form__ph__text--active");
    profileNamePhRef.current?.classList.remove("form__ph__text--active");
    dobPhRef.current?.classList.remove("form__ph__text--active");
    countryPhRef.current?.classList.remove("form__ph__text--active");

    if (focus === "email" || signupBody.email !== "") {
      emailPhRef.current?.classList.add("form__ph__text--active");
    }
    if (focus === "password" || signupBody.password !== "") {
      passwordPhRef.current?.classList.add("form__ph__text--active");
    }
    if (focus === "repeatPassword" || repeatPassword !== "") {
      repeatPasswordPhRef.current?.classList.add("form__ph__text--active");
    }
    if (focus === "firstname" || signupBody.firstname !== "") {
      firstnamePhRef.current?.classList.add("form__ph__text--active");
    }
    if (focus === "lastname" || signupBody.lastname !== "") {
      lastnamePhRef.current?.classList.add("form__ph__text--active");
    }
    if (focus === "profileName" || signupBody.profileName !== "") {
      profileNamePhRef.current?.classList.add("form__ph__text--active");
    }
    if (focus === "dob" || signupBody.dob.toISOString().slice(0, 10) !== "") {
      dobPhRef.current?.classList.add("form__ph__text--active");
    }
  }, [focus, signupBody, repeatPassword]);

  //**
  // Nav
  // **

  const handleAccountPresent = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setComponentState(Login);
  };

  //**
  // Input
  //**

  const handleSetEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupBody((prev) => {
      return { ...prev, email: e.target.value.trim() };
    });
  };

  const handleSetPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupBody((prev) => {
      return { ...prev, password: e.target.value };
    });
  };

  const handleSetRepeatPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
  };

  //**
  // VALIDATION
  //**

  const validEmail = () => {
    if (signupBody.email === "") {
      setEmailError("Email cannot be empty");
      return false;
    } else if (!emailValidator.validate(signupBody.email)) {
      setEmailError("Invalid email format");
      return false;
    } else {
      setEmailError(null);
      return true;
    }
  };

  // At least 8 characters, at least 1 digit, at least 1 special character
  const validPassword = () => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*()_+{}\\[\]:;<>,.?~/-]).{8,}$/;
    if (!passwordRegex.test(signupBody.password)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain at least one digit and one special character"
      );
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const passwordsMatch = () => {
    if (signupBody.password !== repeatPassword) {
      setRepeatPasswordError("Passwords do not match");
      return false;
    }
    setRepeatPasswordError(null);
    return true;
  };

  //**
  // SUBMIT
  //**

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await signup(signupBody);
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

  const handleFirstClick = () => {
    if (!sliderDivRef.current) return;
    if (!validEmail()) return;
    if (!validPassword()) return;
    if (!passwordsMatch()) return;
    sliderDivRef.current.style.transform = "translateX(-400px)";
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="auth_wrapper">
      <AuthBgEffect />
      <div ref={sliderDivRef} className="auth_slider_div">
        {/* First Form */}
        <form className="auth_form_div">
          <h1>Signup</h1>
          <label htmlFor="userType"></label>
          <label htmlFor="email" className="login__label">
            <input
              className="login__input"
              type="text"
              id="email"
              name="email"
              value={signupBody.email}
              onChange={(e) => handleSetEmail(e)}
              onFocus={() => setFocus("email")}
              onBlur={() => setFocus("")}
              maxLength={25}
              required
            />
            <span ref={emailPhRef} className="form__ph__text">
              Email
            </span>
          </label>
          {emailError && (
            <span className="error__message__span">{emailError}</span>
          )}
          <label htmlFor="password" className="login__label">
            <input
              className="login__input"
              type="password"
              id="password"
              name="password"
              value={signupBody.password}
              onChange={(e) => handleSetPassword(e)}
              onFocus={() => setFocus("password")}
              onBlur={() => setFocus("")}
              maxLength={25}
              required
            />
            <span ref={passwordPhRef} className="form__ph__text">
              Password
            </span>
          </label>
          {passwordError && (
            <span className="error__message__span">{passwordError}</span>
          )}

          <label htmlFor="repeatPassword" className="login__label">
            <input
              className="login__input"
              type="password"
              id="repeatPassword"
              name="repeatPassword"
              value={repeatPassword}
              onChange={(e) => handleSetRepeatPassword(e)}
              onFocus={() => setFocus("repeatPassword")}
              onBlur={() => setFocus("")}
              maxLength={25}
              required
            />
            <span ref={repeatPasswordPhRef} className="form__ph__text">
              Repeat password
            </span>
          </label>
          {repeatPasswordError && (
            <span className="error__message__span">{repeatPasswordError}</span>
          )}
          <div>
            <button
              onClick={handleFirstClick}
              className="default_btn popup_continue_btn"
              type="button"
            >
              Create an account
            </button>
          </div>
          <div
            onClick={(e) => handleAccountPresent(e)}
            style={{ width: "300px", marginTop: "50px" }}
          >
            Already have an account?
            <button className="already_have_account_btn">Login</button>
          </div>
        </form>
        {/* Second Form */}
        <form className="auth_form_div" onSubmit={handleSubmit}>
          <h1>Complete your account</h1>

          <label htmlFor="firstname" className="login__label">
            <input
              className="login__input"
              type="text"
              id="firstname"
              name="firstname"
              value={signupBody.firstname}
              onChange={(e) =>
                setSignupBody((prev) => ({
                  ...prev,
                  firstname: e.target.value,
                }))
              }
              onFocus={() => setFocus("firstname")}
              onBlur={() => setFocus("")}
              maxLength={30}
              required
            />
            <span ref={firstnamePhRef} className="form__ph__text">
              First Name
            </span>
          </label>

          <label htmlFor="lastname" className="login__label">
            <input
              className="login__input"
              type="text"
              id="lastname"
              name="lastname"
              value={signupBody.lastname}
              onChange={(e) =>
                setSignupBody((prev) => ({
                  ...prev,
                  lastname: e.target.value,
                }))
              }
              onFocus={() => setFocus("lastname")}
              onBlur={() => setFocus("")}
              maxLength={30}
              required
            />
            <span ref={lastnamePhRef} className="form__ph__text">
              Last Name
            </span>
          </label>

          <label htmlFor="profileName" className="login__label">
            <input
              className="login__input"
              type="text"
              id="profileName"
              name="profileName"
              value={signupBody.profileName}
              onChange={(e) =>
                setSignupBody((prev) => ({
                  ...prev,
                  profileName: e.target.value,
                }))
              }
              onFocus={() => setFocus("profileName")}
              onBlur={() => setFocus("")}
              maxLength={30}
              required
            />
            <span ref={profileNamePhRef} className="form__ph__text">
              Profile Name
            </span>
          </label>

          <label htmlFor="dob" className="login__label">
            <input
              className="login__input"
              type="date"
              id="dob"
              name="dob"
              value={signupBody.dob.toISOString().slice(0, 10)}
              onChange={(e) =>
                setSignupBody((prev) => ({
                  ...prev,
                  dob: new Date(e.target.value),
                }))
              }
              onFocus={() => setFocus("dob")}
              onBlur={() => setFocus("")}
              required
            />
            <span ref={dobPhRef} className="form__ph__text">
              Date of Birth
            </span>
          </label>

          <label htmlFor="country" className="login__label">
            <select
              className="login__input login__input__dropdown"
              id="country"
              name="country"
              value={signupBody.country}
              onChange={(e) =>
                setSignupBody((prev) => ({ ...prev, country: e.target.value }))
              }
              onFocus={() => setFocus("country")}
              onBlur={() => setFocus("")}
              required
            >
              <option value="" disabled></option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {signupBody.country === "" ? (
              <span className="form__ph__text">Country</span>
            ) : null}
          </label>

          <label htmlFor="showRealName" className="login__label">
            <input
              className="checkbox__input"
              type="checkbox"
              id="showRealName"
              name="showRealName"
              checked={signupBody.showRealName}
              onChange={(e) =>
                setSignupBody((prev) => ({
                  ...prev,
                  showRealName: e.target.checked,
                }))
              }
            />
            Show real name publicly
          </label>

          <div>
            <button type="submit" className="default_btn popup_continue_btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
