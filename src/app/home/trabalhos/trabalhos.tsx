"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tables from "@/app/components/tables/Tables";
import Search from "@/app/components/forms/Search";
import Pagination from "@/app/components/Pagination";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { collection, onSnapshot, deleteDoc, doc, getDocs, query, orderBy } from "firebase/firestore";
import { firestore } from "../../services/firebase/firebaseconfig";
import { logoBase64, paginate } from "@/app/lib/utils";
import Modal from "@/app/components/modal/modal";
import ModalPDF from "@/app/components/modal/modalPDF";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { toast } from "react-toastify";

interface Trabalho {
  id: string;
  idCliente: string;
  nome: string;
  titulo: string;
  valor: string;
  statusOrdem: string;
  dataCriacao: string;
  [key: string]: string | number | null;
}

export default function Trabalhos() {

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

  const confirmDelete = async () => {
    if (itemToDelete) {
      await handleDelete(itemToDelete);
    }
    closeModal();
  };

  useEffect(() => {
    (pdfMake as any).vfs = (pdfFonts as any).vfs;
  }, []);

const exportarPDF = async (clienteId?: string) => {
  try {
    const trabalhosData: Trabalho[] = [];

    const trabalhosRef = collection(firestore, "Trabalhos");
    const snapshot = await getDocs(trabalhosRef);

    snapshot.forEach((doc) => {
      const data = doc.data();
      const trabalho: Trabalho = {
        id: doc.id,
        idCliente: data.cliente?.id,
        titulo: data.titulo || "Não informado",
        nome: data.cliente?.nome || "Não informado",
        valor: data.valorTotal || "Não informado",
        statusOrdem: data.statusOrdem || "Não informado",
        garantia: data.garantia,
        pagamento: data.pagamento,
        statusPagamento: data.statusPagamento,
        dataCriacao: data.dataCriacao
          ? data.dataCriacao.split("-").reverse().join("/")
          : "Não informado",
      };

      // Se um cliente foi selecionado, filtra os trabalhos
      if (!clienteId || data.cliente?.id === clienteId) {
        trabalhosData.push(trabalho);
      }
    });

    if (trabalhosData.length === 0) {
      toast.info("Nenhum trabalho encontrado para o cliente selecionado.");
      return;
    }

    const docDefinition = {
      info: {
        title: "Relatório de Trabalhos Realizados"
      },
      content: [
        {
          image: logoBase64,
          width: 70,
          height: 70,
          margin: [0, 0, 0, 10],
        },
        { text: "Relatório de Trabalhos", style: "header" },
        {
          table: {
            widths: ['*', '*', '*', "*", '*','*'],
            body: [
              [
                {text:'Cliente',
                  fillColor: "#f2f2f2",
                  color: "#333333",
                  bold: true,
                  alignment: "center",
                }, 
                {text:'Valor',
                  fillColor: "#f2f2f2",
                  color: "#333333",
                  bold: true,
                  alignment: "center",
                },
                {text:'Garantia',
                  fillColor: "#f2f2f2",
                  color: "#333333",
                  bold: true,
                  alignment: "center",
                },
                {text:'Status do Trabalho',
                  fillColor: "#f2f2f2",
                  color: "#333333",
                  bold: true,
                  alignment: "center",
                },
                {text:'Pagamento',
                  fillColor: "#f2f2f2",
                  color: "#333333",
                  bold: true,
                  alignment: "center",
                },
                {text:'Status do Pagamento',
                  fillColor: "#f2f2f2",
                  color: "#333333",
                  bold: true,
                  alignment: "center",
                }],
              ...trabalhosData.map((trabalho) => [
                trabalho.nome || ' - ',
                `R$ ${parseFloat(trabalho.valor).toFixed(2)}` || ' - ',
                trabalho.garantia || ' - ',
                trabalho.statusOrdem || ' - ',
                trabalho.pagamento || ' - ',
                trabalho.statusPagamento || ' - '
              ]),
            ]
          },
          layout: {
            hLineWidth: function (i: number, node: any) {
            return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i: number, node: any) {
            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            hLineColor: function (i: number, node: any) {
            return (i === 0 || i === node.table.body.length) ? 'gray' : 'gray';
            },
            vLineColor: function (i: number, node: any) {
            return (i === 0 || i === node.table.widths.length) ? 'gray' : 'gray';
            },
          }
        },
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          alignment: "center",
          color: "#002840",
          margin: [0, 0, 0, 45]
        },
        subheader: {
          fontSize: 14,
          bold: true,
        },

      },
    };

    pdfMake.createPdf(docDefinition).open();
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    toast.error("Erro ao gerar PDF. Tente Novamente!");
  } finally {
    closeModalPDF();
  }
};


  const titlesHead = [
    { name: "Nome do cliente" },
    { name: "Título"},
    { name: "Valor(R$)" },
    { name: "Status da Ordem" },
    { name: "Data de Criação" },
    { name: "Ações" },
  ];

  useEffect(() => {
  const trabalhosRef = collection(firestore, "Trabalhos");

  // Aqui adicionamos o orderBy na dataCriacao
  const q = query(trabalhosRef, orderBy("dataCriacao", "desc")); // ou "asc" para crescente

  const unsubscribe = onSnapshot(q, (snapshot) => {
    try {
      const trabalhosData: Trabalho[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          idCliente: data.cliente?.id,
          nome: data.cliente?.nome || " - ",
          titulo: data.titulo || " - ",
          valor: data.valorTotal || " - ",
          statusOrdem: data.statusOrdem || " - ",
          dataCriacao:
            data.dataCriacao?.split("-").reverse().join("/") || " - ",
        };
      });
      setTrabalhos(trabalhosData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao buscar dados. Tente novamente.");
    }
  });

  return () => unsubscribe();
}, []);
  
  const handleDelete = async (id: string) => {
    try {
      const trabalhoRef = doc(firestore, "Trabalhos", id);
      await deleteDoc(trabalhoRef);
      setTrabalhos((prevTrabalhos) =>
        prevTrabalhos.filter((trabalho) => trabalho.id !== id)
      );
      toast.success("Trabalho excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir Trabalho:", error);
      toast.error("Erro ao excluir Trabalho. Tente novamente.");
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

  const filteredTrabalhos = trabalhos.filter((trabalho) => {
    const matchesSearch =
      trabalho.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabalho.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabalho.statusOrdem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabalho.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const uniqueClientes = Array.from(
  new Map(trabalhos.map((t) => [t.idCliente, { idCliente: t.idCliente, nome: t.nome }]))
    .values()
  );

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

        <Search
          searchTerm={searchTerm}
          onSearchChange={(value) => updateSearchParams("search", value)}
        />

        <div className="col-span-6 lg:col-span-2 flex justify-end w-full gap-2">
          <button
            onClick={openModalPDF}
            className="flex items-center gap-2 bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-4 rounded-[30px] cursor-pointer"
          >
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
        {filteredTrabalhos.length === 0 ? (
          <div className="h-screen md:h-100 text-center text-gray-500 text-lg py-10 justify-center items-center flex">
            Nada por aqui ainda!
          </div>
        ) : (
          <>
            <Tables
              titlesHead={titlesHead}
              dataBody={paginatedTrabalhos}
              basePath="/trabalhos"
              onDelete={openModal}
            />
            <div className="mt-6">
              <Pagination totalPages={totalPages} currentPage={currentPage} />
            </div>
          </>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} onConfirm={confirmDelete} />
      <ModalPDF
        isOpen={modalPDFOpen}
        onClose={closeModalPDF}
        onConfirm={exportarPDF}
        isTrabalhos={true}
        clientes={uniqueClientes}
      />
    </main>
  );
}
