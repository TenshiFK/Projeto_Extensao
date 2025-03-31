'use client';
import { useEffect, useState } from "react";
import Tables from "@/app/components/tables/Tables";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { database } from "../../services/firebase/firebaseconfig"; // Importe sua configuração do Firebase

export default function Page() {
  const [clientes, setClientes] = useState<any[]>([]); // Estado para armazenar os dados dos clientes

  const titlesHead = [
    { name: 'Nome do cliente' },
    { name: 'Telefone/Celular' },
    { name: 'Email' },
    { name: 'Tipo de cliente' },
    { name: 'Ações' },
  ];

  useEffect(() => {
    const db = getDatabase(); // Acessa o banco de dados
    const clientesRef = ref(db, "Dados");

    // Função que será chamada para obter os dados do Firebase
    onValue(clientesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const clientesData = Object.entries(data).map(([key, value]) => ({
          id: key, // Usamos a chave como id
          nome: value.nome,
          telefone: value.telefone,
          email: value.email,
          tipoCliente: value.tipoCliente,
        }));
        setClientes(clientesData); // Atualiza o estado com os dados
      }
    });
  }, []);

  // Exclusao
  const handleDelete = (id: string) => {
    const db = getDatabase();
    const clienteRef = ref(db, `Dados/${id}`);
    remove(clienteRef)
      .then(() => {
        console.log("Cliente excluído com sucesso");
        setClientes(clientes.filter(cliente => cliente.id !== id)); // Atualiza a lista após exclusão
      })
      .catch((error) => {
        console.error("Erro ao excluir cliente:", error);
      });
  };

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
        <Tables titlesHead={titlesHead} dataBody={clientes} basePath="/clientes" onDelete={handleDelete}/>
      </div>
    </main>
  );
}