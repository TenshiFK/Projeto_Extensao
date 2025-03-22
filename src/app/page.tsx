'use client';
import Image from 'next/image';
import Img1 from './assets/imgs/img.png';
import { LoginForm } from './components/forms/Login';
import { auth } from "@/app/firebase/firebaseconfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

export default function Home() {

  const [user] = useAuthState(auth); //para autenticações, serve para prevenir usuarios não logados de ver a homepage.
  const router = useRouter()

  if(user){
    return router.push('home')
  }

    return (
        <div className="bg-body-blue flex h-screen flex-col md:flex-row md:overflow-hidden items-center justify-center p-10 sm:p-16">
          <div className='flex flex-col items-center justify-center'>
            <Image src={Img1} alt='Img-Home' className='w-80 sm:w-100'/>  
          </div>
          <div className='px-2 sm:px-14 py-4' />
          <div className='w-full sm:w-100 w-70 flex flex-col md:items-center md:justify-center md:text-center justify-start text-start'>
            <h1 className='text-main-blue sm:text-4xl text-xl font-semibold sm:pb-3 pb-2'>Faça seu login</h1>
            <p className='text-main-gray font-thin uppercase sm:pb-6 pb-3 sm:text-base text-sm'>Acesse o seu perfil</p>
            <LoginForm/>
          </div>
        </div>
    );
  }
  