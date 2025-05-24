'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../../services/firebase/firebaseconfig";
import NewEditTrabalhoForm from "@/app/components/forms/NewEditTrabalho";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

interface Trabalho {
  cliente: {
    id: string;
    nome: string;
  };
  orcamento?: {
    id: string;
    titulo: string;
  };
  descricao: string;
  solucao: string;
  dataCriacao: string;
  garantia: string;
  statusOrdem: string;
  produtos?: {
    produto: string;
    quantidade: string;
  }[];
  outros?: string;
  valorFrete?: string;
  valorTotal: string;
  pagamento: string;
  statusPagamento: string;
}

export default function Page() {

  useEffect(() => {
    document.title = "Editar Trabalho";
  }, []);

  const { id } = useParams();
  const [trabalho, setTrabalho] = useState<Trabalho | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const trabalhoRef = doc(firestore, "Trabalhos", String(id));
        const snapshot = await getDoc(trabalhoRef);

        if (snapshot.exists()) {
          setTrabalho(snapshot.data() as Trabalho);
        } else {
          console.log("Trabalho não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        toast.error("Erro ao buscar os dados do trabalho.");
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

  if (!trabalho) {
    return <div>
      <div className="mb-4">
        <Link href="/home/trabalhos">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
        </Link>
      </div>
      Trabalho não encontrado.
    </div>;
  }

  return (
    <main>
      <div className="mb-4">
        <Link href="/home/trabalhos">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer" />
        </Link>
      </div>
      <h1 className="mb-4 text-xl md:text-2xl font-semibold">Editar Trabalho</h1>
      <NewEditTrabalhoForm trabalho={trabalho} />
    </main>
  );
}
