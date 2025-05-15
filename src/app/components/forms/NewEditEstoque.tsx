'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, addDoc, doc, updateDoc, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '@/app/services/firebase/firebaseconfig'; // Certifique-se de exportar 'db' corretamente
import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

interface Produto {
  id?: string;
  nomeProduto: string;
  valor: string;
  dataCompra: string;
  localCompra?: string;
  quantidade: string;
  fornecedor?: {
    id: string;
    nomeFornecedor: string;
  };
  descricao?: string;
}

interface Props {
  produto?: Produto;
}

export default function NewEditProdutoForm({ produto }: Props) {
  const [nomeProduto, setNomeProduto] = useState('');
  const [valor, setValor] = useState('');
  const [dataCompra, setDataCompra] = useState('');
  const [localCompra, setLocalCompra] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [fornecedor, setFornecedor] = useState<{ id: string; nomeFornecedor: string }>({ id: '', nomeFornecedor: '' });
  const [descricao, setDescricao] = useState('');
  const [fornecedoresDisponiveis, setFornecedoresDisponiveis] = useState<{ id: string; nomeFornecedor: string }[]>([]);

  const { id } = useParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dados = {
      nomeProduto,
      valor,
      descricao,
      dataCompra,
      localCompra,
      quantidade,
      fornecedor,
    };

    try {
      if (produto && id) {
        const docRef = doc(db, 'Produtos', id as string);
        await updateDoc(docRef, dados);
        toast.success('Produto atualizado com sucesso!');
      } else {
        const collectionRef = collection(db, 'Produtos');
        await addDoc(collectionRef, dados);
        toast.success('Produto cadastrado com sucesso!');
      }

      // Reset
      setNomeProduto('');
      setValor('');
      setDataCompra('');
      setLocalCompra('');
      setQuantidade('');
      setFornecedor({ id: '', nomeFornecedor: '' });
      setDescricao('');

      router.push('/home/estoque');
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      toast.error('Erro ao salvar os dados.');
    }
  };

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const fornecedoresRef = collection(db, 'Fornecedores');
        const snapshot = await getDocs(fornecedoresRef);
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          nomeFornecedor: doc.data().nomeFornecedor,
        }));
        setFornecedoresDisponiveis(lista);
      } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
      }
    };

    fetchFornecedores();
  }, []);

  useEffect(() => {
    if (produto) {
      setNomeProduto(produto.nomeProduto);
      setValor(produto.valor || '');
      setDescricao(produto.descricao || '');
      setDataCompra(produto.dataCompra);
      setLocalCompra(produto.localCompra || '');
      setQuantidade(produto.quantidade);
      setFornecedor(produto.fornecedor || { id: '', nomeFornecedor: '' });
    }
  }, [produto]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <div className="pb-14">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="col-span-6">
              <h2 className="text-base/7 font-semibold text-gray-900">Informações do Produto:</h2>
            </div>
            <div className="sm:col-span-3 col-span-6">
              <label htmlFor="nomeProduto" className="block text-sm/6 font-medium text-gray-900">
                Nome do Produto
              </label>
              <div className="mt-2">
                <input
                  id="nomeProduto"
                  name="nomeProduto"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setNomeProduto(e.target.value)}
                  value={nomeProduto}
                />
              </div>
            </div>

            <div className="sm:col-span-3 col-span-6">
              <label htmlFor="valor" className="block text-sm/6 font-medium text-gray-900">
                Valor do Produto
              </label>
              <div className="mt-2">
                <input
                  id="valor"
                  name="valor"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setValor(e.target.value)}
                  value={valor}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="dataCompra" className="block text-sm/6 font-medium text-gray-900">
                Data de Compra
              </label>
              <div className="mt-2">
                <input
                  id="dataCompra"
                  name="dataCompra"
                  type="date"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setDataCompra(e.target.value)}
                  value={dataCompra}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="localCompra" className="block text-sm/6 font-medium text-gray-900">
                Local da Compra
              </label>
              <div className="mt-2">
                <input
                  id="localCompra"
                  name="localCompra"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setLocalCompra(e.target.value)}
                  value={localCompra}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="quantidade" className="block text-sm/6 font-medium text-gray-900">
                Quantidade
              </label>
              <div className="mt-2">
                <input
                  id="quantidade"
                  name="quantidade"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setQuantidade(e.target.value)}
                  value={quantidade}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="fornecedores" className="block text-sm/6 font-medium text-gray-900">
                Fornecedores
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="fornecedores"
                  name="fornecedores"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => {
                    const fornecedorId = e.target.value;
                    const fornecedorSelecionado = fornecedoresDisponiveis.find((f) => f.id === fornecedorId);
                    if (fornecedorSelecionado) {
                      setFornecedor({ id: fornecedorSelecionado.id, nomeFornecedor: fornecedorSelecionado.nomeFornecedor }); // Atualiza o estado com o fornecedor selecionado
                    }
                  }}
                  value={fornecedor.id}
                >
                  <option>Selecione</option>
                  {fornecedoresDisponiveis.map((fornecedor) => (
                    <option key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nomeFornecedor}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

            <div className='hidden sm:block sm:col-span-4'></div>

            <div className="col-span-6">
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
                  placeholder="Digite a descrição do produto aqui..."
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-10">
        <button
          type="submit"
          className="text-center cursor-pointer bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-5 rounded-md hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Salvar
        </button>
        <Link href="/home/estoque">
          <button type="button" className="cursor-pointer lg:text-base text-sm font-semibold text-main-white py-2 px-5 bg-red-500 rounded-md shadow-xs hover:bg-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
            Cancelar
          </button>
        </Link>
      </div>
    </form>
  )
}
