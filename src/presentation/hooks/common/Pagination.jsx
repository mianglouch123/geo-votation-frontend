export default function Pagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onPageChange,
  totalItems
}) {
  if (!totalPages || totalPages <= 1) return null;

  const maxVisible = 5;

  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow mt-6">

      {/* MOBILE */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className={`px-4 py-2 text-sm rounded-md ${
            hasPrev
              ? 'bg-white text-gray-700 border'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Anterior
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`px-4 py-2 text-sm rounded-md ${
            hasNext
              ? 'bg-white text-gray-700 border'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Siguiente
        </button>
      </div>

      {/* DESKTOP */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        
        <p className="text-sm text-gray-700">
          Página <span className="font-medium">{page}</span> de{' '}
          <span className="font-medium">{totalPages}</span>
          {totalItems !== undefined && (
            <>
              {' '}· Total: <span className="font-medium">{totalItems}</span>
            </>
          )}
        </p>

        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">

          {/* Prev */}
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={`px-2 py-2 ring-1 ${
              hasPrev ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            ←
          </button>

          {/* Pages */}
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-4 py-2 text-sm font-semibold ${
                p === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`px-2 py-2 ring-1 ${
              hasNext ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            →
          </button>

        </nav>
      </div>
    </div>
  );
}