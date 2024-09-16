import React, { useState, useEffect, useRef } from 'react';
import '../styles/ToDoList.css'; 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate, useLocation } from 'react-router-dom';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4Q0D1L4QBVZxWEk8jX9XifEeSjY7jT3A",
  authDomain: "todolist-mahijith.firebaseapp.com",
  projectId: "todolist-mahijith",
  storageBucket: "todolist-mahijith.appspot.com",
  messagingSenderId: "169056542650",
  appId: "1:169056542650:web:0a12fc94a52af576ab0783",
  measurementId: "G-WKWF9GW2LJ"
};

function ToDoList() {

  const navigate = useNavigate();
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firestore and Auth services
  const db = getFirestore(app);
  const auth = getAuth();

  const fileInputRef = useRef(null);
  const location = useLocation();
  const dataFromLoading = location.state?.data;

  const [tasks, setTasks] = useState(dataFromLoading ? dataFromLoading.tasks : [{ id: 1, text: '', completed: false }]);
  const [username, setUsername] = useState(dataFromLoading ? dataFromLoading.username : '');

  // Function to add a new task
  const addTask = () => {
    const newTask = { id: tasks.length + 1, text: '', completed: false };
    setTasks((prevTasks) => [...prevTasks, newTask]);

    // Focus on the new task after adding it
    setTimeout(() => {
      const newTaskInput = document.getElementById(`task-${newTask.id}`);
      if (newTaskInput) {
        newTaskInput.focus();
      }
    }, 0);
  };

  // Function to remove a task
  const removeTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);

    if (updatedTasks.length === 0) {
      setTasks([{ id: 1, text: '', completed: false }]);
    } else {
      setTasks(updatedTasks);

      // Focus on the previous task after removal
      const previousTask = updatedTasks[updatedTasks.length - 1];
      setTimeout(() => {
        const previousTaskInput = document.getElementById(`task-${previousTask.id}`);
        if (previousTaskInput) {
          previousTaskInput.focus();
        }
      }, 0);
    }
  };

  // Handle task text change
  const handleTaskChange = (id, text) => {
    setTasks(tasks.map((task) => task.id === id ? { ...task, text } : task));
  };

  // Toggle task completion status
  const toggleComplete = (id) => {
    setTasks(tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  // Save tasks to Firestore
  const saveTasksToFirestore = () => {
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(db, "data", user.uid);
      setDoc(userDocRef, {
        username: username,
        tasks: tasks
      })
      .then(() => {
        console.log('Tasks saved to Firestore');
      })
      .catch((error) => {
        console.error('Error saving tasks to Firestore:', error);
      });
    } else {
      console.log("No authenticated user");
    }
  };

  // Handle file selection for upload
  const handleFile = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();

      reader.onload = function(e) {
        try {
          const data = JSON.parse(e.target.result);
          setTasks(data.tasks.map((task, index) => ({
            id: index + 1,
            text: task.text,
            completed: task.completed,
          })));
          document.getElementById('username-placeholder').textContent = data.username;
        } catch (err) {
          console.error('Error parsing JSON:', err);
        }
      };

      reader.readAsText(file);
    } else {
      console.error('Invalid file type. Please upload a JSON file.');
    }
  };

  // Fetch username from Firestore when the component is mounted
  useEffect(() => {
    const getUsernameFromFirestore = () => {
      const user = auth.currentUser;
  
      if (user) {
        const userDocRef = doc(db, "usernames", user.uid);
        getDoc(userDocRef).then((docSnap) => {
          if (docSnap.exists()) {
            const username = docSnap.data().username;
            setUsername(username);
          } else {
            console.log("Not found");
          }
        });
      } else {
        console.log("No user");
      }
    };
    
    getUsernameFromFirestore();
  }, [auth, db]);

  // Handle key events for task management
  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeElement = document.activeElement;

      // Handle Enter key to add a task
      if (event.key === 'Enter') {
        event.preventDefault();

        if (activeElement && activeElement.classList.contains('new-task')) {
          const currentIndex = tasks.findIndex(task => `task-${task.id}` === activeElement.id);
          const nextIndex = currentIndex + 1;

          if (nextIndex < tasks.length) {
            // Focus on the next task
            const nextTaskInput = document.getElementById(`task-${tasks[nextIndex].id}`);
            if (nextTaskInput) {
              nextTaskInput.focus();
            }
          } else {
            // Add a new task and focus on it
            addTask();
          }
        }
      }

      // Handle Shift + Backspace to remove a task
      else if (event.key === 'Backspace' && event.shiftKey) {
        if (activeElement && activeElement.classList.contains('new-task')) {
          const taskId = parseInt(activeElement.id.replace('task-', ''), 10);
          removeTask(taskId);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [tasks]);

  const back = () => {
    navigate('/')
  }

  return (
    <div className="list">
      <h2 id="todo-header">
        <span id="username-placeholder">{username}</span>'s To-Do List
      </h2>
      <button className="buttons" id="back-button" onClick={back}>Back</button>
      <div className="tasks">
        {tasks.map((task, index) => (
          <React.Fragment key={task.id}>
            {index > 0 && <div className="gap"></div>}
            <div className="task-item">
              <input
                type="checkbox"
                id={`check-${task.id}`} 
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              <input
                type="text"
                id={`task-${task.id}`} 
                value={task.text}
                onChange={(e) => handleTaskChange(task.id, e.target.value)}
                className={`new-task ${task.completed ? 'strike-through' : ''}`}
              />
              <button onClick={() => removeTask(task.id)}>-</button>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="buttons-container">
        <button onClick={addTask} className="add-task-button">Add Task</button>
        <button onClick={saveTasksToFirestore} className="save-button">Save</button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFile}
          accept=".json"
          id="upload-file"
        />
      </div>
    </div>
  );
}

export default ToDoList;
