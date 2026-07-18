export const metadata = {
  title: {
    default: "Управляющий совет — решения, которые меняют школу",
    template: "%s — Управляющий совет"
  },
  description: "Официальный сайт Управляющего совета образовательной организации"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="theme-color" content="#174a8b" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="stylesheet" href="/site.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
