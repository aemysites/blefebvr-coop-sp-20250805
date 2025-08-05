/* global WebImporter */
export default function parse(element, { document }) {
  // Get two main columns
  const columns = Array.from(element.querySelectorAll(':scope > .col-xs-12'));
  if (columns.length !== 2) return;

  // Assign left/right cols by push/pull
  let leftCol = columns.find(col => col.classList.contains('col-sm-pull-6') || !col.classList.contains('col-sm-push-6'));
  let rightCol = columns.find(col => col.classList.contains('col-sm-push-6'));
  if (!leftCol) leftCol = columns[0];
  if (!rightCol) rightCol = columns[1];

  // Helper to get child content, skip modals
  function getContent(col) {
    return Array.from(col.childNodes).filter(
      (node) => (node.nodeType === 1 && !node.classList.contains('modal')) || (node.nodeType === 3 && node.textContent.trim())
    );
  }

  const leftContent = getContent(leftCol);
  const rightContent = getContent(rightCol);

  // Split figure and other for both columns
  function splitFigure(content) {
    let figure = null;
    let rest = [];
    content.forEach((node) => {
      if (!figure && node.nodeType === 1 && node.tagName.toLowerCase() === 'figure') {
        figure = node;
      } else {
        rest.push(node);
      }
    });
    return { figure, rest };
  }
  const left = splitFigure(leftContent);
  const right = splitFigure(rightContent);

  // Compose two content rows beneath header
  // Row 1: left text, right image
  // Row 2: left image, right text
  const tableCells = [
    ['Columns (columns7)'],
    [
      left.rest.length === 1 ? left.rest[0] : left.rest,
      right.figure ? right.figure : ''
    ],
    [
      left.figure ? left.figure : '',
      right.rest.length === 1 ? right.rest[0] : right.rest
    ]
  ];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
