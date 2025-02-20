import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link
import { useNavigate } from "react-router-dom";
import {getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, setPersistence, browserSessionPersistence, signOut} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config.js";
import styles from  "../Stylesheets/login.module.css";
import Google from "../assets/Images/google.png";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => console.log("Session persistence set"))
      .catch((error) => console.error("Error setting persistence:", error));
  }, []);

  // Logout when the page is closed or refreshed
  useEffect(() => {
    const handleUnload = () => signOut(auth).catch((error) => console.error("Logout error:", error));
    window.addEventListener("beforeunload", handleUnload);

    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // Logout when the page is closed completely
  useEffect(() => {
    const handleClose = () => signOut(auth).catch((error) => console.error("Logout error:", error));
    window.addEventListener("unload", handleClose);
    
    return () => window.removeEventListener("unload", handleClose);
  }, []);

  // Handle Email Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully", userCredential.user);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);
      navigate("/home");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Redirect user if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <form className={styles.form} onSubmit={handleEmailLogin}>
      <p className={styles.title}>Login</p>

      <label>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label>
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <button type="submit" className={styles.submit}>Login</button>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <p id={styles.OR}>OR USE THIS METHOD</p>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className={styles.gsignupbtn}>
        <img className={styles.gimg}src={Google} alt="Google icon" />
        <p id={styles.gtext}>Sign In with Google</p>
      </button>

      <p className={styles.signin}>
        Don't have an account? <Link to="/">Register</Link>
      </p>
    </form>
  );
};

export default Login;
