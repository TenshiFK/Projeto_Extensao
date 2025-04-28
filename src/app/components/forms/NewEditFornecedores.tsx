'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue, update,} from 'firebase/database';
import { useParams, useRouter } from 'next/navigation'; // Importando o useRouter

interface Fornecedor {
  id?: number;
  nomeFornecedor: string,
  email?: string,
  telefone: string,
  endereco?: string,
  bairro?: string,
  cidade?: string,
  cep?: string,
  numero?: string,
  complemento?: string,
  informacoesAdicionais?: string,
}

interface Props {
  fornecedor?: Fornecedor; // O cliente pode ser opcional (para criação de novos clientes)
}

export default function NewEditFornecedoresForm({ fornecedor }: Props) {
  const [nomeFornecedor, setNomeFornecedor] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [informacoesAdicionais, setInformacoesAdicionais] = useState('');

  const {id} = useParams(); // Obtendo o id do fornecedor da URL
  const router = useRouter(); // Usando o hook useRouter para redirecionamento

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const database = getDatabase(); // Inicializando o banco de dados
  
    const dados = {
      nomeFornecedor,
      email,
      telefone,
      cidade,
      endereco,
      bairro,
      cep,
      numero,
      complemento,
      informacoesAdicionais
    };

    try {
      if (fornecedor && id) {
        const refPath = ref(database, `DadosFornecedores/${id}`); // Referência ao caminho 'Dados' no Realtime Database
        await update(refPath, dados); // Adiciona os dados no Realtime Database
        alert("Fornecedor atualizado com sucesso");
      } else {
        const refPath = ref(database, 'DadosFornecedores'); // Referência ao caminho 'Dados' no Realtime Database
        await push(refPath, dados); // Adiciona os dados no Realtime Database
        alert("Fornecedor cadastrado com sucesso");
      }

      setNomeFornecedor('');
      setEmail('');
      setTelefone('');
      setCidade('');
      setEndereco('');
      setBairro('');
      setCep('');
      setNumero('');
      setComplemento('');
      setInformacoesAdicionais('');

      // Redireciona para a tela de /home/... após salvar os dados
      router.push('/home/fornecedores');

    } catch (error) {
      console.error("Erro ao gravar os dados:", error);
    }
  };

  useEffect(() => {
    if (fornecedor) {
      // Preenche os campos do formulário com os dados, se fornecido
      setNomeFornecedor(fornecedor.nomeFornecedor);
      setEmail(fornecedor.email || '');
      setTelefone(fornecedor.telefone);
      setEndereco(fornecedor.endereco || '');
      setBairro(fornecedor.bairro || '');
      setCidade(fornecedor.cidade || '');
      setCep(fornecedor.cep || '');
      setNumero(fornecedor.numero || '');
      setComplemento(fornecedor.complemento || '');
      setInformacoesAdicionais(fornecedor.informacoesAdicionais || '');
    }

    const refDados = ref(getDatabase(), "DadosFornecedores"); // Referência ao caminho 'Dados' no Realtime Database

    onValue(refDados, (snapshot) => {
      if (snapshot.exists()) {
        const resultadoDados = Object.entries(snapshot.val()).map(([key, valor]: [string, any]) => ({
          key,
          nomeFornecedor: valor.nomeFornecedor,
          email: valor.email,
          telefone: valor.telefone,
          endereco: valor.endereco,
          bairro: valor.bairro,
          cidade: valor.cidade,
          cep: valor.cep,
          numero: valor.numero,
          complemento: valor.complemento,
          informacoesAdicionais: valor.informacoesAdicionais,
          
        }));
        console.log(resultadoDados);
      } else {
        console.log("Nenhum dado encontrado.");
      }
    });
  }, [fornecedor]); // Adicionando o 'peoduto' como dependência

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <div className="pb-14">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="sm:col-span-full w-60">
              <h2 className="text-base/7 font-semibold text-gray-900">Informações Pessoais:</h2>
            </div>  
            <div className="sm:col-span-3 col-span-6">
              <label htmlFor="nome" className="block text-sm/6 font-medium text-gray-900">
                Nome do fornecedor
              </label>
              <div className="mt-2">
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setNomeFornecedor(e.target.value)}
                  value={nomeFornecedor}
                />
              </div>
            </div>
            <div className="sm:col-span-3 col-span-6">
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                  E-mail
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="telefone" className="block text-sm/6 font-medium text-gray-900">
                Telefone/Celular
              </label>
              <div className="mt-2">
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setTelefone(e.target.value)}
                  value={telefone}
                />
              </div>
            </div>

            <div className='sm:col-span-full mt-3 w-60'>
              <h2 className="text-base/7 font-semibold text-gray-900">Endereço</h2>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="endereco" className="block text-sm/6 font-medium text-gray-900">
                Endereço
              </label>
              <div className="mt-2">
                <input
                  id="endereco"
                  name="endereco"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setEndereco(e.target.value)}
                  value={endereco}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="bairro" className="block text-sm/6 font-medium text-gray-900">
                Bairro
              </label>
              <div className="mt-2">
                <input
                  id="bairro"
                  name="bairro"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setBairro(e.target.value)}
                  value={bairro}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="cidade" className="block text-sm/6 font-medium text-gray-900">
                Cidade
              </label>
              <div className="mt-2">
                <input
                  id="cidade"
                  name="cidade"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setCidade(e.target.value)}
                  value={cidade}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="cep" className="block text-sm/6 font-medium text-gray-900">
                CEP
              </label>
              <div className="mt-2">
                <input
                  id="cep"
                  name="cep"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setCep(e.target.value)}
                  value={cep}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="numero" className="block text-sm/6 font-medium text-gray-900">
                Número
              </label>
              <div className="mt-2">
                <input
                  id="numero"
                  name="numero"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setNumero(e.target.value)}
                  value={numero}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
              <label htmlFor="complemento" className="block text-sm/6 font-medium text-gray-900">
                Complemento
              </label>
              <div className="mt-2">
                <input
                  id="complemento"
                  name="complemento"
                  type="text"
                  autoComplete="postal-code"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setComplemento(e.target.value)}
                  value={complemento}
                />
              </div>
            </div>

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
                onChange={(e) => setInformacoesAdicionais(e.target.value)}
                value={informacoesAdicionais}
                placeholder="Digite a informação do fornecedor aqui..."
              />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link href="/home/fornecedores">
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
