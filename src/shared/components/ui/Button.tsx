import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Spinner } from "@/shared/components/ui/Spinner";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "border-signal bg-signal text-signal-ink hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-accent-hover)]",
  secondary: "border-control-ui bg-raised text-fg hover:border-secondary hover:bg-surface",
  ghost:
    "border-transparent bg-transparent text-muted-ui hover:bg-raised hover:text-fg",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "h-11 px-4",
  lg: "h-12 px-6 text-[0.9375rem]",
};

type ButtonProps = Readonly<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leadingIcon?: ReactNode;
  }
>;

export function Button({
  variant = "secondary",
  size = "md",
  isLoading = false,
  leadingIcon,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={`inline-flex min-w-0 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[0.2rem] border text-sm font-bold transition-[opacity,background-color,border-color,color] duration-150 ease-out active:brightness-90 disabled:pointer-events-none disabled:opacity-50 aria-busy:opacity-75 motion-reduce:transition-none ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
    >
      {isLoading || leadingIcon ? (
        <span className="grid shrink-0 place-items-center">
          {isLoading ? <Spinner /> : leadingIcon}
        </span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}
