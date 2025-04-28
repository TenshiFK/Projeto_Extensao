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
  const [loadingLogin, setLoadingLogin] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoadingLogin(true);

    if (email !== '' && password !== ''){
      try {
        await signIn(email, password);
        router.push('/home');
      } catch (error) {
        console.error("Erro ao logar",error);
      } finally {
        setLoadingLogin(false);
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
            type={showPassword ? "text" : "password"}
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
            <EyeIcon className="w-4 h-4 text-second-gray" />
          ) : (
            <EyeSlashIcon className="w-4 h-4 text-second-gray" />
          )}
        </button>
      </div>
      <button 
        type="button" 
        className={`w-full py-3 bg-main-blue text-main-white rounded-[10px] cursor-pointer flex justify-center items-center ${
          loadingLogin ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-950'
        }`} 
        onClick={handleLogin}
        disabled={loadingLogin}
      >
        {loadingLogin ? (
          <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        ) : (
          'Login'
        )}
      </button>
    </form>
  )
}