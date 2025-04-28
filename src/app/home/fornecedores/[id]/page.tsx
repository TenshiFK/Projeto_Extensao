'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get } from "firebase/database";
import { database } from "../../../services/firebase/firebaseconfig";
import Link from "next/link";

interface Fornecedor {
    nomeFornecedor: string,
    email?: string,
    telefone: string,
    endereco?: string,
    bairro?: string,
    cidade?: string,
    cep?: string,
    numero?: string,
    complemento?: string,
    informacoesAdicionais?: string,
  }

  export default function FornecedorDetalhes() {
    const { id } = useParams();
    const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (!id) return;
  
      const fetchData = async () => {
        try {
          const snapshot = await get(ref(database, `Dados/${id}`));
          if (snapshot.exists()) {
            setFornecedor(snapshot.val());
          } else {
            console.log("Produto não encontrado");
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
      return <p>Carregando...</p>;
    }
  
    if (!fornecedor) {
      return <p>Fornecedor não encontrado.</p>;
    }
  
    return (
      <main>
        <h1 className="mb-4 text-xl md:text-2xl">Fornecedor: {fornecedor.nomeFornecedor}</h1>
        <div>
          <p><strong>E-mail:</strong> {fornecedor.email}</p>
          <p><strong>Telefone/Celular:</strong> {fornecedor.telefone}</p>
          <p><strong>Endereço:</strong> {fornecedor.endereco}</p>
          <p><strong>Bairro:</strong> {fornecedor.bairro}</p>
          <p><strong>Cidade:</strong> {fornecedor.cidade}</p>
          <p><strong>CEP:</strong> {fornecedor.cep}</p>
          <p><strong>Número:</strong> {fornecedor.numero}</p>
          <p><strong>Complemento:</strong> {fornecedor.complemento}</p>
          <p><strong>Informações Adicionais:</strong> {fornecedor.informacoesAdicionais}</p>
        </div>
        <Link href="/home/fornecedores">
          <button className="border mt-2 px-2">Voltar</button>
        </Link>
      </main>
    );
  }
