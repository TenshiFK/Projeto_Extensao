"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, getDocs, query, deleteDoc, doc, addDoc, orderBy } from "firebase/firestore";
import { db, firestore } from "@/app/services/firebase/firebaseconfig";
import Tables from "@/app/components/tables/Tables";
import Search from "@/app/components/forms/Search";
import Pagination from "@/app/components/Pagination";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Modal from "@/app/components/modal/modal";
import ModalPDF from "@/app/components/modal/modalPDF";
import { logoBase64, paginate } from "@/app/lib/utils";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { toast } from "react-toastify";

interface Produto {
  id: string;
  nomeProduto: string;
  valor: string;
  quantidade: string;
  dataCompra: string;
  [key: string]: string | number | null;
}

interface MovimentacaoEstoque {
  id?: string;
  produtoId: string;
  produtoNome: string;
  tipo: 'Entrada' | 'Saída' | 'Exclusão';
  quantidade: number;
  data: string;
  origem: string;

  observacoes?: string;
}

export default function Estoque() {

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const tipoFiltro = searchParams.get("quantidade") || "";

  const [modalOpen, setModalOpen] = useState(false);
  const [modalPDFOpen, setModalPDFOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const registrarMovimentacaoEstoque = async (movimentacao: MovimentacaoEstoque) => {
    try {
      console.log("Movimentação que vai ser salva:", movimentacao);
      const movimentacoesRef = collection(db, 'DadosEstoque');
      await addDoc(movimentacoesRef, movimentacao);
      console.log('Movimentação registrada com sucesso');
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      toast.error('Erro ao registrar movimentação de estoque.');
    }
  };


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

  useEffect(() => {
    (pdfMake as any).vfs = (pdfFonts as any).vfs;
  }, []);

  const exportarPDF = async (tipoRelatorio?: string, periodo?: string) => {
    try{

      let docDefinition;

      if(tipoRelatorio === "periodo"){
        console.log("Tipo de relatório:", tipoRelatorio);
        console.log("Período:", periodo);
        const produtosData: Produto[] =[];
  
        const produtosRef = collection(firestore, "Produtos");
        const q = query(produtosRef, orderBy("dataCompra", "desc"));
        const snapshot = await getDocs(q);
  
        snapshot.forEach((doc) => {
          const data = doc.data();
          const produto: Produto = {
            id: doc.id,
            nomeProduto: data.nomeProduto || "Não informado",
            valor: data.valor || "Não informado",
            quantidade: data.quantidade || "Não informado",
            nomeFornecedor: data.fornecedor?.nomeFornecedor || "Não informado",
            dataCompra: data.dataCompra
            ? data.dataCompra.split("-").reverse().join("/")
            : "Não informado",
          };

          const hoje = new Date();
          const dataCompraDate = new Date(data.dataCompra);

          console.log("Hoje:", hoje);

          if (periodo === "umMes") {
            const umMesAtras = new Date();
            umMesAtras.setMonth(hoje.getMonth() - 1);
            if (dataCompraDate >= umMesAtras) {
              produtosData.push(produto);
            }
          } else if (periodo === "seisMeses") {
            const seisMesesAtras = new Date();
            seisMesesAtras.setMonth(hoje.getMonth() - 6);
            if (dataCompraDate >= seisMesesAtras) {
              produtosData.push(produto);
            }
          } else if (periodo === "ano") {
            const umAnoAtras = new Date();
            umAnoAtras.setFullYear(hoje.getFullYear() - 1);
            if (dataCompraDate >= umAnoAtras) {
              produtosData.push(produto);
            }
          } else if (periodo === "todos"){
            produtosData.push(produto)
          }
        });
        
        if (produtosData.length === 0) {
          toast.info("Nenhum produto encontrado")
          return;
        }
  
        docDefinition = {
          info: {
            title: "Relatório de Produtos"
          },
                content: [
                  {
                    image: logoBase64,
                    width: 70,
                    height: 70,
                    margin: [0, 0, 0, 10],
                  },
                  { text: "Relatório de Produtos no Estoque", style: "header" },
                  {
                    table: {
                      widths: ['*','*','*',"*","*"],
                      body: [
                        [
                          {text:'Produto',
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
                          {text:'Quantidade',
                            fillColor: "#f2f2f2",
                            color: "#333333",
                            bold: true,
                            alignment: "center",
                          },
                          {text:'Fornecedor',
                            fillColor: "#f2f2f2",
                            color: "#333333",
                            bold: true,
                            alignment: "center",
                          },
                          {text:'Data de Compra',
                            fillColor: "#f2f2f2",
                            color: "#333333",
                            bold: true,
                            alignment: "center",
                          },],
                        ...produtosData.map((produto) => [
                          produto.nomeProduto || ' - ',
                          `R$ ${parseFloat(produto.valor).toFixed(2)}` || ' - ',
                          produto.quantidade || ' - ',
                          produto.nomeFornecedor || ' - ',
                          produto.dataCompra || ' - ',
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
        }

      } else if (tipoRelatorio === "historico") {
        const historicoData: MovimentacaoEstoque[] = [];

        const movimentacoesRef = collection(firestore, "DadosEstoque");
        const q = query(movimentacoesRef, orderBy("data", "desc")); 
        const snapshot = await getDocs(q);

        snapshot.forEach((doc) => {
          const data = doc.data();
          const movimentacao: MovimentacaoEstoque = {
            id: doc.id,
            produtoId: data.produtoId || "Não informado",
            produtoNome: data.produtoNome || "Não informado",
            tipo: data.tipo || "Não informado",
            quantidade: data.quantidade || 0,
            data: data.data 
              ? data.data.split("T")[0].split("-").reverse().join("/")
              : "Não informado",
            origem: data.origem || "Não informado",
          };
          historicoData.push(movimentacao);
        });

        if (historicoData.length === 0) {
          toast.info("Nenhum produto encontrado")
          return;
        }

        docDefinition = {
          info: {
            title: "Relatório de Histórico de Movimentações"
          },
                content: [
                  {
                    image: logoBase64,
                    width: 70,
                    height: 70,
                    margin: [0, 0, 0, 10],
                  },
                  { text: "Relatório de Histórico de Movimentações", style: "header" },
                  {
                    table: {
                      widths: ['*','*','*',"*"],
                      body: [
                        [
                          {text:'Produto',
                            fillColor: "#f2f2f2",
                            color: "#333333",
                            bold: true,
                            alignment: "center",
                          }, 
                          {text:'Tipo de Movimentação',
                            fillColor: "#f2f2f2",
                            color: "#333333",
                            bold: true,
                            alignment: "center",
                          },
                          {text:'Quantidade',
                            fillColor: "#f2f2f2",
                            color: "#333333",
                            bold: true,
                            alignment: "center",
                          },
                          {text:'Data de Movimentação',
                            fillColor: "#f2f2f2",
                            color: "#333333",
                            bold: true,
                            alignment: "center",
                          },],
                        ...historicoData.map((produto) => [
                          produto.produtoNome || ' - ',
                          produto.tipo || ' - ',
                          produto.quantidade !== undefined ? produto.quantidade : ' - ',
                          produto.data || ' - ',
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
        }

      } else {
        toast.error("Tipo de relatório inválido");
        return;
      }


      pdfMake.createPdf(docDefinition).open();

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Tente Novamente!");
    } finally {
      closeModalPDF();
    }
  };

  const titlesHead = [
    { name: "Nome do produto" },
    { name: "Valor" },
    { name: "Quantidade" },
    { name: "Data de compra" },
    { name: "Ações" },
  ];

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const produtosRef = collection(db, "Produtos");
        const q = query(produtosRef, orderBy("dataCompra", "desc"));
        const querySnapshot = await getDocs(q);

        const produtosData: Produto[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            nomeProduto: data.nomeProduto ?? "",
            valor: data.valor ?? "",
            quantidade: data.quantidade ?? "",
            dataCompra:
              data.dataCompra && data.dataCompra !== "Não informado"
                ? data.dataCompra.split("-").reverse().join("/")
                : "Não informado",
          };
        });

        setProdutos(produtosData);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, []);

  const handleDelete = async (id: string) => {
    try {
        const produto = produtos.find((p) => p.id === id);
        const produtoRef = doc(db, "Produtos", id);
        await deleteDoc(produtoRef);
        setProdutos((prevProdutos) => prevProdutos.filter((produto) => produto.id !== id));

        // Registra a movimentação
        if (produto) {
          await registrarMovimentacaoEstoque({
            produtoId: produto.id, 
            produtoNome: produto.nomeProduto, 
            quantidade: parseInt(produto.quantidade),
            tipo: 'Exclusão',
            data: new Date().toISOString(),
            origem:'Produtos',
        });
        }
        toast.success("Produto excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir Produto:", error);
        toast.error("Erro ao excluir produto.");
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

  const filteredProdutos = produtos.filter((produto) => {
    const matchesSearch =
      produto.nomeProduto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.quantidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.dataCompra.toLowerCase().includes(searchTerm.toLowerCase());

    const qtd = parseInt(produto.quantidade) || 0;

    const matchesTipo =
      tipoFiltro === "menosCinco"
        ? qtd < 5
        : tipoFiltro === "entreCincoDez"
        ? qtd >= 5 && qtd <= 10
        : tipoFiltro === "maisDez"
        ? qtd > 10
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
      <ModalPDF isOpen={modalPDFOpen} onClose={closeModalPDF} onConfirm={exportarPDF} isEstoque={true}/>
    </main>
  );
}