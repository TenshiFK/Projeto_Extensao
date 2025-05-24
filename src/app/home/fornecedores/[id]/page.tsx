'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/services/firebase/firebaseconfig"; // use 'db' se for Firestore
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

interface Fornecedor {
  nomeFornecedor: string,
  email?: string,
  telefone: string,
  endereco?: string,
  bairro?: string,
  cidade?: string,
  cep?: string,
  numero?: string,
  complemento?: string,
  informacoesAdicionais?: string,
}

export default function FornecedorDetalhes() {

  useEffect(() => {
    document.title = "Detalhes do Fornecedor";
  }, []);

  const { id } = useParams();
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const docRef = doc(db, "Fornecedores", String(id));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFornecedor(docSnap.data() as Fornecedor);
        } else {
          console.log("Fornecedor não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        toast.error("Erro ao buscar os dados do fornecedor.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  if (!fornecedor) {
    return <div>
      <div className="mb-4">
        <Link href="/home/fornecedores">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer" />
        </Link>
      </div>
      Fornecedor não encontrado.
    </div>;
  }

  return (
    <main>
      <div className="mb-4">
        <Link href="/home/fornecedores">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer" />
        </Link>
      </div>
      <h1 className={`mb-4 text-xl md:text-2xl font-semibold`}>
        Registros do Fornecedor
      </h1>
      <div className="space-y-8">
        <div className="pb-14">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="sm:col-span-full w-60">
              <h2 className="text-base/7 font-semibold text-gray-900">Informações Pessoais:</h2>
            </div>
            <div className="sm:col-span-3 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Nome do fornecedor
              </p>
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                >
                  {fornecedor.nomeFornecedor || " - "}
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
                  {fornecedor.email || " - "}
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
                  {fornecedor.telefone || " - "}
                </div>
              </div>
            </div>

            <div className='sm:col-span-full mt-3 w-60'>
              <h2 className="text-base/7 font-semibold text-gray-900">Endereço</h2>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Endereço
              </p>
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                >
                  {fornecedor.endereco || " - "}
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Bairro
              </p>
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                >
                  {fornecedor.bairro || " - "}
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Cidade
              </p>
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                >
                  {fornecedor.cidade || " - "}
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
                  {fornecedor.cep || " - "}
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
                  {fornecedor.numero || " - "}
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
                  {fornecedor.complemento || " - "}
                </div>
              </div>
            </div>

            <div className="col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Descrição
              </p>
              <div className="mt-2">
                <textarea
                  id="descricao"
                  name="descricao"
                  rows={4}
                  readOnly
                  disabled
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm"
                  value={fornecedor.informacoesAdicionais || " - "}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
