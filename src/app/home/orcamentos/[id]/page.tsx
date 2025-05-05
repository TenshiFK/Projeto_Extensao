'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get } from "firebase/database";
import { database } from "../../../services/firebase/firebaseconfig";
import Link from "next/link";

interface Orcamento {
    titulo: string,
    cliente: string,
    dataCriacao: string,
    garantia: string,
    descricao: string,
    solucao: string,
    produtos?: {
      produto: string;
      quantidade: string;
    }[],
    outros?: string,
    valorFrete?: string,
    valorTotal: string,
  }
  export default function OrcamentoDetalhes() {
  const { id } = useParams();
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!id) return;
  
      const fetchData = async () => {
        try {
          const snapshot = await get(ref(database, `DadosOrcamentos/${id}`));
          if (snapshot.exists()) {
            setOrcamento(snapshot.val());
          } else {
            console.log("Orçamento não encontrado");
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
  
    if (!orcamento) {
      return <p>Orçamento não encontrado.</p>;
    }
  
    return (
      <main>
        <h1 className="mb-4 text-xl md:text-2xl">Orçamento: {orcamento.titulo}</h1>
        <div>
          <p><strong>Cliente:</strong> {orcamento.cliente}</p>
          <p><strong>Data de Criacao:</strong> {orcamento.dataCriacao}</p>
          <p><strong>Garantia:</strong> {orcamento.garantia}</p>
          <p><strong>Descrição:</strong> {orcamento.descricao}</p>
          <p><strong>Descrição:</strong> {orcamento.solucao}</p>
          <p><strong>Produtos:</strong></p>
          <ul>
            {orcamento.produtos?.map((produto, index) => (
              <li key={index}>
                {produto.produto} - Quantidade: {produto.quantidade}
              </li>
            ))}
          </ul>
          <p><strong>Outros:</strong> {orcamento.outros}</p>
          <p><strong>Valor Frete:</strong> {orcamento.valorFrete}</p>
          <p><strong>Valor Total:</strong> {orcamento.valorTotal}</p>
        </div>
        <Link href="/home/orcamentos">
          <button className="border mt-2 px-2">Voltar</button>
        </Link>
      </main>
    );
  }
