'use client';

import { useState } from 'react';
import { trpc } from '@/components/providers/query-provider';

export function ItemsList() {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  // tRPC hooks
  const { data: items, isLoading, error, refetch } = trpc.items.list.useQuery();
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

      <div className="grid gap-4">
        {items?.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                {item.sku && (
                  <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                )}
                <p className="text-lg">Stock: {item.current_stock}</p>
                {item.min_stock > 0 && (
                  <p className="text-sm">Min Stock: {item.min_stock}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedItemId(item.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Adjust Stock
              </button>
            </div>
          </div>
        ))}
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
