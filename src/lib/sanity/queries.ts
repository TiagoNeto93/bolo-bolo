import { client } from "./client";

// ─── Products ───────────────────────────────────────────────────────────────

export async function getProducts() {
  return client.fetch(`
    *[_type == "product" && available == true] | order(category asc, name asc) {
      _id,
      name,
      "slug": slug.current,
      description,
      "image": images[0],
      images,
      price,
      category,
      sizes,
      flavours,
      featured
    }
  `);
}

export async function getSpecialProducts() {
  return client.fetch(`
    *[_type == "product" && available == true && destaque == true] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      description,
      "image": images[0],
      category,
      sizes,
      etiqueta
    }
  `);
}

export async function getFeaturedProducts() {
  return client.fetch(`
    *[_type == "product" && available == true && featured == true] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      description,
      "image": images[0],
      category,
      sizes
    }
  `);
}

export async function getProductBySlug(slug: string) {
  return client.fetch(
    `
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      description,
      images,
      category,
      sizes,
      flavours,
      available
    }
  `,
    { slug }
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export async function getGalleryImages() {
  return client.fetch(`
    *[_type == "galleryImage"] | order(_createdAt desc) {
      _id,
      title,
      image,
      alt
    }
  `);
}

// ─── Blocked Dates ───────────────────────────────────────────────────────────

export async function getBlockedDates(): Promise<string[]> {
  return client.fetch(`
    *[_type == "blockedDate"] | order(date asc) {
      date
    }.date
  `);
}

// ─── Page content (singletons) ───────────────────────────────────────────────

export async function getHomepageContent() {
  return client.fetch(
    `*[_type == "homepage" && _id == "homepage"][0] {
      heroTagline,
      heroDescription,
      heroCta,
      footerTagline,
      confirmacaoTitulo,
      confirmacaoTexto,
      emailMensagemExtra
    }`
  );
}

export async function getAboutContent() {
  return client.fetch(
    `*[_type == "about" && _id == "about"][0] {
      heading,
      photo,
      body
    }`
  );
}

// ─── Encomendas ──────────────────────────────────────────────────────────────

export async function getEncomendaByReferencia(referencia: string) {
  return client.fetch(
    `*[_type == "encomenda" && referencia == $referencia][0] {
      referencia,
      estado,
      nome,
      data
    }`,
    { referencia }
  );
}

// ─── Page content (singletons) ───────────────────────────────────────────────

export async function getDeliveryInfo() {
  return client.fetch(
    `*[_type == "deliveryInfo" && _id == "deliveryInfo"][0] {
      zones,
      leadTime,
      notes
    }`
  );
}
