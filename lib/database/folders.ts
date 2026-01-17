/**
 * FOLDER DATABASE OPERATIONS
 *
 * Server-side functions for folder CRUD operations.
 */

import { createClient } from '@/lib/supabase/server'
import type { Folder, CreateFolderInput, UpdateFolderInput } from '@/lib/types'

// =============================================================================
// HELPER: Check if table exists error
// =============================================================================

function isTableNotFoundError(error: any): boolean {
  if (!error) return false
  const errorCode = error?.code || error?.error?.code
  const errorMessage = error?.message || error?.error?.message || ''
  return (
    errorCode === '42P01' ||
    errorCode === 'PGRST116' ||
    errorCode === 'PGRST204' ||
    errorCode === '42501' ||
    errorMessage.includes('does not exist')
  )
}

// =============================================================================
// FOLDER OPERATIONS
// =============================================================================

/**
 * Get all folders for the current user
 */
export async function getUserFolders(): Promise<Folder[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      if (isTableNotFoundError(error)) {
        console.log('[DB] Folders table not found')
        return []
      }
      console.error('[DB] Error fetching folders:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('[DB] Unexpected error in getUserFolders:', err)
    return []
  }
}

/**
 * Get a single folder by ID
 */
export async function getFolderById(folderId: string): Promise<Folder | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('id', folderId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (isTableNotFoundError(error)) return null
      console.error('[DB] Error fetching folder:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('[DB] Unexpected error in getFolderById:', err)
    return null
  }
}

/**
 * Create a new folder
 */
export async function createFolder(input: CreateFolderInput): Promise<Folder | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from('folders')
      .insert({
        user_id: user.id,
        name: input.name,
        channel_type: input.channel_type,
      })
      .select()
      .single()

    if (error) {
      if (isTableNotFoundError(error)) {
        console.log('[DB] Folders table not found')
        return null
      }
      console.error('[DB] Error creating folder:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('[DB] Unexpected error in createFolder:', err)
    return null
  }
}

/**
 * Update a folder
 */
export async function updateFolder(folderId: string, input: UpdateFolderInput): Promise<Folder | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from('folders')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', folderId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (isTableNotFoundError(error)) return null
      console.error('[DB] Error updating folder:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('[DB] Unexpected error in updateFolder:', err)
    return null
  }
}

/**
 * Delete a folder
 */
export async function deleteFolder(folderId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId)
      .eq('user_id', user.id)

    if (error) {
      if (isTableNotFoundError(error)) return false
      console.error('[DB] Error deleting folder:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('[DB] Unexpected error in deleteFolder:', err)
    return false
  }
}
