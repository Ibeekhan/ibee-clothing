import clsx from "clsx";

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "accent" | "error" | "success";
}) {
  const tones: Record<string, string> = {
    default: "bg-black/5 text-[var(--color-ink)]",
    accent: "bg-[var(--color-accent)] text-white",
    error: "bg-red-50 text-[var(--color-error)]",
    success: "bg-green-50 text-[var(--color-success)]",
  };
  return (
    <span
      className={clsx(
        "inline-block px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}
