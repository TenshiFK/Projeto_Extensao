'use client';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useAuth } from "@/app/contexts/authContext";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {

    if (email !== '' && password !== ''){
      try {
        await signIn(email, password);
        router.push('/home');
      } catch (error) {
        console.error("Erro ao logar",error);
      }
    } else {
      alert('Preencha os campos de email e senha');
    }
  }

  return (
    <form className="w-full flex flex-col">
    <div className="relative w-full mb-4">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <EnvelopeIcon className="w-4 h-4 text-second-gray" />
      </div>
      <input
          className="w-full pl-10 py-3 input-login text-sm font-thin"
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div className="relative w-full mb-14">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <LockClosedIcon className="w-4 h-4 text-second-gray" />
        </div>
        <input
            className="w-full pl-10 py-3 input-login text-sm font-thin"
            id="Senha"
            type={showPassword ? "password" : "text"}
            name="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
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
      <button 
      type="button" 
      className="w-full py-3 bg-main-blue text-main-white hover:bg-blue-950 rounded-[10px] cursor-pointer" 
      onClick={handleLogin}
      >Login</button>
    </form>
  )
}