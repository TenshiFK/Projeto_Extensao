'use client';
import NewEditClientForm from "@/app/components/forms/NewEditClient";
import { useParams } from "next/navigation";
import { useEffect, useState } from 'react';

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

export default function Page() {
  const { id } = useParams();
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    if (id) {
      // Simulação de busca na API (substituir por fetch futuramente)
      const clienteEncontrado = dataBody.find(cliente => cliente.id === Number(id));
      setCliente(clienteEncontrado || null);
    }
  }, [id]);

  if (!cliente) {
    return <div>Carregando...</div>;
  }
    return (
      <main>
        <h1 className={`mb-4 text-xl md:text-2xl`}>
          Editar Cliente
        </h1>
        <NewEditClientForm cliente={cliente}/>                                         
      </main>
    );
}