'use client';

import Link from 'next/link';
import NavLinks from './nav-links';
import Logo from '../assets/imgs/Logo.png';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { useRouter } from 'next/navigation';


export default function SideNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout(); // Realiza o logout
      router.push('/'); // Redireciona para a página inicial
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  };

  return (
    <div className="flex h-full w-full flex-col py-4 bg-main-blue">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-md p-4 md:h-40"
        href="/home"
      >
        <Image src={Logo} alt="Logo" className='md:w-20 w-15'/>
      </Link>
      <button
        className="absolute left-4 top-4 z-50 block md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <XMarkIcon className="h-10 w-10 text-white" /> : <Bars3Icon className="h-10 w-10 text-white" />}
      </button>

      <div
        className={`flex grow flex-col justify-between md:pl-3 md:space-x-2 md:pt-0 fixed inset-y-0 left-0 z-40 w-64 bg-main-blue ps-4 pt-16 transition-transform duration-300 ease-in-out 
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
      >
        <button className='m-0' onClick={() => setMenuOpen(false)}><NavLinks/></button >
        
        <form className='flex flex-col items-center justify-center md:pr-3'>
          <button 
          className="cursor-pointer flex h-10 w-40 grow items-center justify-center gap-2 rounded-full bg-gray-50 p-3 text-sm font-medium hover:bg-blue-100 hover:text-blue-800 md:flex-none md:p-2 md:px-3"
          onClick={handleLogout}
          type='button'>
              <div className='text-base font-semibold'>Sair</div>
          </button>
        </form>
      </div>
      
    </div>
  );
}