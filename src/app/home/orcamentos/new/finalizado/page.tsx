'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get } from "firebase/database";
import { database } from "@/app/services/firebase/firebaseconfig";
import Link from "next/link";
import ModalPDF from "@/app/components/modal/modalPDF";

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
  export default function OrcamentoFinalizado() {
  const { id } = useParams();
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalPDFOpen, setModalPDFOpen] = useState(false);

  const openModalPDF = () => {
    setModalPDFOpen(true);
  };

  const closeModalPDF = () => {
    setModalPDFOpen(false);
  };

  const exportarPDF = () => {
    // Lógica para exportar o PDF
    console.log("Exportando PDF...");
    closeModalPDF();
  };

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
      return <p>Carregando...</p>;
    }
  
    if (!orcamento) {
      return <p>Orçamento não encontrado.</p>;
    }
  
    return (
      <main>
        <h1 className="mb-4 text-xl md:text-2xl">Orçamento: {orcamento.titulo}</h1>
        <div>
          <p><strong>Cliente:</strong> {orcamento.cliente}</p>
          <p><strong>Data de Criacao:</strong> {orcamento.dataCriacao}</p>
          <p><strong>Garantia:</strong> {orcamento.garantia}</p>
          <p><strong>Descrição:</strong> {orcamento.descricao}</p>
          <p><strong>Descrição:</strong> {orcamento.solucao}</p>
          <p><strong>Produtos:</strong></p>
          <ul>
            {orcamento.produtos?.map((produto, index) => (
              <li key={index}>
                {produto.produto} - Quantidade: {produto.quantidade}
              </li>
            ))}
          </ul>
          <p><strong>Outros:</strong> {orcamento.outros}</p>
          <p><strong>Valor Frete:</strong> {orcamento.valorFrete}</p>
          <p><strong>Valor Total:</strong> {orcamento.valorTotal}</p>
        </div>
        <div className="flex justify-end mt-4">
          <button 
          onClick={openModalPDF}
          className="flex items-center gap-2 bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-4 rounded-[30px] cursor-pointer">
            Gerar Relatório
          </button>
        </div>
        <Link href="/home/orcamentos">
          <button className="border mt-2 px-2">Voltar</button>
        </Link>
        <ModalPDF isOpen={modalPDFOpen} onClose={closeModalPDF} onConfirm={exportarPDF} />
      </main>
    );
  }
