'use client';
import { ChevronDownIcon, TrashIcon } from '@heroicons/react/16/solid'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, getDocs } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { db } from '@/app/services/firebase/firebaseconfig';
import { IMaskInput } from 'react-imask';

interface Orcamento {
  id?: string;
  titulo: string;
  cliente: {id: string; nome: string;};
  dataCriacao: string;
  garantia: string;
  descricao: string;
  solucao: string;
  produtos?: {produto: string; quantidade: string;}[];
  outros?: string;
  valorFrete?: string;
  valorTotal: string;
}

interface Props {
  orcamento?: Orcamento;
}

export default function NewEditOrcamentoForm({ orcamento }: Props) {
  const [titulo, setTitulo] = useState('');
  const [cliente, setCliente] = useState<{ id: string; nome: string }>({ id: '', nome: '' });
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

  const [clientesDisponiveis, setClientesDisponiveis] = useState<{ id: string; nome: string }[]>([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<{ id: string; nomeProduto: string }[]>([]);

  const [errors, setErrors] = useState({
    titulo: false,
    dataCriacao: false,
    valorTotal: false,
  });

  const { id } = useParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      titulo: titulo.trim() === '',
      dataCriacao: dataCriacao.trim() === '',
      valorTotal: valorTotal.trim() === '',
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    } 

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
        const orcamentoRef = doc(db, 'Orcamentos', id as string);
        await updateDoc(orcamentoRef, dados);
        toast.success('Orçamento atualizado com sucesso!');
        router.push(`/home/orcamentos/${id}`);
      } else {
        const orcamentosRef = collection(db, 'Orcamentos');
        const docRef = await addDoc(orcamentosRef, dados);
        toast.success('Orçamento cadastrado com sucesso!');
        router.push(`/home/orcamentos/${docRef.id}`);
      }

      setTitulo('');
      setCliente({ id: '', nome: '' });
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

    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      toast.error('Erro ao salvar os dados. Tente novamente.');
    }
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Clientes'));
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome,
        }));
        setClientesDisponiveis(lista);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Produtos'));
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          nomeProduto: doc.data().nomeProduto,
        }));
        setProdutosDisponiveis(lista);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
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
  }, [orcamento]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <div className="pb-14">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="col-span-6">
              <h2 className="text-base/7 font-semibold text-gray-900">Informações Gerais:</h2>
            </div>
            <div className="sm:col-span-3 col-span-6">
              <label htmlFor="titulo" className="block text-sm/6 font-medium text-gray-900">
                Título
                <span className='text-red-500 ml-1 text-lg'>*</span>
              </label>
              <div className="mt-2">
                <input
                  id="titulo"
                  name="titulo"
                  type="text"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 ${
                    errors.titulo ? 'border border-red-500' : 'outline-gray-300 outline-1 -outline-offset-1'
                  } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
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
                  {clientesDisponiveis.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
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
                <span className='text-red-500 ml-1 text-lg'>*</span>
              </label>
              <div className="mt-2">
                <input
                  id="dataCriacao"
                  name="dataCriacao"
                  type="date"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 ${
                    errors.dataCriacao ? 'border border-red-500' : 'outline-gray-300 outline-1 -outline-offset-1'
                  } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
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
                  <option>1 mês</option>
                  <option>3 meses</option>
                  <option>6 meses</option>
                  <option>1 ano</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

            <div className="sm:col-span-3 col-span-6">
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

            <div className="sm:col-span-3 col-span-6">
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

            <div className='col-span-6 mt-3'>
              <h2 className="text-base/7 font-semibold text-gray-900">Itens e peças necessárias</h2>
            </div>

            <div className="sm:col-span-2 col-span-6">
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
                  {produtosDisponiveis.map((produto) => (
                    <option key={produto.id} value={produto.nomeProduto}>
                      {produto.nomeProduto}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

            <div className="sm:col-span-1 col-span-6">
              <label htmlFor="quantidade" className="block text-sm/6 font-medium text-gray-900">
                Quantidade
              </label>
              <div className="mt-2">
                <IMaskInput
                  mask={Number}
                  id="quantidade"
                  name="quantidade"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onAccept={(value) => setQuantidadeProdutos(value)}
                  value={quantidadeProdutos}
                />
              </div>
            </div>

            <div className="sm:col-span-1 col-span-6 flex items-end">
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
              {
                listaProdutos.length === 0 ?
                  <p className='text-sm text-gray-500'>Nenhum produto adicionado ainda.</p>
                  :
                  <table className='min-w-full'>
                    <thead className='bg-second-white'>
                      <tr>
                        <th className="text-left border border-main-blue px-1 py-1 text-main-blue">Produto</th>
                        <th className="text-left border border-main-blue px-1 py-1 text-main-blue">Quantidade</th>
                        <th className="text-left border border-main-blue px-1 py-1 text-main-blue">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaProdutos.map((item, index) => (
                        <tr key={index} className="border border-gray-950 bg-third-white">
                          <td className='border border-gray-950 px-1 py-1 bg-third-white'>{item.produto}</td>
                          <td className='border border-gray-950 px-1 py-1 bg-third-white'>{item.quantidade}</td>
                          <td className='border border-gray-950 px-1 py-1 bg-third-white text-center'>
                            <button
                              type="button"
                              onClick={() => {
                                const novaLista = listaProdutos.filter((_, i) => i !== index);
                                setListaProdutos(novaLista);
                              }}
                            >
                              <TrashIcon className="w-5 h-5 text-main-blue cursor-pointer" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              }
            </div>

            <div className='hidden sm:block sm:col-span-2'></div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="complemento" className="block text-sm/6 font-medium text-gray-900">
                Outros
              </label>
              <div className="mt-2">
                <input
                  id="complemento"
                  name="complemento"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setOutros(e.target.value)}
                  value={outros}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="complemento" className="block text-sm/6 font-medium text-gray-900">
                Valor do Frete
              </label>
              <div className="mt-2">
                <IMaskInput
                  id="valorFrete"
                  name="valorFrete"
                  mask={Number} 
                  scale={2}
                  thousandsSeparator="."
                  radix=","
                  mapToRadix={['.', ',']}
                  normalizeZeros={true}
                  padFractionalZeros={true}
                  placeholder='00,00'
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onAccept={(value) => setValorFrete(value)}
                  value={valorFrete}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="complemento" className="block text-sm/6 font-medium text-gray-900">
                Valor Total
              <span className='text-red-500 ml-1 text-lg'>*</span>
              </label>
              <div className="mt-2">
                <IMaskInput
                  mask={Number}
                  id="valorTotal"
                  name="valorTotal"
                  scale={2}
                  thousandsSeparator="."
                  radix=","
                  mapToRadix={['.', ',']}
                  normalizeZeros={true}
                  padFractionalZeros={true}
                  placeholder='00,00'
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 ${
                    errors.valorTotal ? 'border border-red-500' : 'outline-gray-300 outline-1 -outline-offset-1'
                  } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                  onAccept={(value) => setValorTotal(value)}
                  value={valorTotal}
                />
              </div>
            </div>

            <div className="sm:col-span-3 col-span-6">
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

      <div className="mt-6 flex items-center justify-end gap-x-14">
        <button
          type="submit"
          className="text-center bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-8 rounded-md 
          focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer hover:bg-blue-900"
        >
          Salvar
        </button>
        <Link href="/home/orcamentos">
          <button type="button" className="cursor-pointer lg:text-base text-sm font-semibold text-main-white py-2 px-8 bg-red-500 rounded-md shadow-xs hover:bg-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
            Cancelar
          </button>
        </Link>
      </div>
    </form>
  )
}
