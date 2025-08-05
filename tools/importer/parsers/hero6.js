/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Hero (hero6)'];

  // 1. Background image cell
  let bgImgUrl = element.getAttribute('data-bgimage-lg') || element.getAttribute('data-bgimage-md') || element.getAttribute('data-bgimage-sm') || element.getAttribute('data-bgimage-xs');
  let imgCell = '';
  if (bgImgUrl) {
    const img = document.createElement('img');
    img.src = bgImgUrl;
    img.setAttribute('loading', 'eager');
    imgCell = img;
  }

  // 2. Content (title, subheading, cta)
  // Find the content area
  let contentCell = '';
  const article = element.querySelector('article');
  if (article) {
    // Try to find the main content column
    const mainCol = article.querySelector('.col-xs-12.col-sm-7');
    if (mainCol) {
      const textBg = mainCol.querySelector('.text-background');
      if (textBg) {
        const items = [];
        // Get all paragraphs and headings in text-background (in order)
        textBg.childNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Element
            if (/^H[1-6]$/.test(node.tagName) || node.tagName === 'P') {
              items.push(node);
            } else if (node.classList.contains('KBK-024-call-to-action-button-small')) {
              // This is the CTA button wrapper
              const a = node.querySelector('a');
              if (a) items.push(a);
            }
          }
        });
        contentCell = items;
      }
    }
  }

  // Compose table
  const cells = [
    headerRow,
    [imgCell],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
