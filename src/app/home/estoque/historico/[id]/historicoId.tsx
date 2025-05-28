'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/services/firebase/firebaseconfig";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

interface MovimentacaoEstoque {
  id: string;
  produtoNome: string;
  tipo: 'Entrada' | 'Saída' | 'Exclusão';
  quantidade: number;
  data: string;
  origem: string;
  unidadeMedida?: string;
}

export default function HistoricoDetalhes() {

  const { id } = useParams();
  const [historico, setHistorico] = useState<MovimentacaoEstoque | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchHistorico = async () => {
      try {
        const docRef = doc(db, "DadosEstoque", String(id));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHistorico(docSnap.data() as MovimentacaoEstoque);
        } else {
          console.log("Histórico não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        toast.error("Erro ao buscar os dados do Histórico.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, [id]);

    const dataFormatada = historico?.data 
    ? new Date(historico.data).toLocaleDateString("pt-BR") 
    : " - ";

  if (loading) return <div className="flex justify-center items-center h-screen">
      <p className="mr-4 text-lg">
        Carregando...         
      </p>
      <svg className="animate-spin h-15 w-15 text-main-blue" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>;

  if (!historico) return <div>
      <div className="mb-4">
        <Link href="/home/estoque/historico">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer" />
        </Link>
      </div>
      Histórico não encontrado.
    </div>;

  return (
    <main>
      <div className="mb-4">
        <Link href="/home/estoque/historico">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
        </Link>
      </div>
      <h1 className={`mb-4 text-xl md:text-2xl font-semibold`}>
        Registros do Histórico
      </h1>
      <div className="space-y-8">
        <div className="pb-14">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-6">
            <div className="col-span-6">
              <h2 className="text-base/7 font-semibold text-gray-900">Informações do Histórico:</h2>
            </div>  
            <div className="md:col-span-3 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Nome do Produto
              </p>
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 md:text-sm/6"
                >
                  {historico.produtoNome || " - "}
                </div>
              </div>
            </div>

            <div className="md:col-span-3 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Tipo de Movimentação
              </p>
              <div className="mt-2">
              <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 md:text-sm/6"
                >
                  {historico.tipo || " - "}
                </div>
              </div>
            </div>

            <div className="md:col-span-3 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Data de Movimentação
              </p>
              <div className="mt-2">
                <div
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 md:text-sm/6"
                  >
                    {dataFormatada || " - "}
                </div>
              </div>
            </div>

            <div className="md:col-span-3 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Quantidade de Produtos Movimentada
              </p>
              <div className="mt-2">
                <div
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 md:text-sm/6"
                  >
                  {historico.quantidade || " - "} {historico.unidadeMedida || ""}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Origem da Movimentação
              </p>
              <div className="mt-2 grid grid-cols-1">
                <div
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 md:text-sm/6"
                  >
                  {historico.origem || " - "}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
