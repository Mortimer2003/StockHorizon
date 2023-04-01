
export const makeStyle = style => (...classNames) =>
  classNames.map(c => c?.split?.(" ")).flat()
    .filter(Boolean).map(c => style[c] || c).join(" ");
