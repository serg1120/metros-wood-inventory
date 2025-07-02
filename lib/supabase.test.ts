import { supabase } from '@/lib/supabase';

describe('supabase env', () => {
  it('should connect with anon key', () => {
    expect(supabase).toBeTruthy();
  });

  it('should have correct URL configured', () => {
    // @ts-expect-error - accessing private property for testing
    expect(supabase.supabaseUrl).toBe(
      'https://hbjgxairckhcpdilhali.supabase.co'
    );
  });

  it('should have anon key configured', () => {
    // @ts-expect-error - accessing private property for testing
    expect(supabase.supabaseKey).toBeTruthy();
    // @ts-expect-error - accessing private property for testing
    expect(supabase.supabaseKey).toContain(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    );
  });
});
