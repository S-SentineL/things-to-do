import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

function Loading() {
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser; 

  const loadTasksFromFirestore = () => {
    const user = auth.currentUser;
  
    if (user) {
      console.log("User is signed in:", user.uid);
      // Fetch the user data from Firestore
      const userDocRef = doc(db, `data/${user.uid}`);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          navigate('/todolist', { state: { data: data } });
        } else {
          console.log("No data found in Firestore");
          navigate('/todolist');
        }
      });
    } else {
      console.log("No user is signed in");
    }
  };
  
  if (user) {
    console.log("User is ", user.uid);
    
    loadTasksFromFirestore();
  } else {
    navigate('/login');
  }
  return (
    <div id='loading'>
        <span>LOADING...</span>
    </div>
);
}

export default Loading;