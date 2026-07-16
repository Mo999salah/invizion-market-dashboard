import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "alert"
  | "lock"
  | "logout"
  | "mail"
  | "refresh"
  | "search";

type IconProps = Readonly<
  SVGProps<SVGSVGElement> & {
    name: IconName;
    size?: number;
  }
>;

export function Icon({ name, size = 18, ...props }: IconProps) {
  const paths: Record<IconName, ReactNode> = {
    alert: (
      <>
        <path d="M10 3.5 2.8 16h14.4L10 3.5Z" />
        <path d="M10 8v3.25M10 14h.01" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="8.5" width="12" height="8" rx="2" />
        <path d="M6.75 8.5V6.75a3.25 3.25 0 0 1 6.5 0V8.5" />
      </>
    ),
    logout: (
      <>
        <path d="M8 4H4.75A1.75 1.75 0 0 0 3 5.75v8.5C3 15.22 3.78 16 4.75 16H8" />
        <path d="m12.5 6 4 4-4 4M16.5 10H7.5" />
      </>
    ),
    mail: (
      <>
        <rect x="2.75" y="4.5" width="14.5" height="11" rx="2" />
        <path d="m3.5 6 6.5 5 6.5-5" />
      </>
    ),
    refresh: (
      <>
        <path d="M16 6.5V3l-1.6 1.6A7 7 0 1 0 16.8 11" />
        <path d="M16 3h-3.5" />
      </>
    ),
    search: (
      <>
        <circle cx="8.5" cy="8.5" r="5.25" />
        <path d="m12.5 12.5 4.25 4.25" />
      </>
    ),
  };

  return (
    <svg
      {...props}
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
