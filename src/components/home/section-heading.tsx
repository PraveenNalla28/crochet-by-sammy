export function SectionHeading({
  title,
  subtitle,
  adornment = "hearts",
}: {
  title: string;
  subtitle?: string;
  adornment?: "hearts" | "yarn" | "none";
}) {
  const left =
    adornment === "hearts" ? (
      <span className="text-pink-accent">♥</span>
    ) : adornment === "yarn" ? (
      <span className="text-pink-accent" aria-hidden>
        ✦
      </span>
    ) : null;
  const right =
    adornment === "hearts" ? (
      <span className="text-pink-accent">♥</span>
    ) : adornment === "yarn" ? (
      <span className="text-pink-accent" aria-hidden>
        ✦
      </span>
    ) : null;

  return (
    <div className="text-center">
      <h2 className="font-serif text-[1.65rem] text-text-head sm:text-3xl md:text-4xl">
        {left && <>{left} </>}
        {title}
        {right && <> {right}</>}
      </h2>
      {subtitle && (
        <p className="mt-2 px-2 text-sm leading-relaxed whitespace-normal break-words text-text-muted md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
