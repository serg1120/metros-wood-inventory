'use client';

import { useState } from 'react';
import { trpc } from '@/components/providers/query-provider';

export function ItemsList() {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  // Filter state
  const [search, setSearch] = useState<string>('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [lowStockOnly, setLowStockOnly] = useState<boolean>(false);

  // Build filter object
  const filters = {
    ...(search && { search }),
    ...(categoryId !== undefined && { categoryId }),
    ...(lowStockOnly && { lowStockOnly }),
  };

  // tRPC hooks
  const {
    data: items,
    isLoading,
    error,
    refetch,
  } = trpc.items.list.useQuery(
    Object.keys(filters).length > 0 ? filters : undefined
  );
  const adjustStockMutation = trpc.items.adjustStock.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedItemId(null);
      setAdjustmentDelta(0);
      setNotes('');
    },
  });

  const handleAdjustStock = () => {
    if (selectedItemId && adjustmentDelta !== 0) {
      adjustStockMutation.mutate({
        itemId: selectedItemId,
        delta: adjustmentDelta,
        notes: notes || undefined,
      });
    }
  };

  if (isLoading) return <div>Loading items...</div>;
  if (error) return <div>Error loading items: {error.message}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Inventory Items</h2>

      {/* Filter Controls */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={categoryId ?? ''}
              onChange={(e) =>
                setCategoryId(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Categories</option>
              <option value="1">Wood Boards</option>
              <option value="2">Hardware</option>
              <option value="3">Tools</option>
              <option value="4">Finishes</option>
            </select>
          </div>

          {/* Low Stock Toggle */}
          <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Show low stock only</span>
            </label>
          </div>
        </div>

        {/* Clear Filters */}
        {(search || categoryId !== undefined || lowStockOnly) && (
          <button
            onClick={() => {
              setSearch('');
              setCategoryId(undefined);
              setLowStockOnly(false);
            }}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {items?.map((item) => {
          const isLowStock = item.current_stock <= item.min_stock;
          return (
            <div
              key={item.id}
              className={`border p-4 rounded-lg ${isLowStock ? 'border-red-300 bg-red-50' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    {isLowStock && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        LOW STOCK
                      </span>
                    )}
                  </div>
                  {item.sku && (
                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <p
                      className={`text-lg font-medium ${isLowStock ? 'text-red-600' : ''}`}
                    >
                      Stock: {item.current_stock}
                    </p>
                    {item.min_stock > 0 && (
                      <p className="text-sm text-gray-500">
                        Min: {item.min_stock}
                      </p>
                    )}
                  </div>
                  {item.location && (
                    <p className="text-sm text-gray-600">
                      Location: {item.location}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedItemId(item.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Adjust Stock
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Adjustment Modal */}
      {selectedItemId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Adjust Stock</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Adjustment (+/-)
              </label>
              <input
                type="number"
                value={adjustmentDelta}
                onChange={(e) =>
                  setAdjustmentDelta(parseInt(e.target.value) || 0)
                }
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., +5 or -3"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="Reason for adjustment..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAdjustStock}
                disabled={
                  adjustmentDelta === 0 || adjustStockMutation.isPending
                }
                className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                {adjustStockMutation.isPending ? 'Adjusting...' : 'Confirm'}
              </button>
              <button
                onClick={() => setSelectedItemId(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>

            {adjustStockMutation.error && (
              <p className="text-red-500 text-sm mt-2">
                Error: {adjustStockMutation.error.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
