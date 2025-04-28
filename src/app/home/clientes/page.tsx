'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tables from "@/app/components/tables/Tables";
import Search from "@/app/components/forms/Search";
import Pagination from "@/app/components/Pagination";
import Modal from "@/app/components/modal/modal";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../../services/firebase/firebaseconfig";
import { paginate } from "@/app/lib/utils";

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  tipoCliente: string;
  [key: string]: string | number | null;
}

export default function Page() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const tipoFiltro = searchParams.get("tipo") || "";

  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const openModal = (id: string) => {
    setItemToDelete(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      handleDelete(itemToDelete);
    }
    closeModal();
  };

  const titlesHead = [
    { name: 'Nome do cliente' },
    { name: 'Telefone/Celular' },
    { name: 'Email' },
    { name: 'Tipo de cliente' },
    { name: 'Ações' },
  ];

  useEffect(() => {
    const clientesRef = ref(database, "Dados");

    const unsubscribe = onValue(clientesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const clientesData: Cliente[] = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          nome: value.nome,
          telefone: value.telefone,
          email: value.email,
          tipoCliente: value.tipoCliente,
        }));
        setClientes(clientesData);
      } else {
        setClientes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const clienteRef = ref(database, `Dados/${id}`);
      await remove(clienteRef);
      setClientes(prevClientes => prevClientes.filter(cliente => cliente.id !== id));
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  };

  // Atualiza os parâmetros da URL
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch =
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefone.includes(searchTerm) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.tipoCliente.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = tipoFiltro
      ? cliente.tipoCliente.toLowerCase() === tipoFiltro.toLowerCase()
      : true;

    return matchesSearch && matchesTipo;
  });

  const currentPage = parseInt(searchParams.get("page") || "1");
  const perPage = 15;
  const paginatedClientes = paginate(filteredClientes, currentPage, perPage);
  const totalPages = Math.ceil(filteredClientes.length / perPage);

  return (
    <main>
      <div className="grid lg:grid-cols-6 gap-4">
        <div className="lg:col-span-1 flex items-center">
          <select
            id="tipoCliente"
            name="tipoCliente"
            className="appearance-none text-center cursor-pointer bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-5 rounded-[30px] w-full"
            value={tipoFiltro}
            onChange={(e) => updateSearchParams("tipo", e.target.value)}
          >
            <option value="">Filtrar:</option>
            <option value="Refrigeração">Refrigeração</option>
            <option value="Tercerizado">Tercerizado</option>
          </select>
        </div>
        <Search searchTerm={searchTerm} onSearchChange={(value) => updateSearchParams("search", value)} />
        <div className="col-span-6 lg:col-span-2 flex justify-end w-full">
          <Link href="/home/clientes/new">
            <button className="flex items-center gap-2 bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-4 rounded-[30px] cursor-pointer">
              Novo cliente <PlusIcon className="w-6 h-6 text-main-white" />
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-16">
      {filteredClientes.length === 0 ? (
        <div className="h-screen md:h-100 text-center text-gray-500 text-lg py-10 justify-center items-center flex">
          Nada por aqui ainda!
        </div>
      ) : (
        <>
          <Tables titlesHead={titlesHead} dataBody={paginatedClientes} basePath="/clientes" onDelete={openModal} />
          <div className="mt-6">
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        </>
      )}
      </div>
      <Modal isOpen={modalOpen} onClose={closeModal} onConfirm={confirmDelete} />
    </main>
  );
}