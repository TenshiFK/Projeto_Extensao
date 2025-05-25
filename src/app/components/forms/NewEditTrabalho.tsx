'use client';
import { ChevronDownIcon, TrashIcon } from '@heroicons/react/16/solid'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { collection, doc, addDoc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '@/app/services/firebase/firebaseconfig';
import { IMaskInput } from 'react-imask';

interface Trabalho {
  id?: string;
  titulo: string;
  cliente: { id: string; nome: string };
  orcamento?: { id: string; titulo: string };
  descricao: string;
  solucao: string;
  dataCriacao: string;
  garantia: string;
  statusOrdem: string;
  produtos?: { produto: string; quantidade: string }[];
  outros?: string;
  valorFrete?: string;
  valorTotal: string;
  pagamento: string;
  statusPagamento: string;
}

interface Props {
  trabalho?: Trabalho;
}


export default function NewEditTrabalhoForm({ trabalho }: Props) {
  const [titulo, setTitulo] = useState('');
  const [cliente, setCliente] = useState({ id: '', nome: '' });
  const [orcamento, setOrcamento] = useState({ id: '', titulo: '' });
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
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<{ id: string; nomeProduto: string }[]>([]);
  const [orcamentosDisponiveis, setOrcamentosDisponiveis] = useState<{ id: string; titulo: string; cliente: string }[]>([]);

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
      orcamento,
      descricao,
      solucao,
      dataCriacao,
      garantia,
      statusOrdem,
      produtos: listaProdutos,
      outros,
      valorFrete,
      valorTotal,
      pagamento,
      statusPagamento,
    };

    try {
      if (trabalho && id) {
      const trabalhoRef = doc(db, 'Trabalhos', id as string);
      await updateDoc(trabalhoRef, dados);
      toast.success('Trabalho atualizado com sucesso!');
    } else {
      const trabalhosRef = collection(db, 'Trabalhos');
      await addDoc(trabalhosRef, dados);
      toast.success('Trabalho cadastrado com sucesso!');
    }
      setTitulo('');
      setCliente({ id: '', nome: '' });
      setOrcamento({ id: '', titulo: '' });
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
      setListaProdutos([]);

      router.push('/home/trabalhos');
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      toast.error('Erro ao salvar os dados.');
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
    const fetchOrcamentos = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Orcamentos'));
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          titulo: doc.data().titulo,
          cliente: doc.data().cliente.nome,
        }));
        setOrcamentosDisponiveis(lista);
      } catch (error) {
        console.error('Erro ao buscar orçamentos:', error);
      }
    };

    fetchOrcamentos();
  }, []);

  useEffect(() => {
    if (trabalho) {
      setTitulo(trabalho.titulo);
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
  }, [trabalho]);


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
                    (e) => setOrcamento({ id: e.target.value, titulo: e.target.options[e.target.selectedIndex].text})}
                  value={orcamento.id}
                >
                  <option>Selecione</option>
                  { orcamentosDisponiveis.map((orcamento) => (
                    <option key={orcamento.id} value={orcamento.id}>  
                      {orcamento.titulo} - {orcamento.cliente}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

            <div className='hidden sm:block sm:col-span-2'></div>

            <div className="sm:col-span-3 col-span-6">
              <label htmlFor="descricao" className="block text-sm/6 font-medium text-gray-900">
                Descrição
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
                  <option>1 meses</option>
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

            <div className='col-span-6 mt-3'>
              <h2 className="text-base/7 font-semibold text-gray-900">Peças Utilizadas</h2>
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
                <p className='text-sm text-gray-500'>Nenhum produto adicionado.</p> 
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
              <label htmlFor="ouros" className="block text-sm/6 font-medium text-gray-900">
                Outros
              </label>
              <div className="mt-2">
                <input
                  id="ouros"
                  name="ouros"
                  type="text"
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
              <label htmlFor="valorTotal" className="block text-sm/6 font-medium text-gray-900">
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

      <div className="mt-6 flex items-center justify-end gap-x-14">
        <button
          type="submit"
          className="text-center bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-8 rounded-md 
          focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer hover:bg-blue-900"
        >
          Salvar
        </button>
        <Link href="/home/trabalhos">
          <button type="button" className="cursor-pointer lg:text-base text-sm font-semibold text-main-white py-2 px-8 bg-red-500 rounded-md shadow-xs hover:bg-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
            Cancelar
          </button>
        </Link>
      </div>
    </form>
  )
}
