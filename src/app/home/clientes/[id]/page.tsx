'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation'; // Corrigido para useParams
import { useEffect, useState } from 'react';

// Definir uma interface para os dados do cliente
interface Cliente {
  id: number;
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

const dataBody: Cliente[] = [
  { id: 1, nome: 'João da Silva', telefone: '11 99999-9999', email: 'teste@teste.com', tipoCliente: 'Tercerizado', endereco: 'Rua teste', bairro: 'Bairro teste', cep: '00000-000', numero: '123', complemento: 'Casa 1'},
  { id: 2, nome: 'Maria da Silva', telefone: '11 99999-9999', email: '123@teste.com', tipoCliente: 'Tercerizado', endereco: 'Rua teste', bairro: 'Bairro teste', cep: '00000-000', numero: '123', complemento: 'Casa 1'},
  { id: 3, nome: 'José da Silva', telefone: '11 99999-9999', email: 'teste@teste.com', tipoCliente: 'Refrigeração', endereco: 'Rua teste', bairro: 'Bairro teste', cep: '00000-000', numero: '123', complemento: 'Casa 1'},
  { id: 4, nome: 'João da Silva', telefone: '11 99999-9999', email: 'teste@teste.com', tipoCliente: 'Tercerizado', endereco: 'Rua teste', bairro: 'Bairro teste', cep: '00000-000', numero: '123', complemento: 'Casa 1'},
  { id: 5, nome: 'Maria da Silva', telefone: '11 99999-9999', email: '', tipoCliente: 'Refrigeração', endereco: 'Rua teste', bairro: 'Bairro teste', cep: '00000-000', numero: '123', complemento: 'Casa 1'},
  { id: 6, nome: 'João da Silva', telefone: '11 99999-9999', email: 'teste@teste.com', tipoCliente: 'Tercerizado', endereco: 'Rua teste', bairro: 'Bairro teste', cep: '00000-000', numero: '123', complemento: 'Casa 1'},
  { id: 7, nome: 'Maria da Silva', telefone: '11 99999-9999', email: '123@teste.com', tipoCliente: 'Tercerizado', endereco: 'Rua teste', bairro: 'Bairro teste', cep: '00000-000', numero: '123', complemento: 'Casa 1'},
  { id: 8, nome: 'José da Silva', telefone: '11 99999-9999', email: 'teste@teste.com', tipoCliente: 'Refrigeração', endereco: 'Rua teste', bairro: 'Bairro teste', cep: '00000-000', numero: '123', complemento: 'Casa 1'},
  { id: 9, nome: 'João da Silva', telefone: '11 99999-9999', email: 'teste@teste.com', tipoCliente: 'Tercerizado', endereco: 'Rua teste', bairro: 'Bairro teste', cep: '00000-000', numero: '123', complemento: 'Casa 1'},
  { id: 10, nome: 'Maria da Silva', telefone: '11 99999-9999', email: '', tipoCliente: 'Refrigeração', endereco: 'Rua teste', bairro: 'Bairro teste', cep: '00000-000', numero: '123', complemento: 'Casa 1'}
];

export default function ClientePage() {
  const { id } = useParams(); // Agora usando useParams para acessar o parâmetro da URL
  const [cliente, setCliente] = useState<Cliente | null>(null); // Tipando o estado com a interface Cliente

  useEffect(() => {
    if (id) {
      // Buscar o cliente pelo ID
      const clienteEncontrado = dataBody.find(cliente => cliente.id === parseInt(id as string));
      setCliente(clienteEncontrado || null); // Atualiza o estado com o cliente encontrado
    }
  }, [id]);

  if (!cliente) {
    return <div>Carregando...</div>; // Exibe um carregamento enquanto não encontra o cliente
  }

  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">Cliente: {cliente.nome}</h1>
      <div>
        <p><strong>Telefone:</strong> {cliente.telefone}</p>
        <p><strong>Email:</strong> {cliente.email}</p>
        <p><strong>Tipo de Cliente:</strong> {cliente.tipoCliente}</p>
        <p><strong>Endereço:</strong> {cliente.endereco}</p>
        <p><strong>Bairro:</strong> {cliente.bairro}</p>
        <p><strong>CEP:</strong> {cliente.cep}</p>
        <p><strong>Número:</strong> {cliente.numero}</p>
        <p><strong>Complemento:</strong> {cliente.complemento}</p>
      </div>
      <Link href="/home/clientes">
        <button className='border mt-2 px-2'>Voltar</button>
      </Link>
    </main>
  );
}
