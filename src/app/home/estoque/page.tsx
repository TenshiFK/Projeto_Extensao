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

interface Produtos {
  id: string;
  nomeProduto: string;
  valor: string;
  quantidade: string;
  dataCompra: string;
  [key: string]: string | number | null;
}

export default function Page() {
    const [produtos, setProdutos] = useState<Produtos[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
  
    const searchTerm = searchParams.get("search") || "";
    const tipoFiltro = searchParams.get("quantidade") || "";

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
      alert("PDF exportado com sucesso!");
      closeModalPDF();
    };
  
    const titlesHead = [
      { name: 'Nome do produto' },
      { name: 'Valor' },
      { name: 'Quantidade' },
      { name: 'Data de compra' },
      { name: 'Ações' },
    ];

    useEffect(() => {
        const produtosRef = ref(database, "DadosProdutos");
    
        const unsubscribe = onValue(produtosRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const produtosData: Produtos[] = Object.entries(data).map(([key, value]: [string, any]) => ({
              id: key,
              nomeProduto: value.nomeProduto,
              valor: value.valor,
              quantidade: value.quantidade,
              dataCompra: value.dataCompra && value.dataCompra !== "Não informado"
              ? new Date(value.dataCompra).toLocaleDateString("pt-BR")
              : "Não informado",
            }));
            setProdutos(produtosData);
          } else {
            setProdutos([]);
          }
        });
    
        return () => unsubscribe();
      }, []);
    
      const handleDelete = async (id: string) => {
        try {
          const produtosRef = ref(database, `DadosProdutos/${id}`);
          await remove(produtosRef);
          setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
        } catch (error) {
          console.error("Erro ao excluir Produto:", error);
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
    
      const filteredProdutos = produtos.filter(produto => {
        const matchesSearch =
        produto.nomeProduto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.quantidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.dataCompra.toLowerCase().includes(searchTerm.toLowerCase());
    
        const qtd = parseInt(produto.quantidade) || 0;

        const matchesTipo = tipoFiltro
              ? (tipoFiltro === "menosCinco" && qtd < 5) ||
              (tipoFiltro === "entreCincoDez" && qtd >= 5 && qtd <= 10) ||
              (tipoFiltro === "maisDez" && qtd > 10)
            : true;
    
        return matchesSearch && matchesTipo;
      });
    
      const currentPage = parseInt(searchParams.get("page") || "1");
      const perPage = 15;
      const paginatedProdutos = paginate(filteredProdutos, currentPage, perPage);
      const totalPages = Math.ceil(filteredProdutos.length / perPage);
    

    return (
      <main className="h-full">
      <div className="grid lg:grid-cols-6 gap-4">
        <div className="lg:col-span-1 flex items-center">
          <select
            id="statusOrdem"
            name="statusOrdem"
            className="appearance-none text-center cursor-pointer bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-5 rounded-[30px] w-full"
            value={tipoFiltro}
            onChange={(e) => updateSearchParams("quantidade", e.target.value)}
          >
            <option value="">Filtrar</option>
            <option value="menosCinco"> Menos que 5 </option>
            <option value="entreCincoDez">Entre 5 e 10</option>
            <option value="maisDez">Mais que 10</option>
          </select>
        </div>
        <Search searchTerm={searchTerm} onSearchChange={(value) => updateSearchParams("search", value)} />
        <div className="col-span-6 lg:col-span-2 flex justify-end w-full gap-2">
          <button 
          onClick={openModalPDF}
          className="flex items-center gap-2 bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-4 rounded-[30px] cursor-pointer">
            Gerar Relatório
          </button>
          <Link href="/home/estoque/new">
            <button className="flex items-center gap-2 bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-4 rounded-[30px] cursor-pointer">
              Novo Produto <PlusIcon className="w-6 h-6 text-main-white" />
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-16">
        {filteredProdutos.length === 0 ? (
          <div className="h-screen md:h-100 text-center text-gray-500 text-lg py-10 justify-center items-center flex">
            Nada por aqui ainda!
          </div>
        ) : (
          <>
            <Tables titlesHead={titlesHead} dataBody={paginatedProdutos} basePath="/estoque" onDelete={openModal} />
        <div className="mt-6">
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
          </>
        )}
      </div>
      <Modal isOpen={modalOpen} onClose={closeModal} onConfirm={confirmDelete} />
      <ModalPDF isOpen={modalPDFOpen} onClose={closeModalPDF} onConfirm={exportarPDF} />
    </main>
    );
}