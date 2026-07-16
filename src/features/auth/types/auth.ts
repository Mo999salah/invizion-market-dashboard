export type DemoCredentials = Readonly<{
  email: string;
  password: string;
}>;

export type DemoSession = Readonly<{
  email: string;
}>;

export type AuthSnapshot = Readonly<{
  session: DemoSession | null;
  isInitialized: boolean;
}>;

export type AuthContextValue = AuthSnapshot &
  Readonly<{
    isAuthenticated: boolean;
    login: (credentials: DemoCredentials) => Promise<boolean>;
    logout: () => void;
  }>;
