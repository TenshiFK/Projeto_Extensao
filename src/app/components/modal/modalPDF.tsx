'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (clienteId?: string) => void;
    isTrabalhos?: boolean;
    clientes?: { idCliente: string; nome: string }[];
    isEstoque?: boolean;
  }
  
  export default function ModalPDF({ isOpen, onClose, onConfirm, isTrabalhos, clientes, isEstoque }: ModalProps) {
    const [cliente, setCliente] = useState({ idCliente: '', nome: '' });
    const [periodo, setPeriodo] = useState('');

    useEffect(() => {
      if (isOpen) {
        setCliente({ idCliente: '', nome: '' });
      }
    }, [isOpen]);

    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
  
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-100 sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-8 sm:pb-4">
                <DialogTitle as="h3" className="sm:text-xl text-lg font-semibold text-main-blue text-center pb-6">
                  Gerar Relatório em PDF
                </DialogTitle>
                <p className="mt-2 sm:text-base text-sm text-second-black pb-2 text-justify">
                  O relatório pode ser gerado a partir dos dados disponíveis no sistema de acordo com o filtro e/ou tempo escolhido.
                </p>
                {isTrabalhos && (
                  <div className="mt-2 grid grid-cols-1">
              <select
                  id="cliente"
                  name="cliente"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => {
                    const clienteId = e.target.value;
                    const clienteSelecionado = clientes?.find((c) => c.idCliente === clienteId);
                    if (clienteSelecionado) {
                      setCliente({ idCliente: clienteSelecionado.idCliente, nome: clienteSelecionado.nome });
                    }
                  }}
                  value={cliente.idCliente}
                >
                  <option value="">Selecione</option>
                  {clientes?.map((c) => (
                    <option key={c.idCliente} value={c.idCliente}>
                      {c.nome}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
                )}
                {isEstoque && (
                  <div>
                    <form className='flex flex-wrap'>
                      <div className='flex w-full gap-4'>
                        <div>
                          <input type="radio" name="umMes" id="umMes" 
                            onChange={(e) => {setPeriodo(e.target.value)}}
                            value="umMes"
                            checked={periodo === "umMes"}/>
                          <label htmlFor="umMes" className='px-2'>Último Mês</label>
                        </div>
                        <div>
                          <input type="radio" name="seisMeses" id="seisMeses"
                            value="seisMeses"
                            checked={periodo === "seisMeses"} 
                            onChange={(e) => {setPeriodo(e.target.value)}}/>
                          <label htmlFor="seisMeses" className='px-2'>Últimos 6 Meses</label>
                        </div>
                      </div>
                      <div className='flex w-full gap-4'>
                        <div>
                          <input type="radio" name="ano" id="ano" 
                            value="ano"
                            checked={periodo === "ano"} 
                            onChange={(e) => {setPeriodo(e.target.value)}}/>
                          <label htmlFor="ano" className='px-2'>Último Ano</label>
                        </div>
                        <div>
                          <input type="radio" name="todos" id="todos" 
                            value="todos"
                            checked={periodo === "todos"} 
                            onChange={(e) => {setPeriodo(e.target.value)}}/>
                          <label htmlFor="tresMeses" className='px-2'>Todos os períodos</label>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:justify-center sm:px-6 sm:pb-6">
                <button
                  onClick={() => onConfirm(cliente.idCliente || undefined)}
                  className="cursor-pointer inline-flex w-full justify-center rounded-md bg-main-blue px-6 py-2 text-base font-semibold text-white shadow-sm hover:bg-blue-900 sm:w-auto sm:ml-18"
                >
                  Exportar
                </button>
                <button
                  onClick={onClose}
                  className="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-white px-6 py-2 text-base font-semibold text-gray-900  ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancelar
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    )
  }
