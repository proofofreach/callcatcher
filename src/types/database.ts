/**
 * Database types for CallCatcher Supabase tables
 * Generated from supabase/migrations/20250125000000_initial_schema.sql
 */

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
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'trial_ends_at'> & {
          id?: string;
          created_at?: string;
          trial_ends_at?: string;
          subscription_status?: SubscriptionStatus;
        };
        Update: Partial<Omit<User, 'id'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          ring_duration?: number;
          message_template?: string;
        };
        Update: Partial<Omit<Profile, 'id' | 'user_id'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
          is_auto_reply?: boolean;
        };
        Update: Partial<Omit<Message, 'id' | 'user_id'>>;
      };
      calls: {
        Row: Call;
        Insert: Omit<Call, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
          duration?: number;
        };
        Update: Partial<Omit<Call, 'id' | 'user_id'>>;
      };
      opt_outs: {
        Row: OptOut;
        Insert: Omit<OptOut, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<OptOut, 'id' | 'user_id'>>;
      };
    };
  };
}
