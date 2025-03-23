'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation'; // Corrigido para useParams
import { useEffect, useState } from 'react';

// Definir uma interface para os dados do cliente
interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  tipo: string;
}

const dataBody: Cliente[] = [
  { id: 1, nome: 'João da Silva', telefone: '11 99999-9999', email: 'teste@teste.com', tipo: 'Tercerizado' },
  { id: 2, nome: 'Maria da Silva', telefone: '11 99999-9999', email: '123@teste.com', tipo: 'Tercerizado' },
  { id: 3, nome: 'José da Silva', telefone: '11 99999-9999', email: 'teste@teste.com', tipo: 'Refrigeração' },
  { id: 4, nome: 'João da Silva', telefone: '11 99999-9999', email: 'teste@teste.com', tipo: 'Tercerizado' },
  { id: 5, nome: 'Maria da Silva', telefone: '11 99999-9999', email: '', tipo: 'Refrigeração' },
  { id: 6, nome: 'João da Silva', telefone: '11 99999-9999', email: 'teste@teste.com', tipo: 'Tercerizado' },
  { id: 7, nome: 'Maria da Silva', telefone: '11 99999-9999', email: '123@teste.com', tipo: 'Tercerizado' },
  { id: 8, nome: 'José da Silva', telefone: '11 99999-9999', email: 'teste@teste.com', tipo: 'Refrigeração' },
  { id: 9, nome: 'João da Silva', telefone: '11 99999-9999', email: 'teste@teste.com', tipo: 'Tercerizado' },
  { id: 10, nome: 'Maria da Silva', telefone: '11 99999-9999', email: '', tipo: 'Refrigeração' }
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
        <p><strong>Tipo de Cliente:</strong> {cliente.tipo}</p>
      </div>
      <Link href="/home/clientes">
        <button className='border mt-2 px-2'>Voltar</button>
      </Link>
    </main>
  );
}
