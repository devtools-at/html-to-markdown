/**
 * HTML to Markdown
 * Convert HTML to Markdown
 *
 * Online tool: https://devtools.at/tools/html-to-markdown
 *
 * @packageDocumentation
 */

function htmlToMarkdown(html: string): string {
  let markdown = html;

  // Remove script and style tags with their content
  markdown = markdown.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  markdown = markdown.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Remove HTML comments
  markdown = markdown.replace(/<!--[\s\S]*?-->/g, '');

  // Handle headings (h1-h6)
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n');
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n');
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '\n##### $1\n');
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '\n###### $1\n');

  // Handle bold and strong
  markdown = markdown.replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, '**$2**');

  // Handle italic and emphasis
  markdown = markdown.replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, '*$2*');

  // Handle strikethrough
  markdown = markdown.replace(/<(del|s|strike)[^>]*>(.*?)<\/\1>/gi, '~~$2~~');

  // Handle code blocks
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (match, code) => {
    const decoded = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    return '\n```\n' + decoded.trim() + '\n```\n';
  });

  // Handle inline code
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // Handle links
  markdown = markdown.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Handle images
  markdown = markdown.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)');
  markdown = markdown.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![$1]($2)');
  markdown = markdown.replace(/<img[^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![]($1)');

  // Handle blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, content) => {
    const lines = content.trim().split('\n');
    return '\n' + lines.map((line: string) => '> ' + line.trim()).join('\n') + '\n';
  });

  // Handle unordered lists
  markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
    let result = '\n';
    content.replace(/<li[^>]*>(.*?)<\/li>/gi, (m: string, item: string) => {
      result += '- ' + item.trim() + '\n';
      return m;
    });
    return result + '\n';
  });

  // Handle ordered lists
  markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
    let result = '\n';
    let index = 1;
    content.replace(/<li[^>]*>(.*?)<\/li>/gi, (m: string, item: string) => {
      result += index + '. ' + item.trim() + '\n';
      index++;
      return m;
    });
    return result + '\n';
  });

  // Handle tables
  markdown = markdown.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (match, tableContent) => {
    let result = '\n';
    const rows: string[][] = [];

    // Extract table rows
    tableContent.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (m: string, rowContent: string) => {
      const cells: string[] = [];
      rowContent.replace(/<t[hd][^>]*>(.*?)<\/t[hd]>/gi, (cm: string, cell: string) => {
        cells.push(cell.trim());
        return cm;
      });
      if (cells.length > 0) {
        rows.push(cells);
      }
      return m;
    });

    // Convert to markdown table
    if (rows.length > 0) {
      // Header row
      result += '| ' + rows[0].join(' | ') + ' |\n';
      // Separator
      result += '| ' + rows[0].map(() => '---').join(' | ') + ' |\n';
      // Data rows
      for (let i = 1; i < rows.length; i++) {
        result += '| ' + rows[i].join(' | ') + ' |\n';
      }
    }

    return result + '\n';
  });

  // Handle horizontal rules
  markdown = markdown.replace(/<hr[^>]*\/?>/gi, '\n---\n');

  // Handle paragraphs
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n');

  // Handle line breaks
  markdown = markdown.replace(/<br[^>]*\/?>/gi, '  \n');

  // Handle divs and spans (just remove them)
  markdown = markdown.replace(/<\/?div[^>]*>/gi, '');
  markdown = markdown.replace(/<\/?span[^>]*>/gi, '');

  // Remove remaining HTML tags
  markdown = markdown.replace(/<\/?[^>]+(>|$)/g, '');

  // Decode HTML entities
  markdown = markdown
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  // Clean up excessive newlines
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  // Trim and return
  return markdown.trim();
}

// Export for convenience
export default { encode, decode };
