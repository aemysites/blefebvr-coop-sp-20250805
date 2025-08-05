/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row (must match the block name exactly)
  const headerRow = ['Hero (hero2)'];

  // Find hero image (background image) - use .SR_002_Auftrittsheader > picture
  let bgPicture = null;
  const headerImageDiv = element.querySelector('.SR_002_Auftrittsheader');
  if (headerImageDiv) {
    bgPicture = headerImageDiv.querySelector('picture');
  }

  // Find the hero text content:
  // Look for a large heading and any supporting paragraphs directly following the image section
  // Heuristic: find first heading (h1-h3) or a container containing such
  let heroTextBlock = null;
  // Check siblings after image block
  let candidate = headerImageDiv ? headerImageDiv.nextElementSibling : null;
  while (candidate && candidate.tagName.toLowerCase() === 'script') {
    candidate = candidate.nextElementSibling;
  }
  // If candidate exists and contains heading/paragraph, use it
  if (candidate && candidate.querySelector && candidate.querySelector('h1, h2, h3, h4, h5, h6, p')) {
    heroTextBlock = candidate;
  } else {
    // Fallback: find any first visible heading/paragraph block not inside nav or .SR_002_Auftrittsheader
    const ignore = [headerImageDiv, element.querySelector('nav')];
    let found = null;
    for (const child of element.children) {
      if (!ignore.includes(child)) {
        if (child.querySelector && child.querySelector('h1, h2, h3, h4, h5, h6, p')) {
          found = child;
          break;
        }
      }
    }
    heroTextBlock = found;
  }

  // If still not found, fallback to null
  if (!heroTextBlock) heroTextBlock = '';

  // Construct the table rows: header, background image, text block
  const rows = [
    headerRow,
    [bgPicture],
    [heroTextBlock]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
