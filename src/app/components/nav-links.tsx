'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
    { 
    name: 'Clientes', 
    href: '/home/clientes', 
    },
    {
    name: 'Trabalhos Realizados',
    href: '/home/trabalhos',
    
    },
    { 
    name: 'Orçamentos', 
    href: '/home/orcamentos', 
     
    },
    {
    name: 'Estoque', 
    href: '/home/estoque', 
    
    },    
    { 
    name: 'Fornecedores',
    href: '/home/fornecedores',  
    },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx( 
              'flex h-[48px] grow items-center gap-2 rounded-l-[10px] text-gray-50 p-3 text-base font-medium hover:bg-second-blue/10 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-second-blue/10 text-gray-50': pathname === link.href,
              },
            )}
            >
            <p>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
