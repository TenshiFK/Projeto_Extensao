'use client';
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { useRouter } from 'next/navigation'; // Importando o useRouter

type Dados ={
  chave: string,
  nome: string,
  email: string,
  telefone: string,
  tipoCliente: string,
  endereco: string,
  bairro: string,
  cep: string,
  numero: string,
  complemento: string
}

interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  tipoCliente: string;
  endereco?: string;
  bairro?: string;
  cep?: string;
  numero?: string;
  complemento?: string;
}

interface Props {
  cliente?: Cliente; // O cliente pode ser opcional (para criação de novos clientes)
}

export default function NewEditClientForm({ cliente }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipoCliente, setTipoCliente] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [Dados, setDados] = useState<Dados[]>();

  const router = useRouter(); // Usando o hook useRouter para redirecionamento

  const gravar = (event: React.FormEvent) => {
    event.preventDefault();
  
    const database = getDatabase(); // Inicializando o banco de dados
  
    const dados = {
      nome,
      email,
      telefone,
      tipoCliente,
      endereco,
      bairro,
      cep,
      numero,
      complemento,
    };
  
    const refPath = ref(database, 'Dados'); // Referência ao caminho 'Dados' no Realtime Database
    push(refPath, dados); // Adiciona os dados no Realtime Database

    setNome('');
    setEmail('');
    setTelefone('');
    setTipoCliente('');
    setEndereco('');
    setBairro('');
    setCep('');
    setNumero('');
    setComplemento('');

    // Redireciona para a tela de /home/clientes após salvar os dados
    router.push('/home/clientes');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: Cliente = {
      nome,
      email,
      telefone,
      tipoCliente,
      endereco,
      bairro,
      cep,
      numero,
      complemento
    };
  
    if (cliente) {
      console.log('Atualizando cliente:', formData);
      // Lógica para atualizar um cliente existente (não implementada aqui)
    } else {
      console.log('Criando novo cliente:', formData);
      gravar(e); // Chama a função para gravar os dados no banco
    }
  };

  useEffect(() => {
    if (cliente) {
      // Preenche os campos do formulário com os dados do cliente, se fornecido
      setNome(cliente.nome);
      setEmail(cliente.email);
      setTelefone(cliente.telefone);
      setTipoCliente(cliente.tipoCliente);
      setEndereco(cliente.endereco || '');
      setBairro(cliente.bairro || '');
      setCep(cliente.cep || '');
      setNumero(cliente.numero || '');
      setComplemento(cliente.complemento || '');
    }

    const refDados = ref(getDatabase(), "Dados");

    onValue(refDados, (snapshot) => {
      if (snapshot.exists()) {
        const resultadoDados = Object.entries(snapshot.val()).map(([chave, valor]: [string, any]) => ({
          chave,
          nome: valor.nome,
          email: valor.email,
          telefone: valor.telefone,
          tipoCliente: valor.tipoCliente,
          endereco: valor.endereco,
          bairro: valor.bairro,
          cep: valor.cep,
          numero: valor.numero,
          complemento: valor.complemento,
        }));
        console.log(resultadoDados);
      } else {
        console.log("Nenhum dado encontrado.");
      }
    });
  }, [cliente]); // Adicionando o 'cliente' como dependência

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <div className="pb-14">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="sm:col-span-full">
              <h2 className="text-base/7 font-semibold text-gray-900">Informações Pessoais:</h2>
            </div>  
            <div className="sm:col-span-3">
              <label htmlFor="nome" className="block text-sm/6 font-medium text-gray-900">
                Nome do cliente
              </label>
              <div className="mt-2">
                <input
                  id="nome"
                  name="nome"
                  type="nome"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setNome(e.target.value)}
                  value={nome}
                />
              </div>
            </div>
            <div className="sm:col-span-3">
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

            <div className="sm:col-span-2">
              <label htmlFor="telefone" className="block text-sm/6 font-medium text-gray-900">
                Telefone/Celular
              </label>
              <div className="mt-2">
                <input
                  id="telefone"
                  name="telefone"
                  type="telefone"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setTelefone(e.target.value)}
                  value={telefone}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="tipoCliente" className="block text-sm/6 font-medium text-gray-900">
                Tipo de Cliente
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="tipoCliente"
                  name="tipoCliente"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setTipoCliente(e.target.value)}
                  value={tipoCliente}
                >
                  <option>Selecione</option>
                  <option>Refrigeração</option>
                  <option>Tercerizado</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

            <div className='sm:col-span-full mt-3'>
              <h2 className="text-base/7 font-semibold text-gray-900">Endereço</h2>
            </div>

            <div className="col-span-3">
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

            <div className="col-span-3">
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

            <div className="sm:col-span-2 sm:col-start-1">
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

            <div className="sm:col-span-2">
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

            <div className="sm:col-span-2">
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
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link href="/home/clientes">
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
