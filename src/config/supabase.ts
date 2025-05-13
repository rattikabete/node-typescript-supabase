import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  logger.error('Supabase configuration is missing.');
  throw new Error('Supabase configuration is missing.');
}

export const supabaseClient: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

/**
 * Create a Supabase client with a user's JWT token
 * @param token User's JWT token
 * @returns Supabase client authenticated as the user
 */
export const createUserClient = (token: string): SupabaseClient => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
};