// Static replica - simplified account name hook
export function useAccountName(account: any) {
  return account?.name || "Bitcoin 1";
} 