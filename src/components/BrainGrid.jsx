import BrainRenderer from "./BrainRenderer";

// Responsive grid of brain renders / figures — e.g. a cohort gallery, a panel of
// static slices, or a mix of static + interactive views.
//   <BrainGrid cols={3} heading="..." items={[ {type:"image", src:"..."}, ... ]} />
const COLS = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

export default function BrainGrid({ items = [], cols = 3, heading, caption }) {
  return (
    <figure className="my-2">
      {heading && <h3 className="font-sans font-semibold text-ink text-lg mb-3">{heading}</h3>}
      <div className={`grid ${COLS[cols] || COLS[3]} gap-4`}>
        {items.map((item, i) => (
          <BrainRenderer key={i} {...item} />
        ))}
      </div>
      {caption && (
        <figcaption className="font-serif text-sm text-ink2 mt-3 text-center italic">{caption}</figcaption>
      )}
    </figure>
  );
}
