'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../../services/firebase/firebaseconfig";
import NewEditOrcamentoForm from "@/app/components/forms/NewEditOrcamento";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

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
  dataCriacao: new Date().toISOString().split('T')[0],
  garantia: '',
  descricao: '',
  solucao: '',
  valorTotal: '0',
};

export default function Page() {

  useEffect(() => {
    document.title = "Editar Orçamento";
  }, []);

  const { id } = useParams();
  const [orcamento, setOrcamento] = useState<Orcamento>(DEFAULT_ORCAMENTO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const docRef = doc(firestore, "Orcamentos", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setOrcamento({
            ...DEFAULT_ORCAMENTO,
            ...data,
            valorTotal: data.valorTotal || '0',
          });
        } else {
          console.log("Orçamento não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        toast.error("Erro ao buscar os dados do orçamento.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <p className="mr-4 text-lg">
        Carregando...         
      </p>
      <svg className="animate-spin h-15 w-15 text-main-blue" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>;
  }

  if (!orcamento) return <div>
      <div className="mb-4">
          <Link href="/home/orcamentos">
            <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
          </Link>
        </div>
      Orçamento não encontrado.
  </div>;

  return (
    <main className="p-4">
      <div className="mb-4">
        <Link href="/home/orcamentos">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer" />
        </Link>
      </div>
      <h1 className="mb-4 text-xl md:text-2xl font-semibold">
        Editar Orçamento
      </h1>
      <NewEditOrcamentoForm orcamento={orcamento} />
    </main>
  );
}
