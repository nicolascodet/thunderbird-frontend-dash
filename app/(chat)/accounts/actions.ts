"use server";

import { getEffectiveSession } from '@/lib/auth-utils';
import { pdClient } from '@/lib/pd-backend-client';
import { type Account } from '@pipedream/sdk/browser';

/**
 * Fetches connected accounts for the current authenticated user
 * @returns Array of connected accounts
 */
export async function getConnectedAccounts(): Promise<Account[]> {
  const session = await getEffectiveSession();
  const { id: externalUserId } = session?.user || {};
  if (!externalUserId) {
    return [];
  }

  try {
    const response = await pdClient().accounts.list({
      externalUserId,
    });

    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    // Return empty array on error to prevent UI from breaking
    return [];
  }
}

/**
 * Fetches a single connected account by ID for the current authenticated user
 * @param accountId The ID of the account to fetch
 * @returns The account if found and owned by the user, null otherwise
 */
export async function getConnectedAccountById(accountId: string): Promise<Account | null> {
  const session = await getEffectiveSession();
  if (!session?.user?.id) {
    return null;
  }

  try {
    const account = await pdClient().accounts.retrieve(accountId);

    // Verify the account belongs to the current user
    if (account && account.externalId === session.user.id) {
      return account;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Deletes a connected account by ID
 * @param accountId The ID of the account to delete
 */
export async function deleteConnectedAccount(accountId: string): Promise<void> {
  const pd = pdClient()
  const session = await getEffectiveSession();
  const { id: externalUserId } = session?.user || {};
  if (!externalUserId) {
    throw new Error('User not authenticated');
  }

  try {
    // Verify the user owns this account before deleting
    const accounts = await pd.accounts.list({
      externalUserId
    });

    const accountBelongsToUser = accounts?.data?.some(account => account.id === accountId);

    if (!accountBelongsToUser) {
      throw new Error('Account not found or not owned by user');
    }

    await pd.accounts.delete(accountId);
  } catch (error) {
    throw new Error('Failed to delete account');
  }
}
