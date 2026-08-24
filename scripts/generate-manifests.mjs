#!/usr/bin/env node
import {writeFileSync} from 'node:fs'
import {vaultNotesStandard21ManifestFixture} from '@modula/module-fixtures'
import {createDefaultModuleSectionVersions, manifestChecksum} from '@modula/module-standard'

const id = 'digital.modula.vault-notes.formatting'
const targetId = 'digital.modula.vault-notes'
const version = '0.1.0'
const sourceCommit = process.argv[2] ?? '0000000000000000000000000000000000000000'
const standard = replaceProduct(vaultNotesStandard21ManifestFixture, 'digital.modula.vault-notes', id)

Object.assign(standard, {
  id, slug: 'vault-formatting', name: 'Vault Formatting', description: 'Backend-free declarative formatting plugin for Vault Notes.', moduleVersion: version,
  publisher: {id: 'modula', name: 'Modula', website: 'https://modula.digital', supportUrl: 'https://modula.digital/support'},
  compatibility: {host: '^1.0.0', runtime: '^1.0.0', standard: '^2.1.0', platforms: ['ios', 'android', 'web']},
  permissions: [{id: 'notes.editor.contribute', reason: 'Register declared local formatting commands.', required: true, risk: 'low', policyMode: 'observe'}, {id: 'notes.actions.contribute', reason: 'Register the declared copy-as-Markdown note action.', required: true, risk: 'low', policyMode: 'observe'}],
  capabilities: [{id: 'functions', required: true, reason: 'Run bounded local formatting functions.'}, {id: 'ui-contributions', required: true, reason: 'Publish declarative editor contributions.'}, {id: 'offline', required: true, reason: 'Run all formatting actions locally without a service.'}],
  records: [], views: [], actions: [], functions: functions(), settings: [], events: [], automations: [], search: [], ai: [],
  migrations: {dataSchemaVersion: '1.0.0', steps: []},
  release: {repository: 'modula-mod/modula-vault-formatting', commitSha: sourceCommit, checksum: '0'.repeat(64), licenseEvidence: ['LICENSE', 'README.md'], signing: {signed: false}, channel: 'stable', reviewStatus: 'approved', securityAdvisories: []},
  extensionProduct: extensionProduct(),
})
delete standard.backend
standard.identity = {version: '2.1.0', metadata: {moduleId: id, publisherId: 'modula'}}
standard.dependencyGraph = {version: '2.1.0', requires: [{moduleId: targetId, versionRange: '>=1.2.0 <2.0.0', reason: 'Vault Formatting extends only declared Vault Notes editor contracts.', capabilityIds: ['notes.editor.contribute']}], optional: [], recommended: [], conflicts: [], replaces: [], provides: [{id: `${id}.commands`, title: 'Vault formatting commands', version, kind: 'capability'}]}
standard.serviceRegistry = {version: '2.1.0', items: []}
standard.jobRegistry = {version: '2.1.0', items: []}
standard.storageModel = {version: '2.1.0', items: []}
standard.widgetRegistry = {version: '2.1.0', items: []}
standard.navigationRegistry = {version: '2.1.0', items: []}
standard.uiContributions = {version: '2.1.0', items: []}
standard.eventBus = {version: '2.1.0', items: []}
standard.capabilityDiscovery = {version: '2.1.0', supportsBackend: false, supportsWidgets: false}
standard.permissionModel = {version: '2.1.0', categories: {data: standard.permissions}}
standard.versioning = {version: '2.1.0', moduleVersion: version, standardVersion: '2.1.0', manifestVersion: '2.1.0'}
standard.compatibilityMatrix = {version: '2.1.0', moduleStandardVersion: '^2.1.0', runtimeVersion: '^1.0.0', platforms: ['ios', 'android', 'web']}
standard.marketplace = {...standard.marketplace, version: '2.1.0', repository: 'modula-mod/modula-vault-formatting', backendMode: 'greenfield-native', aiSupport: false, downloads: 0}
standard.engineReadiness = {version: '2.1.0', engines: ['declarative-ui', 'functions']}

