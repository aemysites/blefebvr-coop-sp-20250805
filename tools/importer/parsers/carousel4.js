/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slides container
  const bxViewport = element.querySelector('.bx-viewport');
  if (!bxViewport) return;
  const bxslider = bxViewport.querySelector('ul.bxslider');
  if (!bxslider) return;

  // ONLY select <li> elements that are NOT clones (do not have class 'bx-clone')
  const slides = Array.from(bxslider.children).filter(
    li => li.querySelector('.KBK-092-act-kachel') && !li.classList.contains('bx-clone')
  );

  const rows = [];
  // Header
  rows.push(['Carousel']);

  slides.forEach((li) => {
    const kachel = li.querySelector('.KBK-092-act-kachel');
    const link = kachel ? kachel.querySelector('a') : null;
    // === IMAGE CELL ===
    let imageEl = null;
    if (link) {
      const imageDiv = link.querySelector('.KBK-092-image');
      if (imageDiv) {
        const picture = imageDiv.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          let realSrc = '';
          let alt = '';
          if (img) {
            alt = img.getAttribute('alt') || '';
            realSrc = img.getAttribute('src') || '';
            if (!realSrc || realSrc.trim() === '') {
              const sources = Array.from(picture.querySelectorAll('source'));
              if (sources.length) {
                realSrc = sources[sources.length - 1].getAttribute('srcset') || '';
              }
            }
            if (realSrc) {
              img.src = realSrc;
            }
            imageEl = img;
          }
        }
      }
    }
    // === TEXT CELL ===
    let textContent = [];
    if (link) {
      const h3 = link.querySelector('.KBK-092-hl');
      if (h3) {
        const strong = document.createElement('strong');
        strong.innerHTML = h3.innerHTML;
        textContent.push(strong);
        textContent.push(document.createElement('br'));
      }
      const p = link.querySelector('p');
      if (p) {
        textContent.push(document.createTextNode(p.textContent));
      }
    }
    rows.push([
      imageEl,
      textContent.length === 1 ? textContent[0] : textContent,
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
