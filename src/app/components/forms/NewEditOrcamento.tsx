'use client';
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue, update,} from 'firebase/database';
import { useParams, useRouter } from 'next/navigation';

interface Orcamento {
  id?: number;
  titulo: string,
  cliente: string,
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

interface Props {
  orcamento?: Orcamento;
}

export default function NewEditOrcamentoForm({ orcamento }: Props) {
  const [titulo, setTitulo] = useState('');
  const [cliente, setCliente] = useState('');
  const [dataCriacao, setDataCriacao] = useState('');
  const [garantia, setGarantia] = useState('');
  const [descricao, setDescricao] = useState('');
  const [solucao, setSolucao] = useState('');
  const [produtos, setProdutos] = useState('');
  const [quantidadeProdutos, setQuantidadeProdutos] = useState(''); 
  const [outros, setOutros] = useState('');
  const [valorFrete, setValorFrete] = useState('');
  const [valorTotal, setValorTotal] = useState('');

  const [listaProdutos, setListaProdutos] = useState<{ produto: string; quantidade: string }[]>([]);
  const [clientesDisponiveis, setClientesDisponiveis] = useState<{id: string, nome: string}[]>([]);

  const {id} = useParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const database = getDatabase();
  
    const dados = {
      titulo,
      cliente,
      descricao,
      solucao,
      dataCriacao,
      garantia,
      produtos: listaProdutos,
      outros,
      valorFrete,
      valorTotal,
    };

    try {
      if (orcamento && id) {
        const refPath = ref(database, `DadosOrcamentos/${id}`); 
        await update(refPath, dados); 
        alert('Orçamento atualizado com sucesso!');
      } else {
        const refPath = ref(database, 'DadosOrcamentos'); 
        await push(refPath, dados); 
        alert('Orçamento criado com sucesso!');
      }
      
      setTitulo('');
      setCliente('');
      setDescricao('');
      setSolucao('');
      setDataCriacao('');
      setGarantia('');
      setProdutos('');
      setQuantidadeProdutos('');
      setOutros('');
      setValorFrete('');
      setValorTotal('');
      setListaProdutos([]);
      
      // Redireciona para a tela de /home/... após salvar os dados
      router.push('/home/orcamentos');
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
            nome: clienteData.nome || clienteData.nomeFornecedor || 'Sem nome'
          })
        );
        setClientesDisponiveis(clientesArray);
      } else {
        setClientesDisponiveis([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (orcamento) {
      setTitulo(orcamento.titulo);
      setCliente(orcamento.cliente);
      setDescricao(orcamento.descricao);
      setSolucao(orcamento.solucao);
      setDataCriacao(orcamento.dataCriacao);
      setGarantia(orcamento.garantia);
      setListaProdutos(orcamento.produtos || []);
      setOutros(orcamento.outros || '');
      setValorFrete(orcamento.valorFrete || '');
      setValorTotal(orcamento.valorTotal);
    }

    const refDados = ref(getDatabase(), "DadosOrcamentos");

    onValue(refDados, (snapshot) => {
      if (snapshot.exists()) {
        const resultadoDados = Object.entries(snapshot.val()).map(([key, valor]: [string, any]) => ({
          key,
          titulo: valor.titulo,
          cliente: valor.cliente,
          descricao: valor.descricao,
          solucao: valor.solucao,
          dataCriacao: valor.dataCriacao,
          garantia: valor.garantia,
          produtos: valor.produtos,
          outros: valor.outros,
          valorFrete: valor.valorFrete,
          valorTotal: valor.valorTotal,
        }));
        console.log(resultadoDados);
      } else {
        console.log("Nenhum dado encontrado.");
      }
    });
  }, [orcamento]);



  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <div className="pb-14">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="sm:col-span-full">
              <h2 className="text-base/7 font-semibold text-gray-900">Informações Gerais:</h2>
            </div>  
            <div className="sm:col-span-3 col-span-6">
              <label htmlFor="titulo" className="block text-sm/6 font-medium text-gray-900">
                Título
              </label>
              <div className="mt-2">
                <input
                  id="titulo"
                  name="titulo"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setTitulo(e.target.value)}
                  value={titulo}
                />
              </div>
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
                  onChange={(e) => setCliente(e.target.value)}
                  value={cliente}
                >
                  <option value="">Selecione</option>
                  {clientesDisponiveis.map((cliente) => (
                    <option key={cliente.id} value={cliente.nome}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
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
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="garantia"
                  name="garantia"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setGarantia(e.target.value)}
                  value={garantia}
                >
                  <option>Selecione</option>
                  <option value="umMes">1 meses</option>
                  <option value="tresMeses">3 meses</option>
                  <option value="seisMeses">6 meses</option>
                  <option value="umAno">1 ano</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="descricao" className="block text-sm/6 font-medium text-gray-900">
                Descrição do problema
              </label>
              <div className="mt-2">
                <textarea
                id="descricao"
                name="descricao"
                rows={4}
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                onChange={(e) => setDescricao(e.target.value)}
                value={descricao}
                placeholder="Digite a descrição do problema aqui..."
              />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="solucao" className="block text-sm/6 font-medium text-gray-900">
                Solução Proposta
              </label>
              <div className="mt-2">
                <textarea
                id="solucao"
                name="solucao"
                rows={4}
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                onChange={(e) => setSolucao(e.target.value)}
                value={solucao}
                placeholder="Digite a solução aqui..."
              />
              </div>
            </div>

            <div className='sm:col-span-full mt-3'>
              <h2 className="text-base/7 font-semibold text-gray-900">Itens e peças necessárias</h2>
            </div>

            <div className="sm:col-span-2">
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
              <label htmlFor="bairro" className="block text-sm/6 font-medium text-gray-900">
                Quantidade
              </label>
              <div className="mt-2">
                <input
                  id="bairro"
                  name="bairro"
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

            <div className="sm:col-span-4">
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

            <div className="sm:col-span-2">
              <label htmlFor="complemento" className="block text-sm/6 font-medium text-gray-900">
                Outros
              </label>
              <div className="mt-2">
                <input
                  id="complemento"
                  name="complemento"
                  type="text"
                  autoComplete="postal-code"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setOutros(e.target.value)}
                  value={outros}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="complemento" className="block text-sm/6 font-medium text-gray-900">
                Valor do Frete
              </label>
              <div className="mt-2">
                <input
                  id="complemento"
                  name="complemento"
                  type="text"
                  autoComplete="postal-code"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setValorFrete(e.target.value)}
                  value={valorFrete}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="complemento" className="block text-sm/6 font-medium text-gray-900">
                Valor Total
              </label>
              <div className="mt-2">
                <input
                  id="complemento"
                  name="complemento"
                  type="text"
                  autoComplete="postal-code"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setValorTotal(e.target.value)}
                  value={valorTotal}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
                Formas de Pagamentos
                <ul className='mt-2 bg-second-white w-full border text-sm px-3 py-2 rounded-md'>
                  <li>• Pix</li>
                  <li>• Dinheiro</li>
                  <li>• Cartão de crédito/débito (com acréscimo da máquina.)</li>
                </ul>
            
            </div>

          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link href="/home/orcamentos">
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
