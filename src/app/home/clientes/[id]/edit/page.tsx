'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get } from "firebase/database";
import { database } from "../../../../services/firebase/firebaseconfig";
import NewEditClientForm from "@/app/components/forms/NewEditClient";

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
  const { id } = useParams();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const snapshot = await get(ref(database, `Dados/${id}`));
        if (snapshot.exists()) {
          setCliente(snapshot.val());
        } else {
          console.log("Cliente não encontrado");
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

  if (!cliente) {
    return <div>Cliente não encontrado.</div>;
  }

  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        Editar Cliente
      </h1>
      <NewEditClientForm cliente={cliente} />
    </main>
  );
}
