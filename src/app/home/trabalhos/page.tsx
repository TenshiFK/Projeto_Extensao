"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tables from "@/app/components/tables/Tables";
import Search from "@/app/components/forms/Search";
import Pagination from "@/app/components/Pagination";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../../services/firebase/firebaseconfig";
import { paginate } from "@/app/lib/utils";
import Modal from "@/app/components/modal/modal";
import ModalPDF from "@/app/components/modal/modalPDF";

interface Trabalho {
  id: string;
  nome: string;
  valor: string;
  statusOrdem: string;
  dataCriacao: string;
  [key: string]: string | number | null;
}

export default function Page() {
    const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
  
    const searchTerm = searchParams.get("search") || "";
    const tipoFiltro = searchParams.get("status") || "";

    const [modalOpen, setModalOpen] = useState(false);
    const [modalPDFOpen, setModalPDFOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
    const openModal = (id: string) => {
      setItemToDelete(id);
      setModalOpen(true);
    };

    const openModalPDF = () => {
      setModalPDFOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
      setItemToDelete(null);
    };

    const closeModalPDF = () => {
      setModalPDFOpen(false);
    };
  
    const confirmDelete = () => {
      if (itemToDelete) {
        handleDelete(itemToDelete);
      }
      closeModal();
    };

    const exportarPDF = () => {
      // Lógica para exportar o PDF
      console.log("Exportando PDF...");
      closeModalPDF();
    };
  
    const titlesHead = [
      { name: 'Nome do cliente' },
      { name: 'Valor(R$)' },
      { name: 'Status da Ordem' },
      { name: 'Data de Criação' },
      { name: 'Ações' },
    ];

    useEffect(() => {
      const trabalhosRef = ref(database, "DadosTrabalhos");
      const unsubscribe = onValue(trabalhosRef, (snapshot) => {
        try {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const trabalhosData: Trabalho[] = Object.entries(data).map(([key, value]: [string, any]) => ({
              id: key,
              nome: value.cliente?.nome || "Não informado", // Handle both cases
              valor: value.valorTotal || "Não informado",
              statusOrdem: value.statusOrdem || "Não informado",
              dataCriacao: value.dataCriacao && value.dataCriacao !== "Não informado"
              ? new Date(value.dataCriacao).toLocaleDateString("pt-BR")
              : "Não informado",
            }));
            setTrabalhos(trabalhosData);
          } else {
            setTrabalhos([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      });
      return () => unsubscribe();
    }, []);
    
      const handleDelete = async (id: string) => {
        try {
          const trabalhosRef = ref(database, `DadosTrabalhos/${id}`);
          await remove(trabalhosRef);
          setTrabalhos(prevTrabalhos => prevTrabalhos.filter(trabalho => trabalho.id !== id));
        } catch (error) {
          console.error("Erro ao excluir Trabalho:", error);
        }
      };
    
      // Atualiza os parâmetros da URL
      const updateSearchParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
        router.push(`?${params.toString()}`);
      };
    
      const filteredTrabalhos = trabalhos.filter(trabalho => {
        const matchesSearch =
          trabalho.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trabalho.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trabalho.statusOrdem.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trabalho.dataCriacao.toLowerCase().includes(searchTerm.toLowerCase());
      
        const matchesTipo = tipoFiltro
          ? trabalho.statusOrdem.toLowerCase() === tipoFiltro.toLowerCase()
          : true;
      
        return matchesSearch && matchesTipo;
      });
    
      const currentPage = parseInt(searchParams.get("page") || "1");
      const perPage = 15;
      const paginatedTrabalhos = paginate(filteredTrabalhos, currentPage, perPage);
      const totalPages = Math.ceil(filteredTrabalhos.length / perPage);
    

    return (
      <main>
      <div className="grid lg:grid-cols-6 gap-4">
        <div className="lg:col-span-1 flex items-center">
          <select
            id="statusOrdem"
            name="statusOrdem"
            className="appearance-none text-center cursor-pointer bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-5 rounded-[30px] w-full"
            value={tipoFiltro}
            onChange={(e) => updateSearchParams("status", e.target.value)}
          >
            <option value="">Filtrar</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Apenas Orçado">Apenas Orçado</option>
          </select>
        </div>
        <Search searchTerm={searchTerm} onSearchChange={(value) => updateSearchParams("search", value)} />
        <div className="col-span-6 lg:col-span-2 flex justify-end w-full gap-2">
          <button 
          onClick={openModalPDF}
          className="flex items-center gap-2 bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-4 rounded-[30px] cursor-pointer">
            Gerar Relatório
          </button>
          <Link href="/home/trabalhos/new">
            <button className="flex items-center gap-2 bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-4 rounded-[30px] cursor-pointer">
              Novo Trabalho <PlusIcon className="w-6 h-6 text-main-white" />
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-16">
        <Tables titlesHead={titlesHead} dataBody={paginatedTrabalhos} basePath="/trabalhos" onDelete={openModal} />
        <div className="mt-6">
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </div>
      <Modal isOpen={modalOpen} onClose={closeModal} onConfirm={confirmDelete} />
      <ModalPDF isOpen={modalPDFOpen} onClose={closeModalPDF} onConfirm={exportarPDF} />
    </main>
    );
}