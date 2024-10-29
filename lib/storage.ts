import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from "@atproto/oauth-client-node";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export class StateStore implements NodeSavedStateStore {
  cookieStore: ReadonlyRequestCookies;

  constructor(cookieStore: ReadonlyRequestCookies) {
    this.cookieStore = cookieStore;
  }

  async get(key: string): Promise<NodeSavedState | undefined> {
    return JSON.parse(
      this.cookieStore.get(key)?.value ?? "{}",
    ) as NodeSavedState;
  }

  async set(key: string, state: NodeSavedState) {
    this.cookieStore.set(key, JSON.stringify(state));
  }

  async del(key: string) {
    this.cookieStore.delete(key);
  }
}

export class SessionStore implements NodeSavedSessionStore {
  cookieStore: ReadonlyRequestCookies;

  constructor(cookieStore: ReadonlyRequestCookies) {
    this.cookieStore = cookieStore;
  }

  async get(key: string): Promise<NodeSavedSession | undefined> {
    return JSON.parse(
      this.cookieStore.get(key)?.value ?? "{}",
    ) as NodeSavedSession;
  }

  async set(key: string, state: NodeSavedSession) {
    this.cookieStore.set(key, JSON.stringify(state));
  }

  async del(key: string) {
    this.cookieStore.delete(key);
  }
}
