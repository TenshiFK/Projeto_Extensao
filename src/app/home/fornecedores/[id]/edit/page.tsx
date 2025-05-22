'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../services/firebase/firebaseconfig";
import NewEditFornecedoresForm from "@/app/components/forms/NewEditFornecedores";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!fornecedor) {
    return <div>Fornecedor não encontrado.</div>;
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
