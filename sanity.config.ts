"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/lib/sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "bolo-bolo",
  title: "Bolo-Bolo",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Bolo-Bolo")
          .items([
            // Orders
            S.listItem()
              .title("Encomendas")
              .child(
                S.documentTypeList("encomenda")
                  .title("Encomendas")
                  .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                  .canHandleIntent((intent) => intent !== "create")
              ),

            S.divider(),

            // Catalogue
            S.listItem()
              .title("Bolos")
              .child(S.documentTypeList("product").title("Bolos")),
            S.listItem()
              .title("Galeria")
              .child(S.documentTypeList("galleryImage").title("Galeria")),

            S.divider(),

            // Singletons — only one document each
            S.listItem()
              .title("Pagina Inicial")
              .child(
                S.document()
                  .schemaType("homepage")
                  .documentId("homepage")
                  .title("Pagina Inicial")
              ),
            S.listItem()
              .title("Sobre Mim")
              .child(
                S.document()
                  .schemaType("about")
                  .documentId("about")
                  .title("Sobre Mim")
              ),
            S.listItem()
              .title("Informacoes de Entrega")
              .child(
                S.document()
                  .schemaType("deliveryInfo")
                  .documentId("deliveryInfo")
                  .title("Informacoes de Entrega")
              ),

            S.divider(),

            // Operations
            S.listItem()
              .title("Datas Bloqueadas")
              .child(
                S.documentTypeList("blockedDate").title("Datas Bloqueadas")
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
