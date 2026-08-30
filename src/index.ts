export const VAULT_FORMATTING_PRODUCT_ID = 'digital.modula.vault-notes.formatting' as const
export const VAULT_FORMATTING_VERSION = '0.3.0' as const

export type FormattingOperation = 'heading' | 'quote' | 'checklist'

export function wordCount(text: string) {
  const words = text.trim().match(/\S+/g)
  return words?.length ?? 0
}

export function copyAsMarkdown(title: string, body: string) {
  return `# ${title.trim()}\n\n${body.trim()}\n`
}

export function formatSelection(operation: FormattingOperation, selection: string) {
  const lines = selection.split('\n')
  if (operation === 'heading') return lines.map(line => `## ${stripPrefix(line)}`).join('\n')
  if (operation === 'quote') return lines.map(line => `> ${stripPrefix(line)}`).join('\n')
  return lines.map(line => `- [ ] ${stripPrefix(line)}`).join('\n')
}

function stripPrefix(line: string) {
  return line.replace(/^(?:#{1,6}|>|[-*]\s*(?:\[[ xX]\])?)\s*/, '')
}
