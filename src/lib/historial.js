import { query } from '@/lib/database';

export async function getTransactions(document_number) {
  const sql = `
    SELECT * FROM transfers 
    WHERE origin_account_iban IN (SELECT account_iban FROM user_accounts WHERE user_document_number = ?) 
    OR destination_account_iban IN (SELECT account_iban FROM user_accounts WHERE user_document_number = ?)
  `;
  const values = [document_number, document_number];
  return await query(sql, values);
}