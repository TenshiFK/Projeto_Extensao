
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';


// gabriel: esta pagina serve para conectar o projeto com o firebase.
// mudar os dados abaixo para a conta de firebase que será utilizada!
const firebaseConfig = {
  apiKey: "AIzaSyDArWU-tKmRnTKXvNSOjoT2rM3_nVrk0Dg",
  authDomain: "aula-firebase-4da89.firebaseapp.com",
  projectId: "aula-firebase-4da89",
  storageBucket: "aula-firebase-4da89.appspot.com",
  messagingSenderId: "39361347508",
  appId: "1:39361347508:web:e4b984b981689c61d93ce1",
  measurementId: "G-BXJNE63DTL"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };