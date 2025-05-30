'use client';
import { ArrowDownTrayIcon, EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface TableProps {
  titlesHead: { name: string }[];
  dataBody: { id: string | number | null; [key: string]: string | number | null }[]; 
  basePath: string;
  onDelete: (id: string) => void;
  showExport?: boolean;
  onExport?: (id: string) => void;
  isHistorico?: boolean;
}

export default function Table({ titlesHead, dataBody, basePath, onDelete, showExport, onExport, isHistorico }: TableProps) {
  const router = useRouter();

  const handleView = (id: string) => {
    router.push(`/home/${basePath}/${id}`);
  };

  const handleEdit = (id: string | number | null) => {
    if (!id) return;
    router.push(`/home/${basePath}/${String(id)}/edit`);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  const handleExport = (id: string) => {
    onExport?.(id);
  };

  return (
    <div className="overflow-hidden">
      <table className="min-w-full">
        {/* Cabeçalho */}
        <thead className="bg-second-white">
          <tr>
            {titlesHead.map((title, index) => {
              const isFirst = index === 0;
              const isLast = index === titlesHead.length - 1;
              return (
                <th
                  key={index}
                  className={`border border-main-blue px-2 py-2 text-center text-main-blue
                    ${isFirst || isLast ? "" : "hidden lg:table-cell"}
                  `}
                >
                  {title.name}
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Corpo */}
        <tbody>
          {dataBody.map((item) => (
            <tr key={String(item.id)} className="border border-gray-950 bg-third-white">
              {Object.keys(item)
                .filter((key) => key !== "id" && key !== "trabalhoId" && key !== "idCliente")
                .map((key, index) => (
                  <td
                    key={index}
                    className={`border border-gray-950 px-2 py-2 bg-third-white text-center
                      ${index === 0 ? "" : "hidden lg:table-cell"}
                    `}
                  >
                    {item[key] ?? " - "}
                  </td>
                ))}
              <td className="border-gray-300 px-2 py-2 flex gap-3 justify-center">
                {showExport && (
                  <button className="cursor-pointer" onClick={() => handleExport(String(item.id))}>
                    <ArrowDownTrayIcon className="w-5 h-5 text-main-blue" />
                  </button>
                )}
                <button onClick={() => handleView(String(item.id))} className="cursor-pointer">
                  <EyeIcon className="w-5 h-5 text-main-blue" />
                </button>
                <button onClick={() => handleEdit(item.id)} 
                className={`cursor-pointer ${isHistorico ? "hidden" : ""}`}
                >
                  <PencilSquareIcon className="w-5 h-5 text-main-blue" />
                </button>
                <button className="cursor-pointer" onClick={() => handleDelete(String(item.id))}>
                  <TrashIcon className="w-5 h-5 text-main-blue" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
