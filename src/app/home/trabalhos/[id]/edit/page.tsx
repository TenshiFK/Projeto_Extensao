'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get } from "firebase/database";
import { database } from "../../../../services/firebase/firebaseconfig";
import NewEditTrabalhoForm from "@/app/components/forms/NewEditTrabalho";

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

export default function Page() {
  const { id } = useParams();
  const [trabalho, setTrabalho] = useState<Trabalho | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const snapshot = await get(ref(database, `DadosTrabalhos/${id}`));
        if (snapshot.exists()) {
            setTrabalho(snapshot.val());
        } else {
          console.log("Trabalho não encontrado");
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

  if (!trabalho) {
    return <div>Trabalho não encontrado.</div>;
  }
    return (
      <main>
        <h1 className={`mb-4 text-xl md:text-2xl`}>
          Editar Trabalho
        </h1>
        <NewEditTrabalhoForm trabalho={trabalho}/>                                         
      </main>
    );
}