
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pharmacies: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          pharmacy_id: string
          name: string
          scientific_name: string | null
          barcode: string | null
          category: string | null
          manufacturer: string | null
          price: number
          cost_price: number | null
          stock: number
          min_stock: number | null
          max_stock: number | null
          expiry_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          pharmacy_id: string
          name: string
          scientific_name?: string | null
          barcode?: string | null
          category?: string | null
          manufacturer?: string | null
          price?: number
          cost_price?: number | null
          stock?: number
          min_stock?: number | null
          max_stock?: number | null
          expiry_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          pharmacy_id?: string
          name?: string
          scientific_name?: string | null
          barcode?: string | null
          category?: string | null
          manufacturer?: string | null
          price?: number
          cost_price?: number | null
          stock?: number
          min_stock?: number | null
          max_stock?: number | null
          expiry_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          pharmacy_id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          pharmacy_id: string
          name: string
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          pharmacy_id?: string
          name?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      suppliers: {
        Row: {
          id: string
          pharmacy_id: string
          name: string
          contact_person: string | null
          phone: string | null
          email: string | null
          address: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          pharmacy_id: string
          name: string
          contact_person?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          pharmacy_id?: string
          name?: string
          contact_person?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      sales: {
        Row: {
          id: string
          pharmacy_id: string
          customer_id: string | null
          invoice_number: string
          total_amount: number
          discount: number | null
          tax: number | null
          payment_method: string | null
          payment_status: string | null
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          pharmacy_id: string
          customer_id?: string | null
          invoice_number: string
          total_amount?: number
          discount?: number | null
          tax?: number | null
          payment_method?: string | null
          payment_status?: string | null
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          pharmacy_id?: string
          customer_id?: string | null
          invoice_number?: string
          total_amount?: number
          discount?: number | null
          tax?: number | null
          payment_method?: string | null
          payment_status?: string | null
          notes?: string | null
          created_at?: string | null
        }
      }
      sale_items: {
        Row: {
          id: string
          sale_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          discount: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          sale_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          discount?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          sale_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          discount?: number | null
          created_at?: string | null
        }
      }
      price_history: {
        Row: {
          id: string
          product_id: string
          price: number
          updated_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          price: number
          updated_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          price?: number
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
