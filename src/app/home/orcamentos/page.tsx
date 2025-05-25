'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tables from "@/app/components/tables/Tables";
import Search from "@/app/components/forms/Search";
import Pagination from "@/app/components/Pagination";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { collection, query, getDocs, deleteDoc, doc, getDoc, orderBy } from "firebase/firestore";
import { firestore } from "../../services/firebase/firebaseconfig";
import { paginate } from "@/app/lib/utils";
import Modal from "@/app/components/modal/modal";
import ModalOrcamento from "@/app/components/modal/modalOrcamento";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { logoBase64 } from "@/app/lib/utils";
import { toast } from "react-toastify";

interface Orcamentos {
  id: string;
  nome: string;
  titulo: string;
  valor: string;
  garantia: string;
  dataCriacao: string;
  [key: string]: string | number | null;
}

export default function Page() {

  useEffect(() => {
    document.title = "Orçamentos";
  }, []);

  const [orcamentos, setOrcamento] = useState<Orcamentos[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const tipoFiltro = searchParams.get("garantia") || "";

  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [modalOrcamentoOpen, setModalOrcamentoOpen] = useState(false);
  const [orcamentoId, setOrcamentoId] = useState<string | null>(null);

  const titlesHead = [
    { name: 'Nome do cliente' },
    { name: 'Título'},
    { name: 'Tempo de garantia' },
    { name: 'Data de Criação' },
    { name: 'Valor(R$)' },
    { name: 'Ações' },
  ];

  const openModal = (id: string) => {
    setItemToDelete(id);
    setModalOpen(true);
  };

  const openModalOrcamento = (id: string) => {
    setOrcamentoId(id);
    setModalOrcamentoOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setItemToDelete(null);
  };

  const closeModalOrcamento = () => {
    setModalOrcamentoOpen(false);
    setOrcamentoId(null);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      handleDelete(itemToDelete);
    }
    closeModal();
  };

  const confirmExport = () => {
    if (orcamentoId) {
      exportarPDF(orcamentoId);
    }
    closeModalOrcamento();
  };

  useEffect(() => {
    (pdfMake as any).vfs = (pdfFonts as any).vfs;
  }, []);

  const exportarPDF = async (id: string) => {
    try {
      const orcamentoRef = doc(firestore, "Orcamentos", id);
      const orcamentoDoc = await getDoc(orcamentoRef);

      if (!orcamentoDoc.exists()) {
        console.error("Orçamento não encontrado");
        return;
      }

      const orcamento = orcamentoDoc.data();

      const {
        cliente,
        produtos = [],
        titulo,
        valorTotal,
        valorFrete,
        garantia,
        dataCriacao,
        descricao,
        solucao,
        outros,
      } = orcamento;

      const docDefinition = {
        info: {
          title: id || `Orçamento - ${cliente?.nome || "Orçamento" || titulo}`,
        },
        content: [
          {
            image: logoBase64,
            width: 70,
            height: 70,
            margin: [0, 0, 0, 10],
          },
          {
            alignment: 'justify',
            columns: [
              {
                text: "Orçamento",
                style: "header",
                alignment: "left",
              },
              {
                text: `${dataCriacao.split("-").reverse().join("/") || "  /  /  "}`,
                alignment: "right",
                style: "subheader",
              },
            ],
          },
          { text: "Regrigeração Kredenser", style: "subheader", },
          {
            text: "CNPJ: 37.881.403/0001-05",
            style: "details",
            marginTop: 8,
          },
          {
            text: "Telefone: (42) 99800-0908 / (42) 98849-3666",
            style: "details",
          },
          {
            canvas: [
              {
                type: 'line',
                x1: 0, y1: 0,
                x2: 515, y2: 0,
                lineWidth: 1,
                lineColor: '#002840'
              }
            ],
            margin: [0, 15, 0, 15],
          },
          {
            text: "Informações do Atendimento",
            style: "subheader",
            margin: [0, 15, 0, 10],
          },
          {
            stack: [
              {
                table: {
                  widths: ["*", "*"],
                  body: [
                    [ // Header do nome do cliente (colSpan de 2)
                      {
                        text: "Nome do cliente",
                        fillColor: "#f2f2f2",
                        color: "#333333",
                        bold: true,
                        alignment: "center",
                        colSpan: 2,
                      },
                      {}
                    ],
                    [ // Nome do cliente
                      {
                        text: cliente?.nome || " - ",
                        alignment: "left",
                        colSpan: 2,
                        margin: [0, 4, 0, 4],
                      },
                      {}
                    ],
                    [ // Header de Descrição e Solução
                      {
                        text: "Descrição do problema",
                        fillColor: "#f2f2f2",
                        color: "#333333",
                        bold: true,
                        alignment: "center",
                      },
                      {
                        text: "Solução do problema",
                        fillColor: "#f2f2f2",
                        color: "#333333",
                        bold: true,
                        alignment: "center",
                      },
                    ],
                    [ // Conteúdo de Descrição e Solução
                      {
                        text: descricao || " - ",
                        alignment: "justify",
                        margin: [0, 4, 0, 4],
                      },
                      {
                        text: solucao || " - ",
                        alignment: "justify",
                        margin: [0, 4, 0, 4],
                      },
                    ],
                  ],
                },
                layout: {
                  hLineWidth: function (i: number, node: any) {
                    return (i === 0 || i === node.table.body.length) ? 2 : 1;
                  },
                  vLineWidth: function (i: number, node: any) {
                    return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                  },
                  hLineColor: function (i: number, node: any) {
                    return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                  },
                  vLineColor: function (i: number, node: any) {
                    return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                  },
                }      
              }
            ],
            style: "sectionBlock"
          },
          {
            table: {
              widths: ["*", "*"],
              body: [
                // Cabeçalho principal
                [
                  {
                    text: "Produtos",
                    fillColor: "#f2f2f2",
                    color: "#333333",
                    bold: true,
                    alignment: "center",
                  },
                  {
                    text: "Quantidade",
                    fillColor: "#f2f2f2",
                    color: "#333333",
                    bold: true,
                    alignment: "center",
                  },
                ],
                // Lista de produtos
                ...produtos.map((item: any) => [
                  item.produto || "N/A",
                  item.quantidade || 0,
                ]),
                // Header da seção "Outros"
                [
                  {
                    text: "Outros",
                    colSpan: 2,
                    fillColor: "#f2f2f2",
                    color: "#333333",
                    bold: true,
                    alignment: "center",
                  },
                  {},
                ],
                // Conteúdo da seção "Outros"
                [
                  {
                    text: outros || "N/A",
                    colSpan: 2,
                    alignment: "left",
                    margin: [0, 4, 0, 4],
                  },
                  {},
                ],
              ],
            },
            layout: {
              hLineWidth: function (i: number, node: any) {
                return (i === 0 || i === node.table.body.length) ? 2 : 1;
              },
              vLineWidth: function (i: number, node: any) {
                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
              },
              hLineColor: function (i: number, node: any) {
                return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
              },
              vLineColor: function (i: number, node: any) {
                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
              },
            }            
          },
          {
            text: [
              { text: "Tempo de Garantia: ", bold: true },
              { text: garantia || "N/A" },
            ],
            margin: [0, 10, 0, 10],
          },
          {
            text: [
              { text: "Valor de Frete: ", bold: true },
              { text: `R$ ${parseFloat(valorFrete || 0).toFixed(2)}` },
            ],
          },
          {
            text: [
              {
                text: "Valor Total:",
                alignment: "right",
                bold: true,
                fontSize: 13,
                margin: [0, 10, 0, 0],
              },
              {
                text: ` R$ ${parseFloat(valorTotal || 0).toFixed(2)}`,
                alignment: "right",
                fontSize: 13,
                margin: [0, 10, 0, 0],
              },
            ],
          },
          {
            text: "Formas de Pagamento",
            style: "title",
          },
          {
            table: {
              widths: ['auto'],
              body: [
                [{ text: '• Pix', fontSize: 10, fillColor: '#f9f9f9', margin: [5, 3, 5, 3] }],
                [{ text: '• Dinheiro', fontSize: 10, fillColor: '#f9f9f9', margin: [5, 3, 5, 3] }],
                [{ text: '• Cartão de crédito/débito (com acréscimo da máquina.)', fontSize: 10, fillColor: '#f9f9f9', margin: [5, 3, 5, 3] }],
              ],
            },
            layout: {
              hLineWidth: function (i: number, node: any) {
                return (i === 0 || i === node.table.body.length) ? 1 : 0;
              },
              vLineWidth: function (i: number, node: any) {
                return (i === 0 || i === node.table.widths.length) ? 1 : 0;
              },
              hLineColor: () => 'gray',
              vLineColor: () => 'gray',
            },
            margin: [0, 0, 0, 10],
          },
        ],
        styles: {
          header: {
            fontSize: 20,
            bold: true,
            alignment: "center",
          },
          subheader: {
            fontSize: 14,
            bold: true,
          },
          title: {
            fontSize: 14,
            bold: true,
            margin: [0, 20, 0, 5],
          },
          details: {
            fontSize: 10,
          },
          sectionHeader: {
            fontSize: 14,
            bold: true,
            margin: [0, 0, 0, 5],
          },
          sectionBlock: {
            margin: [0, 10, 0, 10],
          },
        },
      };

      pdfMake.createPdf(docDefinition).open();
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Tente novamente.");
    }
    closeModalOrcamento();
  };

  useEffect(() => {
    const fetchOrcamentos = async () => {
      const orcamentosRef = collection(firestore, "Orcamentos");
      const q = query(orcamentosRef, orderBy("dataCriacao", "desc"));

      const querySnapshot = await getDocs(q);

      const orcamentosData: Orcamentos[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().cliente.nome || " - ",
        titulo: doc.data().titulo || " - ",
        garantia: doc.data().garantia || " - ",
        dataCriacao: doc.data().dataCriacao.split("-").reverse().join("/") || " - ",
        valor: doc.data().valorTotal,
      }));

      setOrcamento(orcamentosData);
    };

    fetchOrcamentos();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const orcamentoRef = doc(firestore, `Orcamentos/${id}`);
      await deleteDoc(orcamentoRef);
      setOrcamento((prevOrcamentos) => prevOrcamentos.filter((orcamento) => orcamento.id !== id));
      toast.success("Orçamento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir Orçamento:", error);
      toast.error("Erro ao excluir Orçamento. Tente novamente.");
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

  const filteredOrcamentos = orcamentos.filter((orcamento) => {
    const matchesSearch =
      orcamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orcamento.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orcamento.garantia.includes(searchTerm) ||
      orcamento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            onChange={(e) => updateSearchParams("garantia", e.target.value)}
          >
            <option value="">Filtrar</option>
            <option value="1 mês">1 mês</option>
            <option value="3 meses">3 meses</option>
            <option value="6 meses">6 meses</option>
            <option value="1 ano">1 ano</option>
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
        {
          filteredOrcamentos.length === 0 ? (
            <div className="h-screen md:h-100 text-center text-gray-500 text-lg py-10 justify-center items-center flex">
              Nada por aqui ainda!
            </div>
          ) : (
            <>
              <Tables titlesHead={titlesHead} dataBody={paginatedOrcamentos} basePath="/orcamentos" onDelete={openModal} onExport={openModalOrcamento} showExport={true} />
              <div className="mt-6">
                <Pagination totalPages={totalPages} currentPage={currentPage} />
              </div>
            </>
          )
        }
      </div>
      <Modal isOpen={modalOpen} onClose={closeModal} onConfirm={confirmDelete} />
      <ModalOrcamento isOpen={modalOrcamentoOpen} onClose={closeModalOrcamento} onConfirm={confirmExport} />
    </main>
  );
}