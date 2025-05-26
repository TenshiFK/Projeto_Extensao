'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { db, firestore } from '../../../services/firebase/firebaseconfig';
import Link from 'next/link';
import Tables from '@/app/components/tables/Tables';
import { doc, getDoc, collection, query, where, onSnapshot, deleteDoc } from 'firebase/firestore';
import Pagination from '@/app/components/Pagination';
import { paginate } from '@/app/lib/utils';
import Modal from '@/app/components/modal/modal';
import { ArrowLeftCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

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
  id: string;
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
  const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);
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

  const clienteId = Array.isArray(id) ? id[0] : id;
  
  useEffect(() => {
    if (!clienteId) return;
  
    const fetchCliente = async () => {
      try {
        const clienteRef = doc(db, "Clientes", clienteId);
        const docSnap = await getDoc(clienteRef);
  
        if (docSnap.exists()) {
          setCliente(docSnap.data() as Cliente);
        } else {
          console.log("Cliente não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        toast.error("Erro ao buscar cliente");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCliente();
  }, [clienteId]);
  

  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, 'Trabalhos'),
      where('cliente.id', '==', id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const trabalhosData: Trabalho[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          trabalhoId: doc.id,
          nome: data.cliente?.nome || ' - ',
          valor: data.valorTotal || ' - ',
          statusOrdem: data.statusOrdem || ' - ',
          dataCriacao: data.dataCriacao
            ? new Date(data.dataCriacao).toLocaleDateString('pt-BR')
            : ' - ',
        };
      });
      setTrabalhos(trabalhosData);
    });

    return () => unsubscribe();
  }, [id]);

  const handleDelete = async (id: string) => {
        try {
      const trabalhoRef = doc(firestore, "Trabalhos", id);
      await deleteDoc(trabalhoRef);
      setTrabalhos((prevTrabalhos) =>
        prevTrabalhos.filter((trabalho) => trabalho.id !== id)
      );
      toast.success("Trabalho excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir Trabalho:", error);
      toast.error("Erro ao excluir Trabalho. Tente novamente.");
    }
  };

  const currentPage = parseInt(searchParams.get('page') || '1');
  const perPage = 15;
  const paginatedTrabalhos = paginate(trabalhos, currentPage, perPage);
  const totalPages = Math.ceil(trabalhos.length / perPage);

    if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <p className="mr-4 text-lg">
        Carregando...         
      </p>
      <svg className="animate-spin h-15 w-15 text-main-blue" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>;
  }

  if (!cliente) {
    return <div>
      <div className="mb-4">
        <Link href="/home/clientes">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer" />
        </Link>
      </div>
      Cliente não encontrado.
      </div>;
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
