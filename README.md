# Vault Formatting

`digital.modula.vault-notes.formatting` is a backend-free reference plugin for Vault Notes. It proves that a lighter plugin and a backend-backed add-on use the same extension fabric without becoming the same product kind.

Canonical MPS source: `modula.product.json` (1.0-RC). Published ID stays `digital.modula.vault-notes.formatting`. Backend, database, and network remain none.

The plugin contributes only product-owned declarative editor commands, a note action, and a word-count decorator. The generic host resolves them from the verified frontend artifact; `modula-latest` contains no Formatting-specific UI branch. It does not receive database, network, delete, or export capabilities.

Run `pnpm frontend:build`, `pnpm verify`, and `pnpm mps verify /path/to/modula-vault-formatting` before release. Version 0.3.0 is a new release line and does not mutate immutable 0.2.0.
