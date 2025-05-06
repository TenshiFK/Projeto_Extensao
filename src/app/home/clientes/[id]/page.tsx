'use client';

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { database } from "../../../services/firebase/firebaseconfig";
import Link from "next/link";
import Tables from "@/app/components/tables/Tables";
import { ref, get, onValue } from "firebase/database";
import Pagination from "@/app/components/Pagination";
import { paginate } from "@/app/lib/utils";
import Modal from "@/app/components/modal/modal";
import { ArrowLeftCircleIcon, PlusIcon } from "@heroicons/react/24/outline";

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

interface Trabalho {
  trabalhoId: string;
  nome: string;
  valor: string;
  statusOrdem: string;
  dataCriacao: string;
  [key: string]: string | number | null;
}

export default function ClienteDetalhes() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [trabalhos, setTrabalhos] = useState<any[]>([]);
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
    { name: 'Valor(R$)' },
    { name: 'Status da Ordem' },
    { name: 'Data de Criação' },
    { name: 'Ações' },
  ];

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

  useEffect(() => {
    const trabalhosRef = ref(database, "DadosTrabalhos");
    const unsubscribe = onValue(trabalhosRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const trabalhosData: Trabalho[] = Object.entries(data)
            .filter(([_, value]: [string, any]) => value.cliente?.id === id)
            .map(([key, value]: [string, any]) => ({
              trabalhoId: key,
              nome: value.cliente?.nome || " - ",
              valor: value.valorTotal || " - ",
              statusOrdem: value.statusOrdem || " - ",
              dataCriacao: value.dataCriacao && value.dataCriacao !== " - "
                ? new Date(value.dataCriacao).toLocaleDateString("pt-BR")
                : " - ",
            }));
          setTrabalhos(trabalhosData);
        } else {
          setTrabalhos([]);
        }
      } catch (error) {
        console.error("Erro ao buscar trabalhos do cliente:", error);
      }
    });
  
    return () => unsubscribe();
  }, [id]); // 👈 não esqueça de colocar o id como dependência
  

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
    <main>
      <div className="mb-4">
        <Link href="/home/clientes">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
        </Link>
      </div>
      <h1 className={`mb-4 text-xl md:text-2xl font-semibold`}>
        Registros do Cliente
      </h1>
      <div className="space-y-8">
        <div className="pb-14">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="sm:col-span-full w-60">
              <h2 className="text-base/7 font-semibold text-gray-900">Informações Pessoais:</h2>
            </div>  
            <div className="sm:col-span-3 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Nome do cliente
              </p>
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                  {cliente.nome || " - "}
                  </div>
              </div>
            </div>
            <div className="sm:col-span-3 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                  E-mail
              </p>
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                    {cliente.email || " - "}
                  </div>
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Telefone/Celular
              </p>
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                  {cliente.telefone || " - "}
                  </div>
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Tipo de Cliente
              </p>
              <div className="mt-2 grid grid-cols-1">
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                  {cliente.tipoCliente || " - "}
                </div>
              </div>
              </div>
            </div>

            <div className='sm:col-span-full mt-3 w-60'>
              <h2 className="text-base/7 font-semibold text-gray-900">Endereço</h2>
            </div>

            <div className="col-span-3 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Endereço
              </p>
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                  {cliente.endereco || " - "}
                  </div>
              </div>
            </div>

            <div className="col-span-3 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Bairro
              </p>
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                  {cliente.bairro || " - "}
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                CEP
              </p>
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                  {cliente.cep || " - "}
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Número
              </p>
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                  {cliente.numero || " - "}
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Complemento
              </p>
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                  {cliente.complemento || " - "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-10">
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
            <Tables titlesHead={titlesHead} dataBody={paginatedTrabalhos} basePath={`/trabalhos`} onDelete={openModal} />
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
