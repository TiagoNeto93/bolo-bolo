export const homepage = {
  name: "homepage",
  title: "Pagina Inicial",
  type: "document",
  // Singleton — only one document
  __experimental_actions: ["update", "publish"],
  fields: [
    {
      name: "heroTagline",
      title: "Tagline do hero",
      type: "string",
      description: "Texto pequeno acima do titulo (ex: Bolos caseiros em Braga)",
    },
    {
      name: "heroDescription",
      title: "Descricao do hero",
      type: "text",
      rows: 2,
      description: "Texto abaixo do titulo Bolo-Bolo",
    },
    {
      name: "heroCta",
      title: "Texto do botao CTA",
      type: "string",
      description: "Ex: Faz a tua encomenda",
    },
    {
      name: "footerTagline",
      title: "Mensagem do rodape",
      type: "text",
      rows: 2,
      description: "Mensagem pessoal no rodape do site",
    },
    {
      name: "confirmacaoTitulo",
      title: "Titulo da pagina de confirmacao",
      type: "string",
      description: "Ex: Obrigado pela preferencia, a tua encomenda esta no forno",
    },
    {
      name: "confirmacaoTexto",
      title: "Texto da pagina de confirmacao",
      type: "text",
      rows: 4,
      description: "Paragrafo de confirmacao apos a encomenda ser enviada",
    },
    {
      name: "emailMensagemExtra",
      title: "Mensagem extra no email de confirmacao (opcional)",
      type: "string",
      description: "Aparece no fundo do email enviado ao cliente. Ex: Boas festas! Feliz Pascoa!",
    },
  ],
  preview: {
    prepare() {
      return { title: "Pagina Inicial" };
    },
  },
};
