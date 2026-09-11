# HUP — Governança de Investimentos Imobiliários

Site institucional single-page. Setor: governança / owner's representative imobiliário
(não é construtora nem escritório de arquitetura). Fonte do material: Google Drive
(deck institucional 2026 + logo). Cliente: HUP (www.hupxp.com).

## Progresso (fonte de verdade para retomar)

- [x] 1. Extrair do Drive (rclone `gdrive:`, deck + logo baixados para `_raw/`)
- [x] 2. Scaffold de pastas + classificação
- [~] 2b. Repo GitHub `dev-buildv/hup-site` privado (ver report / etapa em execução)
- [x] 3. Design system (paleta amostrada pixel a pixel do deck; ver `design-system/tokens.md`)
- [x] 4. Copy estruturada (extraída do deck + planilha de aprofundamento; sem travessão)
- [x] 5. Front-end (`Site/`) + revisão adversarial (overflow 0, sem erro de JS, WCAG)
- [x] 6. Imagens tratadas (`.webp`, 15 arquivos, ~1,6 MB) + responsividade auditada
- [x] 7. Módulos LGPD (banner de cookies + `consent_update` no dataLayer + Política de Privacidade)
- [ ] 7b. Tags (GTM/GA4/Pixel) — pendente de IDs do cliente
- [x] 8. Deploy preparado: `deploy-vercel/` (estático) + `deploy-wordpress/hup-site/` (tema)
- [ ] 9. Publicação em produção (gate humano: importar no Vercel / instalar tema + domínio)

## Identidade (derivada da marca real)

- **Paleta:** ink `#08120F`, jade `#3ED1B7` / `#2A8A79`, painel `#1A2923`, texto `#F3F7F5`.
- **Tipografia:** Fraunces (display serif) + Hanken Grotesk (corpo) + IBM Plex Mono (dados/rótulos).
- **Assinatura:** filete jade que desenha + índice mono 01–04 (a "régua de controle").
- **WhatsApp real:** +55 11 99335-3728 (`5511993353728`) — já configurado no site.

## Estrutura de seções (cada uma ~1 viewport)

hero (foto real) → posicionamento → método (4 pilares) → break foto → soluções (4 linhas)
→ impacto/números → governança compartilhada (split) → casos (tabela) → tecnologia (3 telas)
→ portfólio (grade 3/2/1 + lightbox) → liderança → clientes (marquee) → CTA (3 passos) → footer.

## Material aproveitado

- Fotos reais extraídas do deck (`HUP-Institucional-2026.pdf`): hero, fundação, 4 obras de
  portfólio, interiores, 3 telas do app de gestão.
- Logo recortado do JPG social para PNG transparente (branco + variante jade).
- Copy 100% baseada no deck e na planilha de aprofundamento. Nenhum dado inventado.

## Entregável versionado

`deploy-vercel/`, `deploy-wordpress/`, `PROJETO.md`, `state.json`, `.gitignore`.
`Site/`, `_raw/`, `imagens/`, `design-system/` ficam locais (ver `.gitignore`).
