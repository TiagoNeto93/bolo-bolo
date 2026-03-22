export const blockedDate = {
  name: "blockedDate",
  title: "Data Bloqueada",
  type: "document",
  fields: [
    {
      name: "date",
      title: "Data",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "reason",
      title: "Motivo (opcional)",
      type: "string",
      description: "Ex: Ferias, ja com encomenda, feriado",
    },
  ],
  preview: {
    select: { title: "date", subtitle: "reason" },
  },
};
