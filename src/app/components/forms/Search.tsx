'use client';

interface SearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function Search({ searchTerm, onSearchChange }: SearchProps) {
  return (
    <form className="lg:col-span-3 col-span-5 flex items-center">
      <input
        className="w-full px-4 py-2 border rounded-2xl"
        type="text"
        placeholder="Buscar aqui..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </form>
  );
}
