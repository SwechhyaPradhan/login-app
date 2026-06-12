// Shows animated placeholder cards while products are loading
export default function LoadingSkeleton() {
  // Show 8 skeleton cards (same as products per page)
  const skeletons = Array(8).fill(0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse"
        >
          {/* Image placeholder */}
          <div className="bg-gray-200 h-48 w-full" />

          <div className="p-4 space-y-3">
            {/* Category placeholder */}
            <div className="bg-gray-200 h-3 w-16 rounded-full" />

            {/* Title placeholder */}
            <div className="bg-gray-200 h-4 w-3/4 rounded-full" />

            {/* Description placeholder */}
            <div className="space-y-2">
              <div className="bg-gray-200 h-3 w-full rounded-full" />
              <div className="bg-gray-200 h-3 w-2/3 rounded-full" />
            </div>

            {/* Price and button placeholder */}
            <div className="flex items-center justify-between pt-2">
              <div className="bg-gray-200 h-5 w-16 rounded-full" />
              <div className="bg-gray-200 h-8 w-24 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}