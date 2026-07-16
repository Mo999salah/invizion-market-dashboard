import type { ReactNode } from "react";

type AppTopBarProps = Readonly<{
  children?: ReactNode;
}>;

export function AppTopBar({ children }: AppTopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line-soft bg-canvas px-5 sm:px-8">
      <p className="flex min-w-0 items-center gap-3 text-[0.9375rem]">
        <span aria-hidden="true" className="size-2 shrink-0 bg-signal" />
        <span className="font-semibold tracking-[-0.03em] text-fg">
          INVIZION
        </span>
        <span aria-hidden="true" className="hidden h-4 w-px bg-line sm:block" />
        <span className="hidden truncate text-sm text-muted-ui sm:block">
          Market operations
        </span>
      </p>
      {children ? (
        <div className="flex shrink-0 items-center gap-3">{children}</div>
      ) : null}
    </header>
  );
}
