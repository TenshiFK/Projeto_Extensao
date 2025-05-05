'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get } from "firebase/database";
import { database } from "../../../services/firebase/firebaseconfig";
import Link from "next/link";

interface Trabalho {
  cliente: {
      id: string;
      nome: string;
    },
    orcamento?: {
      id: string;
      titulo: string;
    },
    descricao: string,
    solucao: string,
    dataCriacao: string,
    garantia: string,
    statusOrdem: string,
    produtos?: {
      produto: string;
      quantidade: string;
    }[],
    outros?: string,
    valorFrete?: string,
    valorTotal: string,
    pagamento: string,
    statusPagamento: string,
}

  export default function TrabalhoDetalhes() {
  const { id } = useParams();
  const [trabalho, setTrabalho] = useState<Trabalho | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!id) return;
  
      const fetchData = async () => {
        try {
          const snapshot = await get(ref(database, `DadosTrabalhos/${id}`));
          if (snapshot.exists()) {
            const data = snapshot.val();
            setTrabalho({
              cliente: data.cliente || { id: '', nome: 'Cliente não especificado' },
              orcamento: data.orcamento || { id: '', titulo: '' },
              descricao: data.descricao || '',
              solucao: data.solucao || '',
              dataCriacao: data.dataCriacao || '',
              garantia: data.garantia || '',
              statusOrdem: data.statusOrdem || '',
              produtos: data.produtos || [],
              outros: data.outros || '',
              valorFrete: data.valorFrete || '',
              valorTotal: data.valorTotal || '0',
              pagamento: data.pagamento || '',
              statusPagamento: data.statusPagamento || ''
            });
          } else {
            setError("Trabalho não encontrado");
          }
        } catch (error) {
          console.error("Erro ao buscar os dados:", error);
          setError("Erro ao carregar trabalho");
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [id]);
  
    if (loading) {
      return <p>Carregando...</p>;
    }
  
    if (!trabalho) {
      return <p>Trabalho não encontrado.</p>;
    }
  
    return (
      <main>
        <h1 className="mb-4 text-xl md:text-2xl"> Cliente: {trabalho.cliente?.nome || "Cliente não especificado"}</h1>
        <div>
          <p><strong>Orçamento:</strong> {trabalho.orcamento ? trabalho.orcamento.titulo : "Não informado"}</p>
          <p><strong>Descrição:</strong> {trabalho.descricao || "Não informado"}</p>
          <p><strong>Solução:</strong> {trabalho.solucao || "Não informado"}</p>
          <p><strong>Data Criação:</strong> {trabalho.dataCriacao || "Não informado"}</p>
          <p><strong>Garantia:</strong> {trabalho.garantia || "Não informado"}</p>
          <p><strong>Status Ordem:</strong> {trabalho.statusOrdem || "Não informado"}</p>
          <p><strong>Produtos:</strong></p>
          <ul>
            {trabalho.produtos?.map((produto, index) => (
              <li key={index}>
                {produto.produto} - Quantidade: {produto.quantidade}
              </li>
            ))}
          </ul>
          <p><strong>Outros:</strong> {trabalho.outros}</p>
          <p><strong>Valor Frete:</strong> {trabalho.valorFrete}</p>
          <p><strong>Valor Total:</strong> {trabalho.valorTotal}</p>
          <p><strong>Pagamento:</strong> {trabalho.pagamento}</p>
          <p><strong>Status Pagamento:</strong> {trabalho.statusPagamento}</p>
        </div>
        <Link href="/home/trabalhos">
          <button className="border mt-2 px-2">Voltar</button>
        </Link>
      </main>
    );
  }
