import React, { useState, useEffect } from 'react';
import "../Stylesheets/register.css";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from '../config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    // Listen for authentication state changes, such as email verification
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                user.reload().then(() => {
                    if (user.emailVerified) {
                        setIsEmailVerified(true);
                    } else {
                        setIsEmailVerified(false);
                    }
                });
            }
        });

        // Clean up the listener when the component is unmounted
        return () => unsubscribe();
    }, []);

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Signed up successfully");

            // Send email verification link
            await sendEmailVerification(userCredential.user);
            alert("Verification email sent! Please check your inbox.");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <form className="form" onSubmit={handleEmailSignup}>
            <p className="title">Register</p>

            <label>
                <input className="input" type="email" placeholder="Email" required
                    value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <label>
                <input className="input" type="password" placeholder="Password" required
                    value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>

            <button type="submit" className="submit">Register</button>

            <hr />

            {isEmailVerified ? (
                <p></p>
            ) : (
                <p>Please verify your email. Check your inbox for the verification link.</p>
            )}

            <p className="signin">Already have an account? <a href="#">Sign in</a></p>
        </form>
    );
};

export default Register;
