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

interface Orcamentos {
  id: string;
  nome: string;
  valor: string;
  garantia: string;
  dataCriacao: string;
  [key: string]: string | number | null;
}

export default function Page() {
    const [orcamentos, setOrcamento] = useState<Orcamentos[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
  
    const searchTerm = searchParams.get("search") || "";
    const tipoFiltro = searchParams.get("tipo") || "";

    const [modalOpen, setModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
    const openModal = (id: string) => {
      setItemToDelete(id);
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
      setItemToDelete(null);
    };
  
    const confirmDelete = () => {
      if (itemToDelete) {
        handleDelete(itemToDelete);
      }
      closeModal();
    };
  
    const titlesHead = [
      { name: 'Nome do cliente' },
      { name: 'Valor' },
      { name: 'Tempo de garantia' },
      { name: 'Data de Criação' },
      { name: 'Ações' },
    ];

    useEffect(() => {
        const orcamentosRef = ref(database, "Dados");
    
        const unsubscribe = onValue(orcamentosRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const orcamentosData: Orcamentos[] = Object.entries(data).map(([key, value]: [string, any]) => ({
              id: key,
              nome: value.nome,
              garantia: value.garantia,
              dataCriacao: value.dataCriacao,
              valor: value.valor,
            }));
            setOrcamento(orcamentosData);
          } else {
            setOrcamento([]);
          }
        });
    
        return () => unsubscribe();
      }, []);
    
      const handleDelete = async (id: string) => {
        try {
          const orcamentosRef = ref(database, `Dados/${id}`);
          await remove(orcamentosRef);
          setOrcamento(prevOrcanentos => prevOrcanentos.filter(orcamento => orcamento.id !== id));
        } catch (error) {
          console.error("Erro ao excluir Orçamento:", error);
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
    
      const filteredOrcamentos = orcamentos.filter(orcamento => {
        const matchesSearch =
        orcamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orcamento.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orcamento.garantia.includes(searchTerm) ||
        orcamento.dataCriacao.toLowerCase().includes(searchTerm.toLowerCase());
    
        const matchesTipo = tipoFiltro
          ? orcamento.garantia.toLowerCase() === tipoFiltro.toLowerCase()
          : true;
    
        return matchesSearch && matchesTipo;
      });
    
      const currentPage = parseInt(searchParams.get("page") || "1");
      const perPage = 15;
      const paginatedOrcamentos = paginate(filteredOrcamentos, currentPage, perPage);
      const totalPages = Math.ceil(filteredOrcamentos.length / perPage);
    

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
            <option value="">Filtrar:</option>
            <option value="umMes">1 meses</option>
            <option value="tresMeses">3 meses</option>
            <option value="seisMeses">6 meses</option>
            <option value="umAno">1 ano</option>
          </select>
        </div>
        <Search searchTerm={searchTerm} onSearchChange={(value) => updateSearchParams("search", value)} />
        <div className="col-span-6 lg:col-span-2 flex justify-end w-full">
          <Link href="/home/orcamentos/new">
            <button className="flex items-center gap-2 bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-4 rounded-[30px] cursor-pointer">
              Novo Orçamento <PlusIcon className="w-6 h-6 text-main-white" />
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-16">
        <Tables titlesHead={titlesHead} dataBody={paginatedOrcamentos} basePath="/orcamentos" onDelete={openModal} />
        <div className="mt-6">
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </div>
      <Modal isOpen={modalOpen} onClose={closeModal} onConfirm={confirmDelete} />
    </main>
    );
}