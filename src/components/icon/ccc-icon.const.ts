export type $IconName =
  | "small-down"
  | "paper-plane"
  | "cancel"
  | "link"
  | "warning"
  | "eye"
  | "big-currency"
  | "history"
  | "collection"
  | "circle-diamond"
  | "comment"
  | "share"
  | "check"
  | "dislike"
  | "like";

export const IconPaths = new Map<$IconName, number>([
  ["small-down", 2],
  ["paper-plane", 2],
  ["cancel", 2],
  ["link", 2],
  ["warning", 2],
  ["eye", 2],
]);

export type $Direction = "tb" | "lr"; // "column" | "row";
