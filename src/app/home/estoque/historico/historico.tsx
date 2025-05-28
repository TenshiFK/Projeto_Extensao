"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, getDocs, query, deleteDoc, doc, orderBy } from "firebase/firestore";
import { db, } from "@/app/services/firebase/firebaseconfig";
import Tables from "@/app/components/tables/Tables";
import Search from "@/app/components/forms/Search";
import Pagination from "@/app/components/Pagination";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Modal from "@/app/components/modal/modal";
import { paginate } from "@/app/lib/utils";
import { toast } from "react-toastify";

interface MovimentacaoEstoque {
  id: string;
  produtoNome: string;
  tipo: 'Entrada' | 'Saída' | 'Exclusão';
  quantidade: string | number;
  data: string;

  [key: string]: string | number | null; 
}

export default function Historico() {

  const [historico, setHistorico] = useState<MovimentacaoEstoque[]>([]);
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
    { name: "Nome do produto" },
    { name: "Tipo" },
    { name: "Quantidade movimentada" },
    { name: "Data de movimentação" },
    { name: "Ações" },
  ];

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const historicoRef = collection(db, "DadosEstoque");
        const q = query(historicoRef, orderBy("data", "desc"));
        const querySnapshot = await getDocs(q);

        const historicoData: MovimentacaoEstoque[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
        
          let dataFormatada = " - ";

          if (data.data){
            const dataObj = new Date(data.data);
            dataFormatada = dataObj.toLocaleDateString('pt-BR');
          }

          return {
            id: doc.id,
            produtoNome: data.produtoNome ?? " - ",
            tipo: data.tipo ?? " - ",
            quantidade: data.quantidade 
            ? `${data.quantidade} ${data.unidadeMedida ?? ""}` 
            : " - ",
            data: dataFormatada ?? " - ",
          };
        });

        setHistorico(historicoData);
      } catch (error) {
        console.error("Erro ao buscar historico:", error);
        toast.error("Erro ao buscar histórico.")
      }
    };

    fetchHistorico();
  }, []);

  const handleDelete = async (id: string) => {
    try {
        const historicoRef = doc(db, "DadosEstoque", id);
        await deleteDoc(historicoRef);
        setHistorico((prevHistorico) => prevHistorico.filter((historico) => historico.id !== id));

        toast.success("Histórico excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir Histórico:", error);
        toast.error("Erro ao excluir Histórico.");
      }
  };

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const filteredHistorico = historico.filter((h) => {
    const matchesSearch =
      h.produtoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.quantidade.toString().includes(searchTerm) ||
      h.data.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = tipoFiltro
    ? h.tipo.toLowerCase() === tipoFiltro.toLowerCase()
    : true;

    return matchesSearch && matchesTipo;
  });

  const currentPage = parseInt(searchParams.get("page") || "1");
  const perPage = 15;
  const paginatedHistorico = paginate(filteredHistorico, currentPage, perPage);
  const totalPages = Math.ceil(filteredHistorico.length / perPage);


  return (
    <main className="h-full">
      <div className="grid lg:grid-cols-6 gap-4">
        <div className="lg:col-span-1 flex items-center">
            <Link href="/home/estoque">
                <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
            </Link>
        </div>
        <div className="lg:col-span-1 col-span-3"/>
        <div className="lg:col-span-1 flex items-center">
          <select
            id="statusOrdem"
            name="statusOrdem"
            className="appearance-none text-center cursor-pointer bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-5 rounded-[30px] w-full"
            value={tipoFiltro}
            onChange={(e) => updateSearchParams("tipo", e.target.value)}
          >
            <option value="">Filtrar</option>
            <option value="Entrada">Entrada</option>
            <option value="Saída">Saída</option>
            <option value="Exclusão">Exclusão</option>
          </select>
        </div>
        <Search searchTerm={searchTerm} onSearchChange={(value) => updateSearchParams("search", value)} />
      </div>

      <div className="mt-16">
        {filteredHistorico.length === 0 ? (
          <div className="h-screen md:h-100 text-center text-gray-500 text-lg py-10 justify-center items-center flex">
            Nada por aqui ainda!
          </div>
        ) : (
          <>
            <Tables titlesHead={titlesHead} dataBody={paginatedHistorico} basePath="/estoque/historico" onDelete={openModal} isHistorico={true}/>
            <div className="mt-6">
              <Pagination totalPages={totalPages} currentPage={currentPage} />
            </div>
          </>
        )}
      </div>
      <Modal isOpen={modalOpen} onClose={closeModal} onConfirm={confirmDelete} />
    </main>
  );
}