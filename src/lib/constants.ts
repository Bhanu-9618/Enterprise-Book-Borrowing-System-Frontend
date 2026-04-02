export const BOOK_CATEGORIES = [
  "FICTION",
  "NON_FICTION",
  "SCIENCE",
  "HISTORY",
  "TECHNOLOGY",
  "BUSINESS",
  "BIOGRAPHY",
  "CHILDREN",
  "MYSTERY",
  "FANTASY",
  "LITERATURE",
  "OTHERS",
];

export const ITEMS_PER_PAGE = 10;
export const BOOKS_PER_PAGE = 16;

export const formatCategoryName = (cat: string) => {
  return cat
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};
