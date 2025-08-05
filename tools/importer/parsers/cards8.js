/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to safely extract text content
  function getText(el) {
    return el ? el.textContent.trim() : '';
  }

  const rows = [['Cards (cards8)']];

  // Find all card-like columns
  const cardColumns = element.querySelectorAll('.row-flex .col-xs-12.col-sm-6.col-md-4');

  cardColumns.forEach((col) => {
    const teaser = col.querySelector('.teaser');
    if (!teaser) return;

    // --- IMAGE ---
    let imgEl = null;
    const picture = teaser.querySelector('picture');
    if (picture) {
      // Image selection: prefer first "source srcset", else fallback to <img src>
      let imgSrc = '';
      // Try all <source> in order
      const sources = Array.from(picture.querySelectorAll('source'));
      for (const source of sources) {
        const srcset = source.getAttribute('srcset');
        if (srcset) {
          // pick the first url before space in the srcset
          imgSrc = srcset.split(',')[0].trim().split(' ')[0];
          if (imgSrc) break;
        }
      }
      if (!imgSrc) {
        const fallbackImg = picture.querySelector('img');
        if (fallbackImg && fallbackImg.src) {
          imgSrc = fallbackImg.src;
        }
      }
      if (imgSrc) {
        // Use an <img> element referencing the existing src
        imgEl = document.createElement('img');
        imgEl.src = imgSrc;
        // Use fallback <img> alt if present, else empty
        const fallbackImg = picture.querySelector('img');
        imgEl.alt = fallbackImg && fallbackImg.hasAttribute('alt') ? fallbackImg.getAttribute('alt') : '';
      }
    }

    // --- TEXT CONTENT ---
    // Title (as h3, but in the block, bold is enough)
    let title = '';
    const h3 = teaser.querySelector('.teaser-headlines h3');
    if (h3) {
      title = getText(h3);
    }

    // Description (from .txt-container > p)
    let desc = '';
    const descP = teaser.querySelector('.txt-container p');
    if (descP) {
      desc = getText(descP);
    }

    // CTA: the first <a> inside the .KBK-014-link (not the outer <a> covering the whole card)
    let cta = null;
    const ctaDiv = teaser.querySelector('.KBK-014-link');
    if (ctaDiv) {
      const ctaA = ctaDiv.querySelector('a');
      if (ctaA) {
        cta = ctaA;
      }
    }

    // Compose the text cell: title (bold), desc, CTA (link)
    const textCell = document.createElement('div');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title;
      textCell.appendChild(strong);
    }
    if (desc) {
      if (title) textCell.appendChild(document.createElement('br'));
      const descDiv = document.createElement('div');
      descDiv.textContent = desc;
      textCell.appendChild(descDiv);
    }
    if (cta) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(cta);
    }

    rows.push([
      imgEl || '',
      textCell
    ]);
  });

  // Replace the whole block with the cards table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
