import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'class', 'style', 'id', 'data-internal-href'],
    ADD_TAGS: ['iframe'] // Allow iframes for embeds if needed, otherwise remove
  });
};
