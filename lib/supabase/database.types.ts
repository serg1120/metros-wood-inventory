export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          id: number;
          name: string;
          sku: string | null;
          barcode: string | null;
          category_id: number | null;
          subcategory: string | null;
          min_stock: number;
          current_stock: number;
          location: string | null;
          unit_cost: number | null;
          notes: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          sku?: string | null;
          barcode?: string | null;
          category_id?: number | null;
          subcategory?: string | null;
          min_stock?: number;
          current_stock?: number;
          location?: string | null;
          unit_cost?: number | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          sku?: string | null;
          barcode?: string | null;
          category_id?: number | null;
          subcategory?: string | null;
          min_stock?: number;
          current_stock?: number;
          location?: string | null;
          unit_cost?: number | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: number;
          item_id: number;
          type: 'adjustment' | 'sale' | 'purchase' | 'return' | 'damage';
          quantity: number;
          notes: string | null;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          item_id: number;
          type: 'adjustment' | 'sale' | 'purchase' | 'return' | 'damage';
          quantity: number;
          notes?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          item_id?: number;
          type?: 'adjustment' | 'sale' | 'purchase' | 'return' | 'damage';
          quantity?: number;
          notes?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      // Add your view types here
      [key: string]: never;
    };
    Functions: {
      // Add your function types here
      [key: string]: never;
    };
    Enums: {
      transaction_type:
        | 'adjustment'
        | 'sale'
        | 'purchase'
        | 'return'
        | 'damage';
    };
    CompositeTypes: {
      // Add your composite types here
      [key: string]: never;
    };
  };
}
