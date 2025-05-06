'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get, onValue } from "firebase/database";
import { database } from "../../../services/firebase/firebaseconfig";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import ModalOrcamento from "@/app/components/modal/modalOrcamento";
import { logoBase64 } from "@/app/lib/utils";

interface Orcamento {
    titulo: string,
    cliente: {
      id: string;
      nome: string;
    },
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
  export default function OrcamentoDetalhes() {
  const { id } = useParams();
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOrcamentoOpen, setModalOrcamentoOpen] = useState(false);

  const closeModalOrcamento = () => {
    setModalOrcamentoOpen(false);
  };

  const exportarPDF = async (id: string) => {
    try {
      const orcamentoRef = ref(database, `DadosOrcamentos/${id}`);
      onValue(orcamentoRef, (snapshot) => {
        const orcamento = snapshot.val();
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
            title: titulo || `Orçamento - ${cliente?.nome || "Orçamento"}`, 
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
                  text: `${dataCriacao ? new Date(dataCriacao).toLocaleDateString("pt-BR") : "  /  /  "}`,
                  alignment: "right",
                  style: "subheader",
                },
              ],
            },
            { text: "Regrigeração Kredenser", style: "subheader",},
            { text: "CNPJ: 37.881.403/0001-05",
              style: "details",
              marginTop: 8,
            },
            { text: "Telefone: (42) 99800-0908 / (42) 98849-3666",
              style: "details",
            },
            { canvas: [
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
                    hLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? 2 : 1;
                    },
                    vLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                    },
                    hLineColor: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                    },
                    vLineColor: function (i, node) {
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
                hLineWidth: function (i, node) {
                  return (i === 0 || i === node.table.body.length) ? 2 : 1;
                },
                vLineWidth: function (i, node) {
                  return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                },
                hLineColor: function (i, node) {
                  return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                },
                vLineColor: function (i, node) {
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
            details: {
              fontSize: 10,
            },
            sectionHeader: {
              fontSize: 14,
              bold: true,
              margin: [0, 0, 0, 5]
            },
            sectionBlock: {
              margin: [0, 10, 0, 10]
            }
          },
        };
  
        pdfMake.createPdf(docDefinition).open();
      }, {
        onlyOnce: true,
      });
  
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    }
    closeModalOrcamento();
  };

    useEffect(() => {
      if (!id) return;
  
      const fetchData = async () => {
        try {
          const snapshot = await get(ref(database, `DadosOrcamentos/${id}`));
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
                      {orcamento.dataCriacao || " - "}
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
