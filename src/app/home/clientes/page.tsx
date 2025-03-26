import Tables from "@/app/components/tables/Tables";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";


export default async function Page() {

  const titlesHead = [
    {
      name: 'Nome do cliente',
    },
    {
      name: 'Telefone/Celular',
    },
    {
      name: 'Email',
    },
    {
      name: 'Tipo de cliente',
    },
    {
      name: 'Ações',
    },
]

const dataBody = [
  {
    id: 1,
    nome: 'João da Silva',
    telefone: '11 99999-9999',
    email: 'teste@teste.com',
    tipoCliente: 'Tercerizado',
  },
  {
    id: 2,
    nome: 'Maria da Silva',
    telefone: '11 99999-9999',
    email: '123@teste.com',
    tipoCliente: 'Tercerizado',
  },
  {
    id: 3,
    nome: 'José da Silva',
    telefone: '11 99999-9999',
    email: 'teste@teste.com',
    tipoCliente: 'Refrigeração',
  },
  {
    id: 4,
    nome: 'João da Silva',
    telefone: '11 99999-9999',
    email: 'teste@teste.com',
    tipoCliente: 'Tercerizado',
  },
  {
    id: 5,
    nome: 'Maria da Silva',
    telefone: '11 99999-9999',
    email: '',
    tipoCliente: 'Refrigeração',
  },
  {
    id: 6,
    nome: 'João da Silva',
    telefone: '11 99999-9999',
    email: 'teste@teste.com',
    tipoCliente: 'Tercerizado',
  },
  {
    id: 7,
    nome: 'Maria da Silva',
    telefone: '11 99999-9999',
    email: '123@teste.com',
    tipoCliente: 'Tercerizado',
  },
  {
    id: 8,
    nome: 'José da Silva',
    telefone: '11 99999-9999',
    email: 'teste@teste.com',
    tipoCliente: 'Refrigeração',
  },
  {
    id: 9,
    nome: 'João da Silva',
    telefone: '11 99999-9999',
    email: 'teste@teste.com',
    tipoCliente: 'Tercerizado',
  },
  {
    id: 10,
    nome: 'Maria da Silva',
    telefone: '11 99999-9999',
    email: '',
    tipoCliente: 'Refrigeração',
  }
]


    return (
        <main>
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-full md:w-60">
              <button className="bg-main-blue text-main-white md:text-base text-sm font-semibold py-2 px-5 rounded-[30px]">Filtrar por:</button>
            </div>
            <form className="w-full">
              <input className="px-4 md:w-[75%] w-full border" type="text" />
            </form>
            
            <div className="flex md:justify-end md:w-130 w-full">
              <Link href="/home/clientes/new">
                <button className="flex justify-center gap-2 bg-main-blue text-main-white md:text-base text-sm font-semibold py-2 px-4 rounded-[30px] cursor-pointer">Cadastrar novo cliente <PlusIcon className="w-6 h-6 text-main-white"/> </button> 
              </Link>
            </div>
            
          </div>
          <div className="mt-16">
            <Tables titlesHead={titlesHead} dataBody={dataBody} basePath="/clientes"/>
          </div>
        </main>
    );
}