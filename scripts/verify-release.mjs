#!/usr/bin/env node
import {readFileSync} from 'node:fs'
import {validateModulaModuleManifest} from '@modula/module-validator'

const failures = []
const standard = JSON.parse(readFileSync('modula.module.json', 'utf8'))
const greenfield = JSON.parse(readFileSync('module.manifest.json', 'utf8'))
const check = (condition, message) => condition ? console.log(`PASS ${message}`) : (failures.push(message), console.error(`FAIL ${message}`))
const validation = validateModulaModuleManifest(standard)
check(validation.valid, `Standard 2.1 manifest validates${validation.valid ? '' : `: ${validation.issues.map(issue => `${issue.code} ${issue.path}`).join('; ')}`}`)
check(standard.extensionProduct?.kind === 'plugin', 'product kind is plugin')
check(standard.extensionProduct.targets?.[0]?.productId === 'digital.modula.vault-notes', 'Vault Notes target declared')
check(standard.backend === undefined && greenfield.backend === undefined, 'backend absent')
check(standard.serviceRegistry.items.length === 0 && standard.jobRegistry.items.length === 0, 'service and job registrations absent')
check(standard.extensionProduct.contributions.filter(item => item.kind === 'editor.command').length === 3, 'three editor commands declared')
const text = JSON.stringify({standard, greenfield})
for (const prohibited of ['notes.read', 'notes.delete', 'notes.export', 'remoteEntry', 'componentCode']) check(!text.includes(prohibited), `prohibited authority absent: ${prohibited}`)
if (failures.length) process.exit(1)
console.log('Vault Formatting release verifier passed')
