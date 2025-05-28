'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/services/firebase/firebaseconfig";
import NewEditProdutoForm from "@/app/components/forms/NewEditEstoque";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

interface Produto {
  nomeProduto: string;
  valor: string;
  dataCompra: string;
  localCompra?: string;
  quantidade: string;
  unidadeMedida?: string;
  fornecedor?: {
    id: string;
    nomeFornecedor: string;
  };
  descricao?: string;
}

export default function ProdutoEdit() {
  const { id } = useParams();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const produtoRef = doc(db, "Produtos", String(id));
        const produtoSnap = await getDoc(produtoRef);

        if (produtoSnap.exists()) {
          setProduto(produtoSnap.data() as Produto);
        } else {
          console.log("Produto não encontrado");
          toast.error("Produto não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        toast.error("Erro ao buscar os dados do produto.");
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

  if (!produto) return <div>
    <div className="mb-4">
        <Link href="/home/estoque">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer" />
        </Link>
      </div>
      Produto não encontrado.
    </div>;

  return (
    <main>
      <div className="mb-4">
        <Link href="/home/estoque">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer" />
        </Link>
      </div>
      <h1 className="mb-4 text-xl md:text-2xl font-semibold">
        Editar Produto
      </h1>
      <NewEditProdutoForm produto={produto} />
    </main>
  );
}
