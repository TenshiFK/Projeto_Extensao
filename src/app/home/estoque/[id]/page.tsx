'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get } from "firebase/database";
import { database } from "../../../services/firebase/firebaseconfig";
import Link from "next/link"; // Importação corrigida

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
      <h1 className="mb-4 text-xl md:text-2xl">Produto: {produto.nomeProduto}</h1>
      <div>
        <p><strong>Valor:</strong> {produto.valor}</p>
        <p><strong>Data da Compra:</strong> {produto.dataCompra}</p>
        <p><strong>Local da Compra:</strong> {produto.localCompra}</p>
        <p><strong>Quantidade:</strong> {produto.quantidade}</p>
        <p><strong>Fornecedor:</strong> {produto.fornecedor?.nomeFornecedor}</p>
      </div>
      <Link href="/home/estoque">
        <button className="border mt-2 px-2">Voltar</button>
      </Link>
    </main>
  );
}