const greenfield = {
  manifestVersion: 2, moduleId: id, name: 'Vault Formatting', description: 'Backend-free declarative formatting plugin for Vault Notes.', version, standardVersion: '2.1.0', sectionVersions: createDefaultModuleSectionVersions('2.1.0'),
  publisher: {publisherId: 'modula', displayName: 'Modula', website: 'https://modula.digital'},
  source: {provider: 'github', repository: 'modula-mod/modula-vault-formatting', commit: sourceCommit, manifestPath: 'module.manifest.json', releaseTag: `vault-formatting-v${version}`, releaseAssetName: `modula-vault-formatting-${version}.tgz`},
  license: {status: 'firstParty', evidenceIds: ['LICENSE', 'README.md']}, trust: {requestedLevel: 'firstParty'},
  compatibility: {minimumGreenfieldVersion: '0.1.0', minimumModulaHostVersion: '0.1.0', protocolVersions: ['greenfield.v1'], platforms: ['ios', 'android', 'web']},
  permissions: [{permission: 'notes.editor.contribute', reason: 'Register declared local formatting commands.', risk: 'low'}, {permission: 'notes.actions.contribute', reason: 'Register the copy-as-Markdown action.', risk: 'low'}],
  dependencies: [{moduleId: targetId, versionRange: '>=1.2.0 <2.0.0', optional: false, reason: 'Vault Formatting extends Vault Notes.'}],
  contributions: {functions: functions().map(item => ({id: `${item.id}.registration`, title: item.title, functionId: item.id, mode: 'localDeclarative', inputSchemaRef: 'schemas/formatting-input.schema.json', outputSchemaRef: 'schemas/formatting-output.schema.json', executionRequired: true}))},
  integrity: {manifestSha256: '', releaseSha256: '0'.repeat(64)}, extensionProduct: extensionProduct(),
}
greenfield.integrity.manifestSha256 = manifestChecksum({...greenfield, integrity: {...greenfield.integrity, manifestSha256: ''}})
writeJson('modula.module.json', standard)
writeJson('module.manifest.json', greenfield)

function functions() { return [fn('word-count', 'Word count'), fn('copy-markdown', 'Copy as Markdown'), fn('heading', 'Format heading'), fn('quote', 'Format quote'), fn('checklist', 'Format checklist')] }
function fn(key, title) { return {id: `${id}.function.${key}`, title, inputSchema: {type: 'object', required: ['text'], properties: {text: {type: 'string'}}}, outputSchema: {type: 'object', required: ['text'], properties: {text: {type: 'string'}, count: {type: 'number'}}}, permissions: ['notes.editor.contribute'], aiCallable: false, automationCallable: false, idempotent: true, sideEffects: [], timeoutMs: 1000, rateLimit: {windowSeconds: 60, maxCalls: 120}, audit: {event: 'extension.action.invoked', includeInput: false, includeOutput: false}, confirmationPolicy: {required: false, risk: 'low'}} }
function extensionProduct() {
  const target = point => `${targetId}.${point}`
  return {version, kind: 'plugin', targets: [{productId: targetId, versionRange: '>=1.2.0 <2.0.0', requiredCapabilities: ['notes.editor.contribute', 'notes.actions.contribute'], requiredExtensionPoints: [target('editor.command'), target('note.actions'), target('note.inspector')]}], extensionPoints: [], contributions: [
    contribution('word-count', 'Word count', 'record.decorator', target('note.inspector'), 'word-count'),
    contribution('copy-markdown', 'Copy as Markdown', 'menu.item', target('note.actions'), 'copy-markdown'),
    contribution('heading', 'Format heading', 'editor.command', target('editor.command'), 'heading'),
    contribution('quote', 'Format quote', 'editor.command', target('editor.command'), 'quote'),
    contribution('checklist', 'Format checklist', 'editor.command', target('editor.command'), 'checklist'),
  ], retention: {defaultMode: 'DELETE_DATA', supportsUserChoice: false, metadataNamespace: id}, graphPolicy: {maxDepth: 8, maxNodes: 128}}
}
function contribution(key, title, kind, extensionPoint, functionKey) { return {id: `${id}.contribution.${key}`, title, kind, extensionPoint, functionId: `${id}.function.${functionKey}`, requiredCapability: kind === 'menu.item' ? 'notes.actions.contribute' : 'notes.editor.contribute', availability: {platforms: ['ios', 'android', 'web'], requiresOnline: false, requiredCapabilities: []}, priority: 80} }
function replaceProduct(value, from, to) { return JSON.parse(JSON.stringify(value).split(from).join(to)) }
function writeJson(path, value) { writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`) }
