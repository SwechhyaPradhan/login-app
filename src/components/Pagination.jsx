export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Generate page numbers array
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200
          hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Previous
      </button>

      {/* Page numbers */}
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-xl text-sm font-medium transition
            ${currentPage === page
              ? "bg-blue-500 text-white shadow-sm"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200
          hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  );
}