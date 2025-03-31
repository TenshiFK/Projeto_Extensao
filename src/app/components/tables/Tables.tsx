'use client';
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface TableProps {
  titlesHead: { name: string }[]; // Agora os títulos são objetos com `name`
  dataBody: { [key: string]: string | number | null }[]; 
  basePath: string;
  onDelete: (id: string) => void; // Função de exclusão
}

export default function Table({ titlesHead, dataBody, basePath, onDelete }: TableProps) {
  const router = useRouter();

  const handleView = (id: string) => {
    router.push(`/home/${basePath}/${id}`); // Redireciona para a URL dinâmica correta
  };

  const handleEdit = (id: string) => {
    router.push(`/home/${basePath}/${id}/edit`); // Redireciona para a URL dinâmica correta
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      onDelete(id); // Chama a função de exclusão passada como prop
    }
  };

  return (
    <div className="overflow-hidden">
      <table className="min-w-full border border-gray-300">
        {/* Cabeçalho */}
        <thead className="bg-gray-200">
          <tr>
            {titlesHead.map((title, index) => (
              <th key={index} className="border border-gray-300 px-2 py-2 text-left">
                {title.name} {/* Agora acessamos a propriedade `name` corretamente */}
              </th>
            ))}
          </tr>
        </thead>

        {/* Corpo */}
        <tbody>
        {dataBody.map((item) => (
        <tr key={item.id} className="border border-gray-300 hover:bg-gray-100">
          {Object.keys(item)
            .filter((key) => key !== "id") // Excluindo a chave "id"
            .map((key, index) => (
              <td key={index} className="border border-gray-300 px-2 py-2">
                {item[key] ?? "Não informado"}
              </td>
            ))} 
              {/* Coluna de Ações */}
              <td className="border-gray-300 px-2 py-2 flex gap-2">
                <button onClick={() => handleView(String(item.id))} className="cursor-pointer">
                  <EyeIcon className="w-4 h-4 text-gray-500" />
                </button>
                <button className="cursor-pointer" onClick={() => handleEdit(String(item.id))}>
                  <PencilSquareIcon className="w-4 h-4 text-gray-500" />
                </button>
                <button className="cursor-pointer" onClick={() => handleDelete(String(item.id))}>
                  <TrashIcon className="w-4 h-4 text-gray-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
