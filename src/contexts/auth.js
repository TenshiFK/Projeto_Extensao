import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConnection.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import axios from "axios";

import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({});

function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  useEffect(() => {
    async function loadUser(){
      const storageUser = localStorage.getItem('@ticketsPRO')

      if(storageUser){
        setUser(JSON.parse(storageUser))
        setLoading(false);
      }


      setLoading(false);

    }

    loadUser();
  }, [])


  async function signIn(email, password){
    setLoadingAuth(true);

    const response = await axios.post('http://localhost:5000/login', { email, password });

    const data = response.data;

    if (data.status === 'success') {
        let uid = data.uid;
        let email = data.email;
        let avatarUrl = data.avatarUrl;

        let userData = {
            uid: uid,
            email: email,
            avatarUrl: avatarUrl
        }

        setUser(userData);
        storageUser(userData);
        setLoadingAuth(false);
        toast.success("Bem-vindo(a) de volta!");
        navigate("/console");
    } else {
        console.log(data.message);
        setLoadingAuth(false);
        toast.error("Ops algo deu errado!");
    }
} 


  // Cadastrar um novo user
  async function signUp(email, password){
    setLoadingAuth(true);

    await createUserWithEmailAndPassword(auth, email, password)
    .then( async (value) => {
        let uid = value.user.uid

        await setDoc(doc(db, "users", uid), {
          avatarUrl: null
        })
        .then( () => {

          let data = {
            uid: uid,
            email: value.user.email,
            avatarUrl: null
          };

          setUser(data);
          storageUser(data);
          setLoadingAuth(false);
          navigate("/console")
          
        })


    })
    .catch((error) => {
      console.log(error);
      setLoadingAuth(false);
    })

  }


  function storageUser(data){
    localStorage.setItem('@ticketsPRO', JSON.stringify(data))
  }

  async function logout(){
    await signOut(auth);
    
    await axios.post('http://localhost:5000/logout');
    localStorage.removeItem('@ticketsPRO');
    setUser(null);
  }

  return(
    <AuthContext.Provider 
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
        logout,
        loadingAuth,
        loading,
        storageUser,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;