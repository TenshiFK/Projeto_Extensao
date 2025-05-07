'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get } from "firebase/database";
import { database } from "../../../services/firebase/firebaseconfig";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

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
    const { id } = useParams();
    const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (!id) return;
  
      const fetchData = async () => {
        try {
          const snapshot = await get(ref(database, `DadosFornecedores/${id}`));
          if (snapshot.exists()) {
            setFornecedor(snapshot.val());
          } else {
            console.log("Fornecedor não encontrado");
          }
        } catch (error) {
          console.error("Erro ao buscar os dados:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [id]);
  
    if (loading) {
      return <p>Carregando...</p>;
    }
  
    if (!fornecedor) {
      return <p>Fornecedor não encontrado.</p>;
    }
  
    return (
      <main>
        <div className="mb-4">
          <Link href="/home/fornecedores">
            <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
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
