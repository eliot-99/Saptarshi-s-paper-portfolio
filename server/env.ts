/** Binding types come from `npm run cf:types`; secrets stay outside source control. */
export type BackendEnv = Pick<Cloudflare.Env, 'PORTFOLIO_DB' | 'PORTFOLIO_MEDIA'> & {
  ADMIN_PASSWORD_HASH?: string;
};

export type BackendContext = EventContext<BackendEnv, string, Record<string, unknown>>;

