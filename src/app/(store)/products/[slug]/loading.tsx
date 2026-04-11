function ProductDetailLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="mb-6 h-4 w-1/4 rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="aspect-square rounded-lg bg-gray-200" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg bg-gray-200"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="h-6 w-1/2 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 rounded bg-gray-200" />
                <div className="h-12 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return <ProductDetailLoadingSkeleton />;
}
