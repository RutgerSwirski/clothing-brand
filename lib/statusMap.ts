export const statusMap = {
  AVAILABLE: "Available",
  COMING_SOON: "Coming Soon",
  SOLD: "Sold",
  ARCHIVED: "Archived",
  IN_PROGRESS: "In Progress",
};

export type ProductStatus = keyof typeof statusMap;
