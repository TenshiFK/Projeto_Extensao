'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get } from "firebase/database";
import { database } from "../../../../services/firebase/firebaseconfig";
import NewEditOrcamentoForm from "@/app/components/forms/NewEditOrcamento";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

interface Orcamento {
  titulo: string;
  cliente: {
    id: string;
    nome: string;
  },
  dataCriacao: string;
  garantia: string;
  descricao: string;
  solucao: string;
  produtos?: {
    produto: string;
    quantidade: string;
  }[];
  outros?: string;
  valorFrete?: string;
  valorTotal: string;
}

const DEFAULT_ORCAMENTO: Orcamento = {
  titulo: '',
  cliente: {
    id: '',
    nome: ''
  },
  dataCriacao: new Date().toISOString().split('T')[0], // Default to today's date
  garantia: '',
  descricao: '',
  solucao: '',
  valorTotal: '0', // Default to '0' instead of empty string
};

export default function Page() {
  const { id } = useParams();
  const [orcamento, setOrcamento] = useState<Orcamento>(DEFAULT_ORCAMENTO);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID do orçamento não fornecido");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const snapshot = await get(ref(database, `DadosOrcamentos/${id}`)); // Changed to DadosTrabalhos
        if (snapshot.exists()) {
          const data = snapshot.val();
          setOrcamento({
            ...DEFAULT_ORCAMENTO,
            ...data,
            valorTotal: data.valorTotal || '0'
          });
        } else {
          setError("Orçamento não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        setError("Erro ao carregar orçamento");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <main className="p-4">
      <div className="mb-4">
        <Link href="/home/orcamentos">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
        </Link>
      </div>
      <h1 className="mb-4 text-xl md:text-2xl font-semibold">
        Editar Orçamento
      </h1>
      <NewEditOrcamentoForm 
      orcamento={orcamento} 
      />
    </main>
  );
}
