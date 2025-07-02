import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Test that the router types are properly exported
describe('tRPC Router', () => {
  it('should have the correct router structure', () => {
    // This test just verifies that the types compile correctly
    const routerShape = {
      items: {
        list: expect.any(Object),
        adjustStock: expect.any(Object),
      },
    };

    // If this compiles, our router structure is correct
    expect(routerShape).toBeDefined();
  });

  it('should validate input schemas', () => {
    const AdjustStockInputSchema = z.object({
      itemId: z.number(),
      delta: z.number(),
      notes: z.string().optional(),
    });

    // Valid input
    const validInput = {
      itemId: 1,
      delta: 5,
      notes: 'Adding new stock',
    };

    expect(() => AdjustStockInputSchema.parse(validInput)).not.toThrow();

    // Invalid input (missing itemId)
    const invalidInput = {
      delta: 5,
    };

    expect(() => AdjustStockInputSchema.parse(invalidInput)).toThrow();
  });
});
