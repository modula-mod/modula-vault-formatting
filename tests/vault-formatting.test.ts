import {describe, expect, it} from 'vitest'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {validateModulaModuleManifest} from '@modula/module-validator'
import {copyAsMarkdown, formatSelection, wordCount} from '../src/index.js'

const root = new URL('..', import.meta.url).pathname

describe('Vault Formatting plugin', () => {
  it('provides real deterministic local formatting operations', () => {
    expect(wordCount('Project Atlas is ready')).toBe(4)
    expect(formatSelection('heading', 'Plan')).toBe('## Plan')
    expect(formatSelection('quote', 'Evidence')).toBe('> Evidence')
    expect(formatSelection('checklist', 'Verify')).toBe('- [ ] Verify')
    expect(copyAsMarkdown('Atlas', 'Body')).toBe('# Atlas\n\nBody\n')
  })

  it('is a valid backend-free plugin targeting Vault Notes', () => {
    const manifest = JSON.parse(readFileSync(join(root, 'modula.module.json'), 'utf8'))
    const result = validateModulaModuleManifest(manifest)
    expect(result.valid, result.issues.map(issue => `${issue.code} ${issue.path}`).join('\n')).toBe(true)
    expect(manifest.extensionProduct.kind).toBe('plugin')
    expect(manifest.extensionProduct.targets[0].productId).toBe('digital.modula.vault-notes')
    expect(manifest.backend).toBeUndefined()
  })
})
