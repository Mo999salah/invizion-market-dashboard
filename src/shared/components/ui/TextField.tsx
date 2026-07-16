import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

import { Icon } from "@/shared/components/ui/Icon";

type TextFieldProps = Readonly<
  Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
    label: string;
    error?: string;
    leadingIcon?: ReactNode;
    labelVisuallyHidden?: boolean;
    reserveMessageSpace?: boolean;
    wrapperClassName?: string;
  }
>;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      id,
      label,
      error,
      leadingIcon,
      labelVisuallyHidden = false,
      reserveMessageSpace = true,
      wrapperClassName = "",
      className = "",
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const messageId = error && id ? `${id}-message` : undefined;
    const describedBy = [ariaDescribedBy, messageId].filter(Boolean).join(" ");

    return (
      <div className={`grid gap-2 ${wrapperClassName}`}>
        <label
          className={
            labelVisuallyHidden
              ? "sr-only"
              : "text-sm font-bold text-secondary"
          }
          htmlFor={id}
        >
          {label}
        </label>
        <div className="relative flex items-center">
          {leadingIcon ? (
            <span className="pointer-events-none absolute left-3 z-10 grid place-items-center text-faint">
              {leadingIcon}
            </span>
          ) : null}
          <input
            {...props}
            id={id}
            ref={ref}
            aria-invalid={error ? true : props["aria-invalid"]}
            aria-describedby={describedBy || undefined}
            className={`h-12 w-full rounded-lg border bg-surface px-4 text-[0.9375rem] text-fg outline-2 outline-transparent outline-offset-1 transition-colors duration-150 placeholder:text-muted-ui hover:bg-raised focus-visible:border-control-ui focus-visible:outline-signal disabled:pointer-events-none disabled:opacity-55 ${leadingIcon ? "pl-11" : ""} ${error ? "border-loss pr-11" : "border-control-ui"} ${className}`}
          />
          {error ? (
            <span className="pointer-events-none absolute right-3 z-10 grid place-items-center text-loss">
              <Icon name="alert" size={16} />
            </span>
          ) : null}
        </div>
        {reserveMessageSpace || error ? (
          <p
            id={messageId}
            className={`min-h-5 text-sm leading-[1.4] ${error ? "text-loss" : "text-muted-ui"}`}
            role={error ? "alert" : undefined}
          >
            {error ?? "\u00A0"}
          </p>
        ) : null}
      </div>
    );
  },
);
