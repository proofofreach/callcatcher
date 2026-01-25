/**
 * Database types for CallCatcher Supabase tables
 * Generated from supabase/migrations/20250125000000_initial_schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SubscriptionStatus = 'trial' | 'active' | 'canceled' | 'past_due';
export type MessageDirection = 'inbound' | 'outbound';
export type CallStatus = 'missed' | 'answered';

export interface User {
  id: string;
  email: string;
  created_at: string;
  trial_ends_at: string;
  subscription_status: SubscriptionStatus;
}

export interface Profile {
  id: string;
  user_id: string;
  business_name: string | null;
  business_hours: string | null;
  personal_phone: string | null;
  twilio_number: string | null;
  ring_duration: number;
  message_template: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  customer_phone: string;
  direction: MessageDirection;
  body: string;
  is_auto_reply: boolean;
  created_at: string;
}

export interface Call {
  id: string;
  user_id: string;
  customer_phone: string;
  status: CallStatus;
  duration: number;
  created_at: string;
}

export interface OptOut {
  id: string;
  user_id: string;
  phone_number: string;
  created_at: string;
}

// Database schema types for Supabase client
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          trial_ends_at: string
          subscription_status: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          trial_ends_at?: string
          subscription_status?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          trial_ends_at?: string
          subscription_status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string | null
          business_hours: string | null
          personal_phone: string | null
          twilio_number: string | null
          ring_duration: number
          message_template: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name?: string | null
          business_hours?: string | null
          personal_phone?: string | null
          twilio_number?: string | null
          ring_duration?: number
          message_template?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string | null
          business_hours?: string | null
          personal_phone?: string | null
          twilio_number?: string | null
          ring_duration?: number
          message_template?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          user_id: string
          customer_phone: string
          direction: string
          body: string
          is_auto_reply: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          customer_phone: string
          direction: string
          body: string
          is_auto_reply?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          customer_phone?: string
          direction?: string
          body?: string
          is_auto_reply?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      calls: {
        Row: {
          id: string
          user_id: string
          customer_phone: string
          status: string
          duration: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          customer_phone: string
          status: string
          duration?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          customer_phone?: string
          status?: string
          duration?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      opt_outs: {
        Row: {
          id: string
          user_id: string
          phone_number: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phone_number: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phone_number?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opt_outs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
