'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../services/firebase/firebaseconfig";
import NewEditFornecedoresForm from "@/app/components/forms/NewEditFornecedores";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

interface Fornecedor {
  nomeFornecedor: string;
  email?: string;
  telefone: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  numero?: string;
  complemento?: string;
  informacoesAdicionais?: string;
}

export default function Page() {

  useEffect(() => {
    document.title = "Editar Fornecedor";
  }, []);

  const { id } = useParams();
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const fornecedorRef = doc(db, "Fornecedores", id as string);
        const fornecedorSnap = await getDoc(fornecedorRef);

        if (fornecedorSnap.exists()) {
          setFornecedor(fornecedorSnap.data() as Fornecedor);
        } else {
          console.log("Fornecedor não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        toast.error("Erro ao buscar os dados do fornecedor.");
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

  if (!fornecedor) {
    return <div>
      <div className="mb-4">
        <Link href="/home/fornecedores">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer" />
        </Link>
      </div>
      Fornecedor não encontrado.
    </div>;
  }

  return (
    <main>
      <div className="mb-4">
        <Link href="/home/fornecedores">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer" />
        </Link>
      </div>
      <h1 className="mb-4 text-xl md:text-2xl font-semibold">
        Editar Fornecedor
      </h1>
      <NewEditFornecedoresForm fornecedor={fornecedor} />
    </main>
  );
}
