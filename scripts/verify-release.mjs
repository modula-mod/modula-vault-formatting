#!/usr/bin/env node
import {createHash} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import {validateModulaModuleManifest} from '@modula/module-validator'

const failures = []
const readJson = path => JSON.parse(readFileSync(path, 'utf8'))
const check = (condition, message) => condition ? console.log(`PASS ${message}`) : (failures.push(message), console.error(`FAIL ${message}`))
const packageJson = readJson('package.json')
const product = readJson('modula.product.json')
const standard = readJson('modula.module.json')
const greenfield = readJson('module.manifest.json')
const validation = validateModulaModuleManifest(standard)
check(validation.valid, `Standard 2.1 manifest validates${validation.valid ? '' : `: ${validation.issues.map(issue => `${issue.code} ${issue.path}`).join('; ')}`}`)
check(product.identity.id === 'digital.modula.vault-notes.formatting' && product.identity.version === packageJson.version, 'MPS product identity matches package')
check(standard.moduleVersion === packageJson.version && greenfield.version === packageJson.version, 'compatibility versions match package')
check(standard.extensionProduct?.kind === 'plugin', 'product kind is plugin')
check(standard.extensionProduct.targets?.[0]?.productId === 'digital.modula.vault-notes', 'Vault Notes target declared')
check(standard.backend === undefined && greenfield.backend === undefined, 'backend absent')
check(standard.serviceRegistry.items.length === 0 && standard.jobRegistry.items.length === 0, 'service and job registrations absent')
check(standard.extensionProduct.contributions.filter(item => item.kind === 'editor.command').length === 3, 'three editor commands declared')
check(packageJson.files.includes('frontend/frontend.manifest.json') && !packageJson.files.includes('frontend'), 'release package includes only the compiled frontend')

const frontendPath = product.frontend?.artifact?.path
check(product.frontend?.mode === 'host-contribution' && frontendPath === 'frontend/frontend.manifest.json' && existsSync(frontendPath), 'product-owned host contribution artifact exists')
if (frontendPath && existsSync(frontendPath)) {
  const bytes = readFileSync(frontendPath)
  const frontend = JSON.parse(bytes.toString('utf8'))
  const hash = createHash('sha256').update(bytes).digest('hex')
  check(hash === product.frontend.artifact.sha256 && hash === product.release.provenance.frontendSha256, 'frontend hash and provenance match')
  check(frontend.productId === product.identity.id && frontend.releaseVersion === packageJson.version && frontend.mode === 'host-contribution', 'frontend identity and mode match')
  check(frontend.contributions.length === product.contributions.length, 'every formatting contribution is product-owned')
  for (const declaration of product.contributions) check(frontend.contributions.some(item => item.id === declaration.id && item.target === declaration.target), `frontend contribution matches MPS declaration: ${declaration.id}`)
  check(frontend.views === undefined && frontend.routes === undefined && frontend.entry === undefined, 'plugin does not invent a standalone app')
}

const text = JSON.stringify({product, standard, greenfield})
for (const prohibited of ['notes.read', 'notes.delete', 'notes.export', 'remoteEntry', 'componentCode', 'rawJs', 'rawHtml']) check(!text.includes(prohibited), `prohibited authority absent: ${prohibited}`)
if (failures.length) process.exit(1)
console.log('Vault Formatting release verifier passed')
