import { client } from "./client";

export async function getProducts() {
  return client.fetch(`*[_type == "product" && available == true] | order(category asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    image,
    price,
    category
  }`);
}

export async function getProductBySlug(slug: string) {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      description,
      image,
      price,
      category
    }`,
    { slug }
  );
}

export async function getGalleryImages() {
  return client.fetch(`*[_type == "galleryImage"] | order(_createdAt desc) {
    _id,
    title,
    image,
    alt
  }`);
}

export async function getPageContent(page: string) {
  return client.fetch(
    `*[_type == "pageContent" && page == $page][0] {
      heading,
      body,
      heroImage
    }`,
    { page }
  );
}
