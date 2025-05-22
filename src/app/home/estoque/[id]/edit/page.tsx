'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/services/firebase/firebaseconfig";
import NewEditProdutoForm from "@/app/components/forms/NewEditEstoque";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

interface Produto {
  nomeProduto: string;
  valor: string;
  dataCompra: string;
  localCompra?: string;
  quantidade: string;
  fornecedor?: {
    id: string;
    nomeFornecedor: string;
  };
  descricao?: string;
}

export default function Page() {
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
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Carregando...</div>;

  if (!produto) return <div>Produto não encontrado.</div>;

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
