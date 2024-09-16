import React, { useState, useEffect } from 'react';
import '../styles/ToDoList.css'; 
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const app = initializeApp({
  apiKey: "AIzaSyD4Q0D1L4QBVZxWEk8jX9XifEeSjY7jT3A",
  authDomain: "todolist-mahijith.firebaseapp.com",
  projectId: "todolist-mahijith",
  storageBucket: "todolist-mahijith.appspot.com",
  messagingSenderId: "169056542650",
  appId: "1:169056542650:web:0a12fc94a52af576ab0783",
  measurementId: "G-WKWF9GW2LJ"
});

const db = getFirestore(app);
const auth = getAuth();

function Register({ showLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegisterPasswordVisible, setIsRegisterPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const togglePasswordVisibility = (setVisibility) => {
    setVisibility(prevState => !prevState);
  };

  const registerUser = () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return saveUsernameToFirestore(username, user.uid);
      })
      .then(() => {
        // Navigate to another page after successful registration
        navigate('/'); 
      })
      .catch((error) => {
        console.error('Error registering user:', error);
        setErrorMessage(error.message);
      });
  };

  const saveUsernameToFirestore = (username, uid) => {
    const userDocRef = doc(db, "usernames", uid);

    return getDoc(userDocRef)
      .then((userDoc) => {
        if (!userDoc.exists()) {
          return setDoc(userDocRef, { username });
        } else {
          throw new Error('A username is already registered.');
        }
      })
      .then(() => {
        console.log('Username saved to Firestore');
      })
      .catch((error) => {
        console.error('Error saving username to Firestore:', error);
        setErrorMessage(error.message);
      });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        registerUser();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [username, email, password, confirmPassword]);

  return (
    <div id="registerdiv">
      <h2>REGISTER</h2>
      <div id="box2">
        <div className="box2class">
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            name="username" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div className="box2class">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="box2class">
          <div className="label-with-eye">
            <label htmlFor="register-password">Password</label>
            <img
              className="eye-icon"
              src={
                isRegisterPasswordVisible ? 
                '/assets/password_hide_eye.png' 
                : 
                '/assets/password_show_eye.png'
              }
              alt={isRegisterPasswordVisible ? 'Hide Password' : 'Show Password'}
              onClick={() => togglePasswordVisibility(setIsRegisterPasswordVisible)}
            />
          </div>
          <input
            className="password-input"
            type={isRegisterPasswordVisible ? 'text' : 'password'}
            name="password"
            id="register-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="box2class">
          <div className="label-with-eye">
            <label htmlFor="confirmpassword">Confirm Password</label>
            <img
              className="eye-icon"
              src={
                isConfirmPasswordVisible ? 
                '/assets/password_hide_eye.png' 
                : 
                '/assets/password_show_eye.png'
              }
              alt={isConfirmPasswordVisible ? 'Hide Password' : 'Show Password'}
              onClick={() => togglePasswordVisibility(setIsConfirmPasswordVisible)}
            />
          </div>
          <input
            className="password-input"
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            name="confirmpassword"
            id="confirmpassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button 
          className="buttons" 
          id="register-button" 
          onClick={registerUser}
        >
          Register
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <p>
          Already Have an Account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
