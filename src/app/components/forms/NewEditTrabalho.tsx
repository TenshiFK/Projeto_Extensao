'use client';
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue, update,} from 'firebase/database';
import { useParams, useRouter } from 'next/navigation'; // Importando o useRouter

interface Trabalho {
  id?: number;
  cliente: {
    id: string;
    nome: string;
  },
  orcamento?: {
    id: string;
    titulo: string;
  },
  descricao: string,
  solucao: string,
  dataCriacao: string,
  garantia: string,
  statusOrdem: string,
  produtos?: {
    produto: string;
    quantidade: string;
  }[],
  outros?: string,
  valorFrete?: string,
  valorTotal: string,
  pagamento: string,
  statusPagamento: string,
}

interface Props {
  trabalho?: Trabalho; // O cliente pode ser opcional (para criação de novos clientes)
}

export default function NewEditTrabalhoForm({ trabalho }: Props) {
  const [cliente, setCliente] = useState<{ id: string; nome: string }>({ id: '', nome: '' });
  const [orcamento, setOrcamento] = useState<{id: string; titulo: string}>({ id: '', titulo: '' });
  const [descricao, setDescricao] = useState('');
  const [solucao, setSolucao] = useState('');
  const [dataCriacao, setDataCriacao] = useState('');
  const [garantia, setGarantia] = useState('');
  const [statusOrdem, setStatusOrdem] = useState('');
  const [produtos, setProdutos] = useState('');
  const [quantidadeProdutos, setQuantidadeProdutos] = useState(''); 
  const [outros, setOutros] = useState('');
  const [valorFrete, setValorFrete] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [pagamento, setPagamento] = useState('');
  const [statusPagamento, setStatusPagamento] = useState('');

  const [listaProdutos, setListaProdutos] = useState<{ produto: string; quantidade: string }[]>([]);
  const [clientesDisponiveis, setClientesDisponiveis] = useState<{ id: string; nome: string }[]>([]);
  
  const {id} = useParams(); // Obtendo o ID da URL (se necessário)
  const router = useRouter(); // Usando o hook useRouter para redirecionamento

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const database = getDatabase(); // Inicializando o banco de dados
  
    const dados = {
      cliente,
      orcamento,
      descricao,
      solucao,
      dataCriacao,
      garantia,
      statusOrdem,
      produtos: listaProdutos, // Usando a lista de produtos
      outros,
      valorFrete,
      valorTotal,
      pagamento,
      statusPagamento,
    };

    try {
      if (trabalho && id){
        const refPath = ref(database, `Dados/${id}`);
        await update(refPath, dados); // Atualiza os dados no Realtime Database
        alert('Trabalho atualizado com sucesso!');
      } else {
        const refPath = ref(database, 'Dados'); // Referência ao caminho 'Dados' no Realtime Database
        await push(refPath, dados); // Adiciona os dados no Realtime Database
        alert('Trabalho criado com sucesso!');
      }

      setCliente({ id: '', nome: ''}); // Limpa o campo de cliente após salvar
      setOrcamento({ id: '', titulo: ''}); // Limpa o campo de orçamento após salvar
      setDescricao('');
      setSolucao('');
      setDataCriacao('');
      setGarantia('');
      setStatusOrdem('');
      setProdutos('');
      setQuantidadeProdutos('');
      setOutros('');
      setValorFrete('');
      setValorTotal('');
      setPagamento('');
      setStatusPagamento('');
      setListaProdutos([]); // Limpa a lista de produtos após salvar

      // Redireciona para a tela de /home/clientes após salvar os dados
      router.push('/home/trabalhos');

    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
    }
  };

  useEffect(() => {
    const database = getDatabase();
    const refClientes = ref(database, "Dados");
  
    const unsubscribe = onValue(refClientes, (snapshot) => {
      if (snapshot.exists()) {
        const clientesArray = Object.entries(snapshot.val()).map(
          ([id, clienteData]: [string, any]) => ({
            id,
            nome: clienteData.nome,
          })
        );
        setClientesDisponiveis(clientesArray);
      } else {
        setClientesDisponiveis([]);
      }
    });
  
    return () => unsubscribe(); // Limpeza do listener quando o componente desmontar
  }, []);

  //UseEffect para preencher os campos do formulário com os dados do Trabalho
  useEffect(() => {
    if (trabalho) {
      // Preenche os campos do formulário com os dados do cliente, se fornecido
      setCliente(trabalho.cliente);
      setOrcamento(trabalho.orcamento || { id: '', titulo: '' });
      setDescricao(trabalho.descricao);
      setSolucao(trabalho.solucao);
      setDataCriacao(trabalho.dataCriacao);
      setGarantia(trabalho.garantia);
      setStatusOrdem(trabalho.statusOrdem);
      setListaProdutos(trabalho.produtos || []);
      setOutros(trabalho.outros || '');
      setValorFrete(trabalho.valorFrete || '');
      setValorTotal(trabalho.valorTotal);
      setPagamento(trabalho.pagamento);
      setStatusPagamento(trabalho.statusPagamento);
    }

    const refDados = ref(getDatabase(), "Dados");

    onValue(refDados, (snapshot) => {
      if (snapshot.exists()) {
        const resultadoDados = Object.entries(snapshot.val()).map(([key, valor]: [string, any]) => ({
          key,
          cliente: valor.cliente,
          orcamento: valor.orcamento,
          descricao: valor.descricao,
          solucao: valor.solucao,
          dataCriacao: valor.dataCriacao,
          garantia: valor.garantia,
          statusOrdem: valor.statusOrdem,
          produtos: valor.produtos,
          quantidadeProdutos: valor.quantidadeProdutos,
          outros: valor.outros,
          valorFrete: valor.valorFrete,
          valorTotal: valor.valorTotal,
          pagamento: valor.pagamento,
          setStatusPagamento: valor.statusPagamento,
        }));
        console.log(resultadoDados);
      } else {
        console.log("Nenhum dado encontrado.");
      }
    });
  }, [trabalho]); // Adicionando o 'cliente' como dependência

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <div className="pb-14">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="sm:col-span-full">
              <h2 className="text-base/7 font-semibold text-gray-900">Informações Gerais:</h2>
            </div>  
            <div className="sm:col-span-3 col-span-6">
              <label htmlFor="cliente" className="block text-sm/6 font-medium text-gray-900">
                Cliente
              </label>
              <div className="mt-2 grid grid-cols-1">
              <select
                  id="cliente"
                  name="cliente"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => {
                    const clienteId = e.target.value;
                    const clienteSelecionado = clientesDisponiveis.find((c) => c.id === clienteId);
                    if (clienteSelecionado) {
                      setCliente({ id: clienteSelecionado.id, nome: clienteSelecionado.nome });
                    }
                  }}
                  value={cliente.id}
                >
                  <option value="">Selecione</option>
                  {clientesDisponiveis.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>
            <div className="sm:col-span-3 col-span-6">
              <label htmlFor="orcamento" className="block text-sm/6 font-medium text-gray-900">
                Orçamento
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="orcamento"
                  name="orcamento"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={
                    (e) => setOrcamento({ id: e.target.value, titulo: e.target.options[e.target.selectedIndex].text })}
                  value={orcamento.id}
                >
                  <option>Selecione</option>
                  <option>Orçamento 1</option>
                  <option>Orçamento 2</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

            <div className="sm:col-span-3 col-span-6">
              <label htmlFor="descricao" className="block text-sm/6 font-medium text-gray-900">
                Descrição
              </label>
              <div className="mt-2">
                <input
                  id="descricao"
                  name="descricao"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setDescricao(e.target.value)}
                  value={descricao}
                />
              </div>
            </div>

            <div className="sm:col-span-3 col-span-6">
              <label htmlFor="solucao" className="block text-sm/6 font-medium text-gray-900">
                Solução Proposta
              </label>
              <div className="mt-2">
                <input
                  id="solucao"
                  name="solucao"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setSolucao(e.target.value)}
                  value={solucao}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="dataCriacao" className="block text-sm/6 font-medium text-gray-900">
                Data de Criação
              </label>
              <div className="mt-2">
                <input
                  id="dataCriacao"
                  name="dataCriacao"
                  type="date"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setDataCriacao(e.target.value)}
                  value={dataCriacao}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="garantia" className="block text-sm/6 font-medium text-gray-900">
                Tempo de Garantia
              </label>
              <div className="mt-2">
                <input
                  id="garantia"
                  name="garantia"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setGarantia(e.target.value)}
                  value={garantia}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="statusOrdem" className="block text-sm/6 font-medium text-gray-900">
                Status do trabalho
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="statusOrdem"
                  name="statusOrdem"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setStatusOrdem(e.target.value)}
                  value={statusOrdem}
                >
                  <option>Selecione</option>
                  <option>Finalizado</option>
                  <option>Em andamento</option>
                  <option>Apenas Orçado</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

            <div className='sm:col-span-full mt-3'>
              <h2 className="text-base/7 font-semibold text-gray-900">Peças Utilizadas</h2>
            </div>

            <div className="sm:col-span-2 col-span-3">
              <label htmlFor="produtos" className="block text-sm/6 font-medium text-gray-900">
                Produtos
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="produtos"
                  name="produtos"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setProdutos(e.target.value)}
                  value={produtos}
                >
                  <option>Selecione</option>
                  <option>Produto 1</option>
                  <option>Produto 2</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="quantidade" className="block text-sm/6 font-medium text-gray-900">
                Quantidade
              </label>
              <div className="mt-2">
                <input
                  id="quantidade"
                  name="quantidade"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setQuantidadeProdutos(e.target.value)}
                  value={quantidadeProdutos}
                />
              </div>
            </div>

            <div className="col-span-1 flex items-end">
                <button
                    type="button"
                    onClick={() => {
                        if (produtos && quantidadeProdutos) {
                        setListaProdutos([...listaProdutos, { produto: produtos, quantidade: quantidadeProdutos }]);
                        setProdutos('');
                        setQuantidadeProdutos('');
                        }
                    }}
                    className='bg-main-blue text-main-white rounded-md px-3 py-2 text-sm font-semibold shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                    Adicionar
                </button>
            </div>

            <div className="sm:col-span-4 col-span-6">
              <table className='min-w-full border border-gray-300'>
                <thead className='bg-gray-200'>
                  <tr>
                    <th className="text-left border">Produto</th>
                    <th className="text-left border">Quantidade</th>
                    <th className="text-left border">Ações</th>
                  </tr>
                </thead>
                <tbody>
                {listaProdutos.map((item, index) => (
                    <tr key={index}>
                    <td className='border'>{item.produto}</td>
                    <td className='border'>{item.quantidade}</td>
                    <td className='border'>
                        <button
                        type="button"
                        className="text-red-500"
                        onClick={() => {
                            const novaLista = listaProdutos.filter((_, i) => i !== index);
                            setListaProdutos(novaLista);
                        }}
                        >
                        Remover
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>

            <div className='hidden sm:block sm:col-span-2'></div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="ouros" className="block text-sm/6 font-medium text-gray-900">
                Outros
              </label>
              <div className="mt-2">
                <input
                  id="ouros"
                  name="ouros"
                  type="text"
                  autoComplete="postal-code"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setOutros(e.target.value)}
                  value={outros}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="valorFrete" className="block text-sm/6 font-medium text-gray-900">
                Valor do Frete
              </label>
              <div className="mt-2">
                <input
                  id="valorFrete"
                  name="valorFrete"
                  type="text"
                  autoComplete="postal-code"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setValorFrete(e.target.value)}
                  value={valorFrete}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="valorTotal" className="block text-sm/6 font-medium text-gray-900">
                Valor Total
              </label>
              <div className="mt-2">
                <input
                  id="valorTotal"
                  name="valorTotal"
                  type="text"
                  autoComplete="postal-code"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setOutros(e.target.value)}
                  value={outros}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="pagamento" className="block text-sm/6 font-medium text-gray-900">
                Forma de Pagamento
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="pagamento"
                  name="pagamento"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setPagamento(e.target.value)}
                  value={pagamento}
                >
                  <option>Selecione</option>
                  <option>Dinheiro</option>
                  <option>Cartão de Crédito</option>
                  <option>Cartão de Débito</option>
                  <option>Transferência</option>
                  <option>Pix</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="statusPagamento" className="block text-sm/6 font-medium text-gray-900">
                Status do Pagamento
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="statusPagamento"
                  name="statusPagamento"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setStatusPagamento(e.target.value)}
                  value={statusPagamento}
                >
                  <option>Selecione</option>
                  <option>Finalizado</option>
                  <option>Em andamento</option>
                  <option>Apenas Orçado</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link href="/home/trabalhos">
          <button type="button" className="text-sm/6 font-semibold text-main-white px-3 py-2 bg-red-500 rounded-md shadow-xs hover:bg-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
            Cancelar
          </button>
        </Link>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Salvar
        </button>
      </div>
    </form>
  )
}
