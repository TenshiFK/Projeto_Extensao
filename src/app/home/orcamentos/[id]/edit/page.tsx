'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get } from "firebase/database";
import { database } from "../../../../services/firebase/firebaseconfig";
import NewEditOrcamentoForm from "@/app/components/forms/NewEditOrcamento";

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

export default function Page() {
  const { id } = useParams();
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const snapshot = await get(ref(database, `Dados/${id}`));
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
    return <div>Carregando...</div>;
  }

  if (!orcamento) {
    return <div>Orçamento não encontrado.</div>;
  }

  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        Editar Orçamento
      </h1>
      <NewEditOrcamentoForm orcamento={orcamento} />
    </main>
  );
}
