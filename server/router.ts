import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from './trpc';

// Zod schemas for validation
const ItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  sku: z.string().nullable(),
  barcode: z.string().nullable(),
  category_id: z.number().nullable(),
  subcategory: z.string().nullable(),
  min_stock: z.number(),
  current_stock: z.number(),
  location: z.string().nullable(),
  unit_cost: z.number().nullable(),
  notes: z.string().nullable(),
  image_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

const AdjustStockInputSchema = z.object({
  itemId: z.number(),
  delta: z.number(),
  notes: z.string().optional(),
});

const itemsRouter = router({
  list: protectedProcedure
    .output(z.array(ItemSchema))
    .query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase
        .from('items')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch items',
          cause: error,
        });
      }

      return data;
    }),

  adjustStock: protectedProcedure
    .input(AdjustStockInputSchema)
    .output(ItemSchema)
    .mutation(async ({ input, ctx }) => {
      const { itemId, delta, notes } = input;

      // Start a transaction-like operation
      // First, get the current item to validate it exists
      const { data: currentItem, error: fetchError } = await ctx.supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (fetchError || !currentItem) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Item not found',
          cause: fetchError,
        });
      }

      const newStock = currentItem.current_stock + delta;

      // Prevent negative stock
      if (newStock < 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot adjust stock by ${delta}. Current stock is ${currentItem.current_stock}`,
        });
      }

      // Update the item's stock
      const { data: updatedItem, error: updateError } = await ctx.supabase
        .from('items')
        .update({
          current_stock: newStock,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId)
        .select()
        .single();

      if (updateError || !updatedItem) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update item stock',
          cause: updateError,
        });
      }

      // Insert transaction record for history
      const { error: transactionError } = await ctx.supabase
        .from('transactions')
        .insert({
          item_id: itemId,
          type: 'adjustment',
          quantity: delta,
          notes: notes || null,
          user_id: ctx.user.id,
          created_at: new Date().toISOString(),
        });

      if (transactionError) {
        // Log the error but don't fail the operation since the stock was already updated
        console.error('Failed to insert transaction record:', transactionError);
      }

      return updatedItem;
    }),
});

export const appRouter = router({
  items: itemsRouter,
});

export type AppRouter = typeof appRouter;
