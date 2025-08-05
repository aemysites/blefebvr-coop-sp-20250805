/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in the example
  const rows = [
    ['Cards (cards5)']
  ];

  // Select each card column inside the .row.row-flex
  const cardCols = element.querySelectorAll('.row.row-flex > .col-xs-12');
  
  cardCols.forEach(cardCol => {
    const teaser = cardCol.querySelector('.teaser');
    if (!teaser) return;

    // --- Image cell ---
    let imgEl = null;
    const picture = teaser.querySelector('picture');
    if (picture) {
      // Find the first <img> that is not a loader (has a src that is not a .gif placeholder)
      const imgs = picture.querySelectorAll('img');
      for (const img of imgs) {
        if (img.src && !img.src.includes('bx_loader.gif')) {
          imgEl = img;
          break;
        }
      }
      // If all images are loader gifs, just use the first <img> (will display a broken image but preserves all content)
      if (!imgEl && imgs.length > 0) {
        imgEl = imgs[0];
      }
    }

    // --- Text cell ---
    const textContainer = teaser.querySelector('.KBK-007-A-text');
    const textFragment = document.createDocumentFragment();

    // Title (h3.hl)
    const title = teaser.querySelector('.teaser-headlines .hl');
    if (title) {
      // Use <strong> for heading, as in the markdown example
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      textFragment.appendChild(strong);
      textFragment.appendChild(document.createElement('br'));
    }

    // Description (first <p> that does not contain a link)
    if (textContainer) {
      const ps = Array.from(textContainer.querySelectorAll('p'));
      for (const p of ps) {
        // Ignore if it contains only a link (CTA)
        if (p.querySelector('a')) continue;
        // Add the text as a text node
        textFragment.appendChild(document.createTextNode(p.textContent.trim()));
        textFragment.appendChild(document.createElement('br'));
      }
      // CTA (first <a> link in a <p>)
      const ctaLink = textContainer.querySelector('p a');
      if (ctaLink) {
        const link = document.createElement('a');
        link.href = ctaLink.href;
        link.textContent = ctaLink.textContent;
        textFragment.appendChild(link);
      }
    }
    // Remove trailing <br> if present
    while (textFragment.lastChild && textFragment.lastChild.nodeName === 'BR') {
      textFragment.removeChild(textFragment.lastChild);
    }

    // Add to rows: [image, text]
    rows.push([
      imgEl,
      textFragment
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
