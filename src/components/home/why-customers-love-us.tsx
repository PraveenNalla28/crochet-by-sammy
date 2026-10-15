import { SectionHeading } from "@/components/home/section-heading";
import { WHY_US } from "@/lib/home-content";

function WhyIcon({ index }: { index: number }) {
  const icons = [
    "M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z",
    "M4 20h16M7 20V10l5-4 5 4v10",
    "M12 8v13M8 12h8",
    "M12 21s-7-4.5-9.5-9.5C1 8.5 3.5 6 6.5 6c1.7 0 3.2.9 4 2.2.8-1.3 2.3-2.2 4-2.2 3 0 5.5 2.5 4 5.5C19 16.5 12 21 12 21z",
  ];
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-maroon" aria-hidden>
      <path
        d={icons[index]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WhyCustomersLoveUs() {
  return (
    <section className="bg-cream px-4 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Why Customers Love Us" adornment="none" />
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_US.map((item, i) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#ecd5d9] bg-white">
                <WhyIcon index={i} />
              </div>
              <h3 className="mt-4 font-serif text-lg text-text-head">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
