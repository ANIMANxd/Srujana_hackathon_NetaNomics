import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="font-sans bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground transition-colors duration-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}