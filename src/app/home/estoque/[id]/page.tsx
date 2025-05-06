'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get } from "firebase/database";
import { database } from "../../../services/firebase/firebaseconfig";
import Link from "next/link"; // Importação corrigida
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

// Definição do tipo para evitar erro de tipagem
interface Produto {
    nomeProduto: string,
    valor: string,
    dataCompra: string,
    localCompra?: string,
    quantidade: string,
    fornecedor?: {
      id: string;
      nomeFornecedor: string;
    },
    descricao?: string,
  }

export default function ProdutoDetalhes() {
  const { id } = useParams();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const snapshot = await get(ref(database, `DadosProdutos/${id}`));
        if (snapshot.exists()) {
          setProduto(snapshot.val());
        } else {
          console.log("Produto não encontrado");
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

  if (!produto) {
    return <p>Produto não encontrado.</p>;
  }

  return (
    <main>
      <div className="mb-4">
        <Link href="/home/estoque">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
        </Link>
      </div>
      <h1 className={`mb-4 text-xl md:text-2xl font-semibold`}>
        Registros do Produto
      </h1>
      <div className="space-y-8">
        <div className="pb-14">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="col-span-6">
              <h2 className="text-base/7 font-semibold text-gray-900">Informações do Produto:</h2>
            </div>  
            <div className="sm:col-span-3 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Nome do Produto
              </p>
              <div className="mt-2">
                <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                >
                  {produto.nomeProduto || " - "}
                </div>
              </div>
            </div>

            <div className="sm:col-span-3 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Valor do Produto
              </p>
              <div className="mt-2">
              <div
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                >
                  {produto.valor || " - "}
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Data de Compra
              </p>
              <div className="mt-2">
                <div
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                  {produto.dataCompra || " - "}
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Local da Compra
              </p>
              <div className="mt-2">
                <div
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                  {produto.localCompra || " - "}
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Quantidade
              </p>
              <div className="mt-2">
                <div
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                  {produto.quantidade || " - "}
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <p className="block text-sm/6 font-medium text-gray-900">
                Fornecedores
              </p>
              <div className="mt-2 grid grid-cols-1">
                <div
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                  {produto.fornecedor?.nomeFornecedor || " - "}
                </div>
              </div>
            </div>

            <div className='hidden sm:block sm:col-span-4'></div>

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
                value={produto.descricao || " - "}
              />
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
