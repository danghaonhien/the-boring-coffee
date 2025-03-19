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
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          price: number
          original_price: number | null
          discount_percentage: number | null
          image_url: string | null
          image_gallery: string[] | null
          stock: number
          category: string | null
          rating: number | null
          roast_level: number | null
          story: string | null
          how_to: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          price: number
          original_price?: number | null
          discount_percentage?: number | null
          image_url?: string | null
          image_gallery?: string[] | null
          stock?: number
          category?: string | null
          rating?: number | null
          roast_level?: number | null
          story?: string | null
          how_to?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          price?: number
          original_price?: number | null
          discount_percentage?: number | null
          image_url?: string | null
          image_gallery?: string[] | null
          stock?: number
          category?: string | null
          rating?: number | null
          roast_level?: number | null
          story?: string | null
          how_to?: string[] | null
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: string
          total: number
          created_at: string
          payment_intent_id: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: string
          total: number
          created_at?: string
          payment_intent_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string
          total?: number
          created_at?: string
          payment_intent_id?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          price?: number
          created_at?: string
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
  }
} 