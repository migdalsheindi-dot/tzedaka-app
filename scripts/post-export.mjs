// Ajusta el HTML exportado para web: habilita los safe-area insets del
// celular (viewport-fit=cover), pinta la barra del navegador y el fondo del
// color de la app, y prepara los archivos que necesita GitHub Pages.
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';

const indexPath = 'dist/index.html';
let html = readFileSync(indexPath, 'utf8');

html = html.replace(
  /<meta name="viewport"[^>]*>/,
  '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />' +
    '\n    <meta name="theme-color" content="#050507" />'
);
html = html.replace('</head>', '<style>html,body{background-color:#050507}</style></head>');

writeFileSync(indexPath, html);
copyFileSync(indexPath, 'dist/404.html'); // fallback SPA en GitHub Pages
writeFileSync('dist/.nojekyll', ''); // sin esto GitHub ignora la carpeta _expo
console.log('post-export: index.html parcheado, 404.html y .nojekyll listos');
