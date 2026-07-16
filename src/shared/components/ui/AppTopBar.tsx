import type { ReactNode } from "react";

type AppTopBarProps = Readonly<{
  children?: ReactNode;
}>;

export function AppTopBar({ children }: AppTopBarProps) {
  return (
    <header className="flex h-[4.5rem] shrink-0 items-center justify-between gap-4 border-b border-line-soft bg-canvas/95 px-5 sm:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <svg
          aria-hidden="true"
          className="h-7 w-6 shrink-0 text-signal"
          viewBox="0 0 24 28"
          fill="none"
        >
          <path d="M2 2v24M8 2v15l7 9M22 2 13 17" stroke="currentColor" strokeWidth="2.25" />
          <path d="M15 2h7" stroke="currentColor" strokeWidth="2.25" />
        </svg>
        <div className="min-w-0 leading-none">
          <p className="display-type text-[0.9375rem] tracking-[-0.035em] text-fg">
            INVIZION
          </p>
          <p className="mt-1.5 truncate text-[0.6875rem] text-faint">
            Market operations desk
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 sm:gap-6">
        <div className="hidden items-center gap-2 text-xs text-muted-ui sm:flex">
          <span aria-hidden="true" className="status-beacon size-1.5 bg-gain" />
          <span>Live market feed</span>
        </div>
        {children ? <div className="flex items-center">{children}</div> : null}
      </div>
    </header>
  );
}
