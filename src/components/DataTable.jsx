// Responsive styled table.
//   columns: [{ key, label, align? }]
//   rows:    [{ [key]: value }]
//   caption: optional string
// Scrolls horizontally on narrow screens; never breaks the layout.
export default function DataTable({ columns = [], rows = [], caption }) {
  return (
    <figure className="my-2">
      <div className="overflow-x-auto rounded-xl border border-rule/20">
        <table className="w-full border-collapse text-left font-serif text-sm">
          <thead>
            <tr className="bg-paper2">
              {columns.map((c, i) => (
                <th
                  key={c.key}
                  className={`font-sans font-semibold text-ink px-4 py-3 border-b border-rule/20 whitespace-nowrap ${
                    i === 0 ? "w-full" : ""
                  } ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="even:bg-paper2/40">
                {columns.map((c, ci) => (
                  <td
                    key={c.key}
                    className={`text-ink2 px-4 py-2.5 border-b border-rule/10 tabular-nums whitespace-nowrap ${
                      ci === 0 ? "w-full whitespace-normal" : ""
                    } ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""}`}
                  >
                    {row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="font-serif text-sm text-ink2 mt-2 text-center italic">{caption}</figcaption>
      )}
    </figure>
  );
}
