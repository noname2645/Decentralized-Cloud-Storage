import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config.js'; // Your Firebase config
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import "../Stylesheets/register.css";
import Google from "../assets/Images/google.png"; // Google logo image

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false); // Track verification email sent status
  const [isUserVerified, setIsUserVerified] = useState(false); // Track if the user has verified email
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Handle Email SignUp
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed up successfully");

      // Send email verification
      await sendEmailVerification(userCredential.user);
      console.log("Verification email sent!");

      setIsVerificationSent(true); // Mark that the email has been sent
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Handle Google SignUp
  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google sign-in successful:', user);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Check email verification status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          setIsUserVerified(true);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Automatically sign in the user if their email is verified and redirect to home
  const handleEmailVerificationRedirect = () => {
    if (isUserVerified) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("User signed in automatically after verification", userCredential.user);
          navigate('/'); // Redirect to home page after successful verification
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    }
  };

  return (
    <form className="form" onSubmit={handleEmailSignup}>
      <p className="title">Register</p>

      {/* Email Sign-Up */}
      <label>
        <input 
          className="input" 
          type="email" 
          placeholder="Email" 
          required
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </label>

      <label>
        <input 
          className="input" 
          type="password" 
          placeholder="Password" 
          required
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </label>

      <button type="submit" className="submit">Register</button>

      {isVerificationSent && (
        <div className="verification-message">
          <p>Please check your email to verify your account.</p>
        </div>
      )}

      {/* Automatically log in if verified */}
      {isUserVerified && (
        <div className="verification-message">
          <p>Your email has been verified! You are automatically logged in.</p>
          {navigate('/')} {/* Redirect to home page */}
        </div>
      )}

      <p id="OR">OR USE THIS METHOD</p>

      {/* Google Sign-Up */}
      <button 
        type="button" 
        onClick={handleGoogleSignup} 
        className="google-signup-btn">
        <img className="gimg" src={Google} alt="Google icon" />
        <p id="gtext">Sign Up with Google</p>
      </button>

      <p className="signin">Already have an account? <a href="#">Sign in</a></p>
    </form>
  );
};

export default Register;
