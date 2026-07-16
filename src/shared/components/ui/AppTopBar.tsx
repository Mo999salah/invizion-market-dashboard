import type { ReactNode } from "react";

type AppTopBarProps = Readonly<{
  children?: ReactNode;
}>;

export function AppTopBar({ children }: AppTopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-line px-5 sm:px-8">
      <p className="flex min-w-0 items-baseline gap-3 text-[0.9375rem]">
        <span className="font-semibold tracking-tight text-fg">Invizion</span>
        <span aria-hidden="true" className="h-4 w-px self-center bg-line" />
        <span className="truncate text-sm text-muted">
          Market operations
        </span>
      </p>
      {children ? (
        <div className="flex shrink-0 items-center gap-3">{children}</div>
      ) : null}
    </header>
  );
}
