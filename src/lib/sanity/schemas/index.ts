import { product } from "./product";
import { galleryImage } from "./gallery-image";
import { blockedDate } from "./blocked-date";
import { homepage } from "./homepage";
import { about } from "./about";
import { deliveryInfo } from "./delivery-info";
import { encomenda } from "./encomenda";

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
  // Orders
  encomenda,
];
