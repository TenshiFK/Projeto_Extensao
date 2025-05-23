'use client';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { db } from '@/app/services/firebase/firebaseconfig';
import { IMaskInput } from 'react-imask';

interface Cliente {
  id?: string;
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
  cliente?: Cliente;
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

  const { id } = useParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    try {
      if (cliente && id) {
        const docRef = doc(db, 'Clientes', String(id));
        await updateDoc(docRef, dados);
        toast.success('Cliente atualizado com sucesso');
      } else {
        await addDoc(collection(db, 'Clientes'), dados);
        toast.success('Cliente cadastrado com sucesso');
      }

      setNome('');
      setEmail('');
      setTelefone('');
      setTipoCliente('');
      setEndereco('');
      setBairro('');
      setCep('');
      setNumero('');
      setComplemento('');

      router.push('/home/clientes');
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast.error('Erro ao salvar dados, tente novamente');
    }
  };

  useEffect(() => {
    const carregarCliente = async () => {
      if (cliente) {
        setNome(cliente.nome);
        setEmail(cliente.email);
        setTelefone(cliente.telefone);
        setTipoCliente(cliente.tipoCliente);
        setEndereco(cliente.endereco || '');
        setBairro(cliente.bairro || '');
        setCep(cliente.cep || '');
        setNumero(cliente.numero || '');
        setComplemento(cliente.complemento || '');
      } else if (id) {
        const docRef = doc(db, 'Clientes', String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Cliente;
          setNome(data.nome);
          setEmail(data.email);
          setTelefone(data.telefone);
          setTipoCliente(data.tipoCliente);
          setEndereco(data.endereco || '');
          setBairro(data.bairro || '');
          setCep(data.cep || '');
          setNumero(data.numero || '');
          setComplemento(data.complemento || '');
        } else {
          toast.info('Cliente não encontrado');
        }
      }
    };

    carregarCliente();
  }, [cliente, id]);

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
                Nome do cliente
                <span className='text-red-500 ml-1 text-base'>*</span>
              </label>
              <div className="mt-2">
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setNome(e.target.value)}
                  value={nome}
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
                <span className='text-red-500 ml-1 text-base'>*</span>
              </label>
              <div className="mt-2">
                <IMaskInput
                  mask={[
                    '(00) 0000-0000',   // Fixo
                    '(00) 00000-0000'   // Celular
                  ]}
                  id="telefone"
                  name="telefone"
                  type="tel"
                  required
                  placeholder="(00) 00000-0000"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onAccept={(value) => setTelefone(value)}
                  value={telefone}
                />
              </div>
            </div>

            <div className="sm:col-span-2 col-span-6">
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
                  <option>Terceirizado</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

            <div className='sm:col-span-full mt-3 w-60'>
              <h2 className="text-base/7 font-semibold text-gray-900">Endereço</h2>
            </div>

            <div className="col-span-3 col-span-6">
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

            <div className="col-span-3 col-span-6">
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
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-12">
        <button
          type="submit"
          className={`text-center bg-main-blue text-main-white lg:text-base text-sm font-semibold py-2 px-6 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2
            ${nome === '' || telefone === '' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-900 cursor-pointer'}
            `}
        disabled={nome === '' || telefone === ''}
        >
          Salvar
        </button>
        <Link href="/home/clientes">
          <button type="button" className="cursor-pointer lg:text-base text-sm font-semibold text-main-white py-2 px-6 bg-red-500 rounded-md shadow-xs hover:bg-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
            Cancelar
          </button>
        </Link>
      </div>
    </form>
  )
}
