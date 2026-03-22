import { product } from "./product";
import { galleryImage } from "./gallery-image";
import { blockedDate } from "./blocked-date";
import { homepage } from "./homepage";
import { about } from "./about";
import { deliveryInfo } from "./delivery-info";

export const schemaTypes = [
  // Content (catalogue)
  product,
  galleryImage,
  // Singletons (page content)
  homepage,
  about,
  deliveryInfo,
  // Operations
  blockedDate,
];
