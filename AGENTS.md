# Vault Formatting — agent instructions

- Product ID (published, immutable): `digital.modula.vault-notes.formatting`
- Kind: plugin
- Family: `digital.modula.vault` (member)
- MPS: 1.0 — canonical file `modula.product.json`
- Frontend: `host-contribution`
- Backend: **none**
- Database: **none**
- Network: **none**
- No Greenfield core special cases
- No secrets
- Product contribution UI belongs under `frontend/`; never add Formatting-specific rendering branches to `modula-latest`.
- Do not mutate `vault-formatting-v0.2.0` or earlier immutable tags.

Verify: `pnpm mps verify` from `modula-product-standard`. Public verify fails while the icon is a development placeholder.
