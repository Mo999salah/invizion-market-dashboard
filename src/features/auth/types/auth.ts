export type DemoCredentials = Readonly<{
  email: string;
  password: string;
}>;

export type DemoSession = Readonly<{
  email: string;
}>;

export type AuthContextValue = Readonly<{
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (credentials: DemoCredentials) => boolean;
  logout: () => void;
}>;
