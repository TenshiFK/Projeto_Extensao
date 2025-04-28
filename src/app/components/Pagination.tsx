'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getPagesToShow = () => {
    if (totalPages <= 5) return pages; // Se temos 5 ou menos páginas, mostramos todas.
    
    const startPage = Math.max(1, currentPage - 1); // Páginas de 1 ao redor da atual.
    const endPage = Math.min(totalPages, currentPage + 1); // Páginas de 1 ao redor da atual.

    if (currentPage > 3) {
      return [1, '...', ...pages.slice(startPage - 1, endPage), '...', totalPages];
    }

    return pages.slice(0, 3); // Mostrar no máximo 3 páginas se estiver nas primeiras páginas.
  };

  const pagesToShow = getPagesToShow();

  return (
    <div className="flex justify-end mt-8 gap-2">
      {/* Botão de página anterior */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md text-base font-medium ${
          currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-main-blue cursor-pointer'
        }`}
      >
        &lt;
      </button>

      {/* Lista de páginas */}
      {pagesToShow.map((page, index) => {
        if (page === '...') {
          return (
            <span key={index} className="px-3 py-1 text-base font-medium text-gray-500">
              ...
            </span>
          );
        }
        return (
          <button
            key={page}
            onClick={() => handlePageChange(page as number)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              page === currentPage ? 'text-gray-700 underline bg-third-gray' : 'text-main-blue cursor-pointer'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Botão de próxima página */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md text-base font-medium ${
          currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-main-blue cursor-pointer'
        }`}
      >
        &gt;
      </button>
    </div>
  );
}