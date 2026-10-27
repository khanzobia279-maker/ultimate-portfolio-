/** Splits text into words and characters so GSAP can animate each letter. */
export default function Words({ text, cls, gap = ".22em" }) {
  return text.split(" ").map((w, i) => (
    <span key={i} className="clip" style={{ marginRight: gap }}>{[...w].map((c, j) => <span key={j} className={cls + " inline-block"}>{c}</span>)}</span>
  ));
}
