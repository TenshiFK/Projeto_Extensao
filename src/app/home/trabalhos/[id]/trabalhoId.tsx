'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseconfig";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

interface Trabalho {
  cliente: {
    id: string;
    nome: string;
  };
  orcamento?: {
    id: string;
    titulo: string;
  };
  titulo?: string;
  descricao: string;
  solucao: string;
  dataCriacao: string;
  garantia: string;
  statusOrdem: string;
  produtos?: {
    produto: string;
    quantidade: string;
    unidadeMedida?: string;
  }[];
  outros?: string;
  valorFrete?: string;
  valorTotal: string;
  pagamento: string;
  statusPagamento: string;
}

export default function TrabalhoDetalhes() {

  const { id } = useParams();
  const [trabalho, setTrabalho] = useState<Trabalho | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const trabalhoRef = doc(firestore, "Trabalhos", String(id));
        const snapshot = await getDoc(trabalhoRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setTrabalho({
            cliente: data.cliente || { id: "", nome: "Cliente não especificado" },
            orcamento: data.orcamento || { id: "", titulo: "" },
            descricao: data.descricao || "",
            titulo: data.titulo || "",
            solucao: data.solucao || "",
            dataCriacao: data.dataCriacao || "",
            garantia: data.garantia || "",
            statusOrdem: data.statusOrdem || "",
            produtos: data.produtos || [],
            outros: data.outros || "",
            valorFrete: data.valorFrete || "",
            valorTotal: data.valorTotal || "0",
            pagamento: data.pagamento || "",
            statusPagamento: data.statusPagamento || ""
          });
        } else {
          console.log("Trabalho não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        toast.error("Erro ao carregar trabalho");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen">
      <p className="mr-4 text-lg">
        Carregando...         
      </p>
      <svg className="animate-spin h-15 w-15 text-main-blue" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>;

  if (!trabalho) return <div>
      <div className="mb-4">
        <Link href="/home/trabalhos">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
        </Link>
      </div>
      Trabalho não encontrado.
    </div>;
  
    return (
      <main>
        <div className="mb-4">
        <Link href="/home/trabalhos">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
        </Link>
      </div>
      <h1 className={`mb-4 text-xl md:text-2xl font-semibold`}>
        Registros do Trabalho
      </h1>
        <div className="space-y-8">
          <div className="pb-14">
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
              <div className="col-span-6">
                <h2 className="text-base/7 font-semibold text-gray-900">Informações Gerais:</h2>
              </div>
              <div className="sm:col-span-3 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Título
                </p>
                <div className="mt-2 grid grid-cols-1">
                  <div
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                    {trabalho.titulo || " -"}
                  </div>
                </div>
              </div>  
              <div className="sm:col-span-3 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Cliente
                </p>
                <div className="mt-2 grid grid-cols-1">
                  <div
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                    {trabalho.cliente?.nome || " -"}
                  </div>
                </div>
              </div>
              <div className="sm:col-span-3 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Orçamento
                </p>
                <div className="mt-2 grid grid-cols-1">
                  <div
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                    {trabalho.orcamento?.titulo || " -"}
                  </div>
                </div>
              </div>

              <div className='hidden sm:block sm:col-span-2'></div>

              <div className="sm:col-span-3 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Descrição
                </p>
                <div className="mt-2">
                <textarea
                  id="solucao"
                  name="solucao"
                  rows={4}
                  readOnly
                  disabled
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm"
                  value={trabalho.descricao || " - "}
                  placeholder="Digite a solução aqui..."
                />
                </div>
              </div>

              <div className="sm:col-span-3 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Solução Proposta
                </p>
                <div className="mt-2">
                <textarea
                  id="solucao"
                  name="solucao"
                  rows={4}
                  readOnly
                  disabled
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm"
                  value={trabalho.solucao || " - "}
                  placeholder="Digite a solução aqui..."
                />
                </div>
              </div>

              <div className="sm:col-span-2 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Data de Criação
                </p>
                <div className="mt-2">
                  <div
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                    {trabalho.dataCriacao.split("-").reverse().join("/") || " -"}
                </div>
              </div>
              </div>

              <div className="sm:col-span-2 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                  Tempo de Garantia
                </p>
                <div className="mt-2 grid grid-cols-1">
                <div
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                    {trabalho.garantia || " -"}
                </div>  
              </div>
              </div>

              <div className="sm:col-span-2 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Status do trabalho
                </p>
                <div className="mt-2 grid grid-cols-1">
                  <div
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                    {trabalho.statusOrdem || " -"}
                  </div>
                </div>
              </div>

              <div className='col-span-6 mt-3'>
                <h2 className="text-base/7 font-semibold text-gray-900">Peças Utilizadas</h2>
              </div>

              <div className="sm:col-span-4 col-span-6">
                {
                  trabalho.produtos?.length === 0 ? (
                    <p className="text-sm/6 font-medium text-gray-900">Nenhum produto informado.</p>
                  ) : (
                    <table className='min-w-full'>
                      <thead className='bg-second-white'>
                        <tr>
                          <th className="text-left border border-main-blue px-1 py-1 text-main-blue">Produto</th>
                          <th className="text-left border border-main-blue px-1 py-1 text-main-blue">Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                      {trabalho.produtos?.map((item, index) => (
                          <tr key={index} className="border border-gray-950 bg-third-white">
                            <td className='border border-gray-950 px-1 py-1 bg-third-white'>{item.produto}</td>
                            <td className='border border-gray-950 px-1 py-1 bg-third-white'>{item.quantidade} {item.unidadeMedida}</td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  )
                }
              </div>

              <div className='hidden sm:block sm:col-span-2'></div>

              <div className="sm:col-span-2 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Outros
                </p>
                <div className="mt-2">
                  <div
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                    >
                    {trabalho.outros || " -"}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Valor do Frete
                </p>
                <div className="mt-2">
                  <div
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                    {trabalho.valorFrete || " -"}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Valor Total
                </p>
                <div className="mt-2">
                <div
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                >
                {trabalho.valorTotal || " -"}
                </div>
                </div>
              </div>

              <div className="sm:col-span-2 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Forma de Pagamento
                </p>
                <div className="mt-2 grid grid-cols-1">
                  <div
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                    {trabalho.pagamento || " -"}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Status do Pagamento
                </p>
                <div className="mt-2 grid grid-cols-1">
                  <div
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                      >
                    {trabalho.statusPagamento || " -"}
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    );
  }
