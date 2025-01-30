import React from 'react';
import "../Stylesheets/register.css";

const Register = () => {
    return (
        <form className="form">
            <p className="title">Register </p>

            <label>
                <input className="input" type="text" placeholder="Name" required=""></input>
            </label>

            <label>
                <input className="input" type="email" placeholder="Email" required=""></input>
            </label>

            <label>
                <input className="input" type="password" placeholder="Password" required=""></input>
            </label>

            <button className="submit">Submit</button>
            <p className="signin">Already have an acount ? <a href="#">Signin</a> </p>
        </form>
    );
};



export default Register;  