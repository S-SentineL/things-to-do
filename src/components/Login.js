import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const firebaseConfig = {
    apiKey: "AIzaSyD4Q0D1L4QBVZxWEk8jX9XifEeSjY7jT3A",
    authDomain: "todolist-mahijith.firebaseapp.com",
    projectId: "todolist-mahijith",
    storageBucket: "todolist-mahijith.appspot.com",
    messagingSenderId: "169056542650",
    appId: "1:169056542650:web:0a12fc94a52af576ab0783",
    measurementId: "G-WKWF9GW2LJ"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate('/loading', { state: { currentUser: user.uid } });
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <div id="logindiv">
      <h2>LOGIN</h2>
      <div id="box1">
        <div className="box1class">
          <label htmlFor="user">Username or Email</label>
          <input type="text" name="user" id="user" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="box1class">
          <label htmlFor="login-password">Password</label>
          <input type="password" name="password" id="login-password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="buttons" id="login-button" onClick={signIn}>Login</button>
        <p>
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
