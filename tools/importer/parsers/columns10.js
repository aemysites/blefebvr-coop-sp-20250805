/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct child divs (columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Header row must be a single cell
  const headerRow = ['Columns (columns10)'];

  // Each column's content becomes one cell in the second row
  const contentRow = columns.map((col) => {
    // Find the ul in the column
    const ul = col.querySelector('ul');
    if (!ul) return '';
    const lis = Array.from(ul.children);
    if (lis.length === 0) return '';

    // First li: headline, rest are links
    const headlineLi = lis[0];
    const headline = document.createElement('strong');
    headline.textContent = headlineLi.textContent;

    // For the remaining lis, create a <ul> referencing those <li> elements directly
    const contentLis = lis.slice(1);
    const list = document.createElement('ul');
    contentLis.forEach((li) => list.appendChild(li));

    // Compose the cell: headline, <br>, then list
    const frag = document.createDocumentFragment();
    frag.append(headline, document.createElement('br'), list);
    return frag;
  });

  const tableRows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
