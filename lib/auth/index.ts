// Auth interface — SPEC.md section 9.
//
// Screens call only `login` / `getSession` / `logout`. The mocked
// implementation below is the only thing that needs to change when this
// is swapped for real Facebook/Google/Apple/Email OAuth.

import { useSquadUpStore } from "@/store/useSquadUpStore";
import { randomDisplayName } from "@/lib/data/displayNames";
import type { AuthProvider, User } from "@/lib/types";

export type { AuthProvider, User } from "@/lib/types";

export async function login(provider: AuthProvider): Promise<User> {
  const user: User = {
    id: crypto.randomUUID(),
    authProvider: provider,
    signedInAt: Date.now(),
    name: randomDisplayName(),
  };
  useSquadUpStore.getState().signIn(user);
  return user;
}

export function getSession(): User | null {
  return useSquadUpStore.getState().user;
}

export function logout(): void {
  useSquadUpStore.getState().signOut();
}
