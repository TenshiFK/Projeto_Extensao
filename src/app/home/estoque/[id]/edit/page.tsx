'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get } from "firebase/database";
import { database } from "../../../../services/firebase/firebaseconfig";
import NewEditProdutoForm from "@/app/components/forms/NewEditEstoque";

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

export default function Page() {
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
    return <div>Carregando...</div>;
  }

  if (!produto) {
    return <div>Produto não encontrado.</div>;
  }

  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        Editar Produto
      </h1>
      <NewEditProdutoForm produto={produto} />
    </main>
  );
}
