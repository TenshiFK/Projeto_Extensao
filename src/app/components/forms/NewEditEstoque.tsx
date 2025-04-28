'use client';
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue, update,} from 'firebase/database';
import { useParams, useRouter } from 'next/navigation'; // Importando o useRouter

interface Produto {
  id?: number;
  nomeProduto: string,
  valor: string,
  dataCompra: string,
  localCompra?: string,
  quantidade: string,
  fornecedor?: {
    id: string;
    nomeFornecedor: string;
  },
  descricao?: string,
}

interface Props {
  produto?: Produto; // O cliente pode ser opcional (para criação de novos clientes)
}

export default function NewEditProdutoForm({ produto }: Props) {
    const [nomeProduto, setNomeProduto] = useState('');
    const [valor, setValor] = useState('');
    const [dataCompra, setDataCompra] = useState('');
    const [localCompra, setLocalCompra] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [fornecedor, setFornecedor] = useState<{ id: string; nomeFornecedor: string }>({ id: '', nomeFornecedor: '' });
    const [descricao, setDescricao] = useState('');
    
    const {id} = useParams(); // Obtendo o id do produto da URL
    const router = useRouter(); // Usando o hook useRouter para redirecionamento

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const database = getDatabase(); 
    
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
          const refPath = ref(database, `DadosProdutos/${id}`); // Referência ao caminho 'Dados' no Realtime Database
          await update(refPath, dados); // Atualiza os dados do produto existente
          alert('Produto atualizado com sucesso!');
        } else {
          const refPath = ref(database, 'DadosProdutos'); // Referência ao caminho 'Dados' no Realtime Database
          await push(refPath, dados); // Adiciona os dados do novo produto
          alert('Produto adicionado com sucesso!');
        } 

        setNomeProduto('');
        setValor('');
        setDataCompra('');
        setLocalCompra('');
        setQuantidade('');
        setFornecedor({ id: '', nomeFornecedor: '' });
        setDescricao('');

      // Redireciona para a tela de /home/clientes após salvar os dados
      router.push('/home/estoque');}
      catch (error) {
        console.error('Erro ao salvar os dados:', error);
      }
    };

    useEffect(() => {
      if (produto) {
        // Preenche os campos do formulário com os dados do cliente, se fornecido
        setNomeProduto(produto.nomeProduto);
        setValor(produto.valor || '');
        setDescricao(produto.descricao || '');
        setDataCompra(produto.dataCompra);
        setLocalCompra(produto.localCompra || '');
        setQuantidade(produto.quantidade);
        setFornecedor(produto.fornecedor || { id: '', nomeFornecedor: '' });
      }

      const refDados = ref(getDatabase(), "Dados");

      onValue(refDados, (snapshot) => {
        if (snapshot.exists()) {
          const resultadoDados = Object.entries(snapshot.val()).map(([key, valor]: [string, any]) => ({
            key,
            nomeProduto: valor.nomeProduto,
            valor: valor.valor,
            descricao: valor.descricao,
            dataCompra: valor.dataCompra,
            localCompra: valor.localCompra,
            quantidade: valor.quantidade,
            fornecedor: valor.fornecedor,
          }));
          console.log(resultadoDados);
        } else {
          console.log("Nenhum dado encontrado.");
        }
      });
    }, [produto]); // Adicionando o 'peoduto' como dependência

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <div className="pb-14">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="sm:col-span-full">
              <h2 className="text-base/7 font-semibold text-gray-900">Informações do Produto:</h2>
            </div>  
            <div className="sm:col-span-3">
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

            <div className="sm:col-span-3">
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

            <div className="sm:col-span-2">
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

            <div className="sm:col-span-2">
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

            <div className="col-span-2">
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

            <div className="sm:col-span-2">
              <label htmlFor="fornecedores" className="block text-sm/6 font-medium text-gray-900">
                Fornecedores
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="fornecedores"
                  name="fornecedores"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setFornecedor({ id: e.target.value, nomeFornecedor: e.target.value })}
                  value={fornecedor.id}
                >
                  <option>Selecione</option>
                  <option>Fornecedor 1</option>
                  <option>Fornecedor 2</option>
                  <option>Fornecedor 3</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

            <div className='hidden sm:block sm:col-span-4'></div>

            <div className="sm:col-span-6">
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
