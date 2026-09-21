/**
 * Picks how a block of body copy should fill a wide document column.
 *
 * Long copy sets into two columns — one line running the full width of the
 * column would be an uncomfortable measure. Short copy simply fills the
 * column: at one or two lines the eye never has to sweep back repeatedly, so
 * the long measure costs nothing and the column is no longer half empty.
 *
 * The threshold is roughly four lines at the two-column width, below which
 * each column would get a single orphaned line.
 */
const TWO_COLUMN_THRESHOLD = 220;

export function proseFill(text: string): string {
  return text.length >= TWO_COLUMN_THRESHOLD
    ? "measure prose-columns"
    : "prose-fill";
}
