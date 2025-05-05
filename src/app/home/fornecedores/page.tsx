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

interface Fornecedores {
  id: string;
  nomeFornecedor: string;
  telefone: string;
  email: string;
  cidade: string;
  [key: string]: string | number | null;
}

export default function Page() {
  const [fornecedores, setFornecedores] = useState<Fornecedores[]>([]);
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
    { name: "Nome do Fornecedor" },
    { name: "Telefone/Celular" },
    { name: "E-mail" },
    { name: "Cidade" },
    { name: "Ações" },
  ];

  useEffect(() => {
    const fornecedoresRef = ref(database, "DadosFornecedores");

    const unsubscribe = onValue(fornecedoresRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const fornecedoresData: Fornecedores[] = Object.entries(data).map(
          ([key, value]: [string, any]) => ({
            id: key,
            nomeFornecedor: value.nomeFornecedor,
            telefone: value.telefone,
            email: value.email,
            cidade: value.cidade,
          })
        );
        setFornecedores(fornecedoresData);
      } else {
        setFornecedores([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const fornecedorRef = ref(database, `DadosFornecedores/${id}`);
      await remove(fornecedorRef);
      setFornecedores((prev) =>
        prev.filter((fornecedor) => fornecedor.id !== id)
      );
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
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

  const filteredFornecedores = fornecedores.filter((fornecedor) => {
    const matchesSearch =
      fornecedor.nomeFornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.telefone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cidade.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = tipoFiltro
      ? fornecedor.cidade.toLowerCase() === tipoFiltro.toLowerCase()
      : true;

    return matchesSearch && matchesTipo;
  });

  const currentPage = parseInt(searchParams.get("page") || "1");
  const perPage = 15;
  const paginatedFornecedores = paginate(filteredFornecedores, currentPage, perPage);
  const totalPages = Math.ceil(filteredFornecedores.length / perPage);

  return (
    <main className="h-full">
      <div className="grid lg:grid-cols-6 gap-4">
        <div className="lg:col-span-1 flex items-center">
          <select
            id="filtroCidade"
            name="filtroCidade"
            className="appearance-none text-center cursor-pointer bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-5 rounded-[30px] w-full"
            value={tipoFiltro}
            onChange={(e) => updateSearchParams("tipo", e.target.value)}
          >
            <option value="">Filtrar:</option>
            <option value="guarapuava">Guarapuava</option>
            <option value="curitiba">Curitiba</option>
            <option value="outra">Outra Cidade</option>
          </select>
        </div>
        <Search
          searchTerm={searchTerm}
          onSearchChange={(value) => updateSearchParams("search", value)}
        />
        <div className="col-span-6 lg:col-span-2 flex justify-end w-full">
          <Link href="/home/fornecedores/new">
            <button className="flex items-center gap-2 bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-4 rounded-[30px] cursor-pointer">
              Novo Fornecedor <PlusIcon className="w-6 h-6 text-main-white" />
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-16">
        {filteredFornecedores.length === 0 ? (
          <div className="h-screen md:h-100 text-center text-gray-500 text-lg py-10 justify-center items-center flex">
            Nada por aqui ainda!
          </div>
        ) : (
          <>
            <Tables
              titlesHead={titlesHead}
              dataBody={paginatedFornecedores}
              basePath="/fornecedores"
              onDelete={openModal}
            />
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
