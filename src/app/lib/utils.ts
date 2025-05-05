'use client';

export function paginate<T>(items: T[], currentPage: number, perPage: number): T[] {
  const start = (currentPage - 1) * perPage;
  return items.slice(start, start + perPage);
}
