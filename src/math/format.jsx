/**
 * Convert basic math notation to HTML with sup/sub tags.
 * Handles: ^x ^2 ^{n-3}  _n _{k+1}
 */
export function mathFmt(str) {
  if (!str) return ''
  return String(str)
    .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')   // ^{...}
    .replace(/\^([a-zA-Z0-9*]+)/g, '<sup>$1</sup>') // ^x ^2 ^n ^0
    .replace(/_\{([^}]+)\}/g, '<sub>$1</sub>')     // _{...}
    .replace(/_([a-zA-Z0-9]+)/g, '<sub>$1</sub>')  // _n _k
}

/** Inline component for math-formatted text */
export function M({ children, style, className }) {
  return (
    <span
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: mathFmt(String(children ?? '')) }}
    />
  )
}
