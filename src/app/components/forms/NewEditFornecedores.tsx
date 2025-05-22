'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { db } from '@/app/services/firebase/firebaseconfig'; // Certifique-se de exportar corretamente o Firestore como `db`

interface Fornecedor {
  id?: string;
  nomeFornecedor: string;
  email?: string;
  telefone: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  numero?: string;
  complemento?: string;
  informacoesAdicionais?: string;
}

interface Props {
  fornecedor?: Fornecedor;
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

  const { id } = useParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        const fornecedorRef = doc(db, 'Fornecedores', id as string);
        await updateDoc(fornecedorRef, dados);
        toast.success("Fornecedor atualizado com sucesso");
      } else {
        const fornecedoresRef = collection(db, 'Fornecedores');
        await addDoc(fornecedoresRef, dados);
        toast.success("Fornecedor cadastrado com sucesso");
      }

      // Limpa o formulário
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

      router.push('/home/fornecedores');
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      toast.error("Erro ao salvar os dados. Tente novamente.");
    }
  };

  useEffect(() => {
    if (fornecedor) {
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
  }, [fornecedor]);

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
                onChange={(e) => setInformacoesAdicionais(e.target.value)}
                value={informacoesAdicionais}
                placeholder="Digite a informação do fornecedor aqui..."
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
        <Link href="/home/fornecedores">
          <button type="button" className="cursor-pointer lg:text-base text-sm font-semibold text-main-white py-2 px-5 bg-red-500 rounded-md shadow-xs hover:bg-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
            Cancelar
          </button>
        </Link>
      </div>
    </form>
  )
}
