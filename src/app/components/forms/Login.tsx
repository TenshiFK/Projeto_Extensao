'use client';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword} from "react-firebase-hooks/auth"; //cria um usuario, talvez não queremos isso.
import { auth } from '@/app/firebase/firebaseconfig';
import { useRouter } from "next/navigation";
 
export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth); //cria um usuario utilizando a auth do nosso firebase.
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth); //cria funções para login.

  const router = useRouter() //rota para mandar para outra pagina. -- talvez no futuro -- depende da auth que vamos usar?

  // função registrar - para testar.
  const handleRegistro = async () => { //função para login
    try { //try para pegar quaisquer erros.
      const resposta = await createUserWithEmailAndPassword(email, password);
      console.log({resposta}); 
      //reseta para nulo apos mandar resposta.
      setEmail('');
      setPassword('');
    } catch(error){
      console.error(error); //pega quaisquer erro e nos manda no console.
    }
  }

  //login
  const handleLogin = async () => { //função para login
    try { //try para pegar quaisquer erros.
      const resposta = await signInWithEmailAndPassword(email, password);
      console.log({resposta}); 
      //reseta para nulo apos mandar resposta.
      setEmail('');
      setPassword('');
      router.push('home');
    } catch(error){
      console.error(error); //pega quaisquer erro e nos manda no console.
    }
  };
  

  return (
    <form className="w-full flex flex-col">
    <div className="relative w-full mb-4">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <EnvelopeIcon className="w-4 h-4 text-second-gray" />
      </div>
      <input
          className="w-full pl-10 py-3 input-login text-sm font-thin"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="relative w-full mb-14">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <LockClosedIcon className="w-4 h-4 text-second-gray" />
        </div>
        <input
            className="w-full pl-10 py-3 input-login text-sm font-thin"
            value={password}
            type={showPassword ? "password" : "text"}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeSlashIcon className="w-4 h-4 text-second-gray" />
          ) : (
            <EyeIcon className="w-4 h-4 text-second-gray" />
          )}
        </button>
      </div>
      <button onClick={handleLogin} className="w-full py-3 bg-main-blue text-main-white hover:bg-blue-950 rounded-[10px]">Login</button>
    </form>
  )
}