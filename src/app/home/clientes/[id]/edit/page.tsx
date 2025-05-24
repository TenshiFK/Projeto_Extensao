'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../services/firebase/firebaseconfig";
import NewEditClientForm from "@/app/components/forms/NewEditClient";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

interface Cliente {
  nome: string;
  telefone: string;
  email: string;
  tipoCliente: string;
  endereco: string;
  bairro: string;
  cep: string;
  numero: string;
  complemento?: string;
}

export default function Page() {

  useEffect(() => {
    document.title = "Editar Cliente";
  }, []);
  
  const params = useParams();
  const id = params?.id as string;
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const clienteRef = doc(db, "Clientes", id);
        const snapshot = await getDoc(clienteRef);

        if (snapshot.exists()) {
          setCliente(snapshot.data() as Cliente);
        } else {
          console.log("Cliente não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        toast.error("Erro ao buscar os dados do cliente");
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

  if (!cliente) {
    return <div>
      <div className="mb-4">
        <Link href="/home/clientes">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer" />
        </Link>
      </div>
      Cliente não encontrado.
      </div>;
  }

  return (
    <main>
      <div className="mb-4">
        <Link href="/home/clientes">
          <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer" />
        </Link>
      </div>
      <h1 className="mb-4 text-xl md:text-2xl font-semibold">Editar Cliente</h1>
      <NewEditClientForm cliente={cliente} />
    </main>
  );
}
