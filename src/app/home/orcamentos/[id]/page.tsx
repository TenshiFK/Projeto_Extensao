'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../services/firebase/firebaseconfig";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import ModalOrcamento from "@/app/components/modal/modalOrcamento";
import { logoBase64 } from "@/app/lib/utils";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { toast } from "react-toastify";

interface Orcamento {
  titulo: string;
  cliente: {
    id: string;
    nome: string;
  };
  dataCriacao: string;
  garantia: string;
  descricao: string;
  solucao: string;
  produtos?: {
    produto: string;
    quantidade: string;
  }[];
  outros?: string;
  valorFrete?: string;
  valorTotal: string;
}

export default function OrcamentoDetalhes() {

  useEffect(() => {
    document.title = "Detalhes do Orçamento";
  }, []);

  const { id } = useParams();
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOrcamentoOpen, setModalOrcamentoOpen] = useState(false);

  const closeModalOrcamento = () => {
    setModalOrcamentoOpen(false);
  };

    useEffect(() => {
    (pdfMake as any).vfs = (pdfFonts as any).vfs;
  }, []);

  const exportarPDF = async (id: string) => {
    try {
      const docRef = doc(db, "Orcamentos", id);
      const snapshot = await getDoc(docRef);
      const orcamento = snapshot.data() as Orcamento;

      if (!orcamento) {
        console.error("Orçamento não encontrado");
        return;
      }

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
          { text: "Refrigeração Kredenser", style: "subheader" },
          { text: "CNPJ: 37.881.403/0001-05", style: "details", marginTop: 8 },
          { text: "Telefone: (42) 99800-0908 / (42) 98849-3666", style: "details" },
          {
            canvas: [
              {
                type: 'line',
                x1: 0, y1: 0,
                x2: 515, y2: 0,
                lineWidth: 1,
                lineColor: '#002840',
              },
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
                    [
                      {
                        text: "Nome do cliente",
                        fillColor: "#f2f2f2",
                        color: "#333333",
                        bold: true,
                        alignment: "center",
                        colSpan: 2,
                      },
                      {},
                    ],
                    [
                      {
                        text: cliente?.nome || " - ",
                        alignment: "left",
                        colSpan: 2,
                        margin: [0, 4, 0, 4],
                      },
                      {},
                    ],
                    [
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
                    [
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
                  hLineWidth: function (i: number, node: any) {  // Tipo 'any' para o parâmetro node
                    return (i === 0 || i === node.table.body.length) ? 2 : 1;
                  },
                  vLineWidth: function (i: number, node: any) {  // Tipo 'any' para o parâmetro node
                    return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                  },
                  hLineColor: function (i: number, node: any) {  // Tipo 'any' para o parâmetro node
                    return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                  },
                  vLineColor: function (i: number, node: any) {  // Tipo 'any' para o parâmetro node
                    return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                  },
                }            
              },
            ],
            style: "sectionBlock",
          },
          {
            table: {
              widths: ["*", "*"],
              body: [
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
                ...produtos.map((item) => [
                  item.produto || "N/A",
                  item.quantidade || 0,
                ]),
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
                [
                  {
                    text: outros || " - ",
                    colSpan: 2,
                    alignment: "left",
                    margin: [0, 4, 0, 4],
                  },
                  {},
                ],
              ],
            },
            layout: {
              hLineWidth: function (i: number, node: any) {  // Tipo 'any' para o parâmetro node
                return (i === 0 || i === node.table.body.length) ? 2 : 1;
              },
              vLineWidth: function (i: number, node: any) {  // Tipo 'any' para o parâmetro node
                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
              },
              hLineColor: function (i: number, node: any) {  // Tipo 'any' para o parâmetro node
                return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
              },
              vLineColor: function (i: number, node: any) {  // Tipo 'any' para o parâmetro node
                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
              },
            }            
          },
          {
            text: [
              { text: "Tempo de Garantia: ", bold: true },
              { text: garantia || " - " },
            ],
            margin: [0, 10, 0, 10],
          },
          {
            text: [
              { text: "Valor de Frete: ", bold: true },
              { text: `R$ ${parseFloat(valorFrete || "0").toFixed(2)}` },
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
                text: ` R$ ${parseFloat(valorTotal || "0").toFixed(2)}`,
                alignment: "right",
                fontSize: 13,
                margin: [0, 10, 0, 0],
              },
            ],
          },{
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
    if (!id) return;

    const fetchData = async () => {
      try {
        const docRef = doc(db, "Orcamentos", id as string);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setOrcamento(snapshot.data() as Orcamento);
        } else {
          console.log("Orçamento não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        toast.error("Erro ao buscar os dados do orçamento.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen">
      <p className="mr-4 text-lg">
        Carregando...         
      </p>
      <svg className="animate-spin h-15 w-15 text-main-blue" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>;

  if (!orcamento) return <div>
      <div className="mb-4">
          <Link href="/home/orcamentos">
            <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
          </Link>
        </div>
      Orçamento não encontrado.
    </div>;
  
    return (
      <main>
        <div className="mb-4">
          <Link href="/home/orcamentos">
            <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
          </Link>
        </div>
        <h1 className="mb-4 text-xl md:text-2xl font-semibold">
          Registros do Orçamento
        </h1>
        <div className="space-y-8">
          <div className="pb-14">
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
              <div className="col-span-6">
                <h2 className="text-base/7 font-semibold text-gray-900">Informações Gerais:</h2>
              </div>  
              <div className="sm:col-span-3 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Título
                </p>
                <div className="mt-2">
                  <div
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                    {orcamento.titulo || " - "}
                  </div>
                </div>
              </div>
              <div className="sm:col-span-3 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Cliente
                </p>
                <div className="mt-2 grid grid-cols-1">
                  <div
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                    >
                      {orcamento.cliente.nome || " - "}
                    </div>
                </div>
              </div>

              <div className="sm:col-span-2 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Data de Criação
                </p>
                <div className="mt-2">
                  <div
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                    >
                      {orcamento.dataCriacao.split("-").reverse().join("/") || " - "}
                    </div>
                </div>
              </div>

              <div className="sm:col-span-2 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Tempo de Garantia
                </p>
                <div className="mt-2 grid grid-cols-1">
                <div
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                    {orcamento.garantia || " - "}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Descrição do problema
                </p>
                <div className="mt-2">
                  <textarea
                  id="descricao"
                  name="descricao"
                  rows={4}
                  readOnly
                  disabled
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm"
                  value={orcamento.descricao || ' - '}
                  placeholder="Digite a descrição do problema aqui..."
                />
                </div>
              </div>

              <div className="sm:col-span-3 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Solução Proposta
                </p>
                <div className="mt-2">
                  <textarea
                  id="solucao"
                  name="solucao"
                  rows={4}
                  readOnly
                  disabled
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm"
                  value={orcamento.solucao || ' - '}
                  placeholder="Digite a solução aqui..."
                />
                </div>
              </div>

              <div className='sm:col-span-full mt-3 col-span-6'>
                <h2 className="text-base/7 font-semibold text-gray-900">Itens e peças necessárias</h2>
              </div>

              <div className="sm:col-span-4 col-span-6">
                {
                  orcamento.produtos?.length === 0 ? (
                    <p className="text-sm/6 font-medium text-gray-900">Nenhum produto informado.</p>
                  ) : (
                    <table className='min-w-full'>
                      <thead className='bg-second-white'>
                        <tr>
                          <th className="text-left border border-main-blue px-1 py-1 text-main-blue">Produto</th>
                          <th className="text-left border border-main-blue px-1 py-1 text-main-blue">Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                      {orcamento.produtos?.map((item, index) => (
                          <tr key={index} className="border border-gray-950 bg-third-white">
                            <td className='border border-gray-950 px-1 py-1 bg-third-white'>{item.produto}</td>
                            <td className='border border-gray-950 px-1 py-1 bg-third-white'>{item.quantidade}</td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  )
                }
              </div>

              <div className='hidden sm:block sm:col-span-2'></div>

              <div className="sm:col-span-2 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Outros
                </p>
                <div className="mt-2">
                  <div
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                    >
                    {orcamento.outros || " - "}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Valor do Frete
                </p>
                <div className="mt-2">
                  <div
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                    >
                    {orcamento.valorFrete || " - "}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 col-span-6">
                <p className="block text-sm/6 font-medium text-gray-900">
                  Valor Total
                </p>
                <div className="mt-2">
                  <div
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                    >
                    {orcamento.valorTotal || " - "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-10">
        <button
          type="submit"
          className="text-center cursor-pointer bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-5 rounded-md hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={() => setModalOrcamentoOpen(true)}
        >
          Exportar
        </button>
      </div>
        <ModalOrcamento isOpen={modalOrcamentoOpen} onClose={closeModalOrcamento} onConfirm={() => exportarPDF(id as string)} />
      </main>
    );
  }
