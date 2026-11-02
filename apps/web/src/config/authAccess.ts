import type { AccountType } from "../domain/auth";

export const AUTH_ACCOUNT_AVAILABILITY: Readonly<Record<AccountType, boolean>> = Object.freeze({
  student: true,
  parent: false,
  teacher: false,
});

export function isAuthAccountTypeEnabled(accountType: AccountType | null | undefined): accountType is AccountType {
  return accountType != null && AUTH_ACCOUNT_AVAILABILITY[accountType] === true;
}
