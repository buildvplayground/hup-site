# Deploy Vercel — HUP Governança

Site estático (HTML + CSS + JS vanilla). Padrão BuildV: publica-se a pasta estática.

## Publicar
**A — importar o repo:** Vercel > Add New > Project > importe `hup-site`.
Root Directory: `deploy-vercel` · Framework Preset: `Other` (static) · Build Command: vazio.

**B — CLI:** `cd deploy-vercel && vercel --prod`

## Conteúdo
`index.html` (home) · `privacidade.html` (LGPD) · `assets/` (css/js/webp/logos) ·
`vercel.json` (cleanUrls, cache imutável em `/assets/*`, headers de segurança).

WhatsApp real já configurado (`5511993353728`). IDs de tag: ver report / `state.json`.
