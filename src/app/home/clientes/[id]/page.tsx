'use client';

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { database } from "../../../services/firebase/firebaseconfig";
import Link from "next/link";
import Tables from "@/app/components/tables/Tables";
import { ref, remove, get } from "firebase/database";
import Pagination from "@/app/components/Pagination";
import { paginate } from "@/app/lib/utils";
import Modal from "@/app/components/modal/modal";
import { PlusIcon } from "@heroicons/react/24/outline";

interface Cliente {
  nome: string;
  telefone: string;
  email: string;
  tipoCliente: string;
  endereco: string;
  bairro: string;
  cep: string;
  numero: string;
  complemento?: string;
}

export default function ClienteDetalhes() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Por enquanto, trabalhos é apenas um array vazio
  const trabalhos: any[] = [];

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const snapshot = await get(ref(database, `Dados/${id}`));
        if (snapshot.exists()) {
          setCliente(snapshot.val());
        } else {
          console.log("Cliente não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async (id: string) => {
    // Aqui no futuro você coloca a lógica para deletar trabalhos
    console.log("Deletar trabalho com id:", id);
  };

  const currentPage = parseInt(searchParams.get("page") || "1");
  const perPage = 15;
  const paginatedTrabalhos = paginate(trabalhos, currentPage, perPage);
  const totalPages = Math.ceil(trabalhos.length / perPage);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!cliente) {
    return <p>Cliente não encontrado.</p>;
  }

  return (
    <main className="p-4">
      <h1 className="mb-4 text-xl md:text-2xl font-bold">Cliente: {cliente.nome}</h1>
      <div className="mb-6">
        <p><strong>Telefone:</strong> {cliente.telefone}</p>
        <p><strong>Email:</strong> {cliente.email}</p>
        <p><strong>Tipo de Cliente:</strong> {cliente.tipoCliente}</p>
        <p><strong>Endereço:</strong> {cliente.endereco}</p>
        <p><strong>Bairro:</strong> {cliente.bairro}</p>
        <p><strong>CEP:</strong> {cliente.cep}</p>
        <p><strong>Número:</strong> {cliente.numero}</p>
        {cliente.complemento && <p><strong>Complemento:</strong> {cliente.complemento}</p>}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Trabalhos Realizados:</h2>
          <Link href="/home/trabalhos/new">
            <button className="flex items-center gap-2 bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-4 rounded-[30px] cursor-pointer">
              Novo Trabalho <PlusIcon className="w-6 h-6 text-main-white" />
            </button>
          </Link>
        </div>
        {trabalhos.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-10">
            Nada por aqui ainda!
          </div>
        ) : (
          <>
            <Tables titlesHead={titlesHead} dataBody={paginatedTrabalhos} basePath={`/clientes/${id}`} onDelete={openModal} />
            <div className="mt-6">
              <Pagination totalPages={totalPages} currentPage={currentPage} />
            </div>
          </>
        )}
      </div>

      <Link href="/home/clientes">
        <button className="border mt-6 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
          Voltar
        </button>
      </Link>

      <Modal isOpen={modalOpen} onClose={closeModal} onConfirm={confirmDelete} />
    </main>
  );
}
