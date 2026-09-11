# Deploy Vercel — HUP Governança

Site estático (HTML + CSS + JS vanilla). Padrão BuildV: publica-se a **pasta estática**,
sem Next.js/React.

## Publicar

**Opção A — importar o repositório**
1. Vercel > **Add New > Project** > importe o repo `hup-site`.
2. **Root Directory:** `deploy-vercel`
3. **Framework Preset:** `Other` (static). Build Command: vazio. Output: `.`
4. Deploy.

**Opção B — CLI**
```bash
cd deploy-vercel
vercel --prod
```

## Conteúdo
- `index.html` — home (raiz do domínio).
- `privacidade.html` — política de privacidade (LGPD).
- `assets/` — css, js, imagens `.webp`, logos.
- `vercel.json` — `cleanUrls`, cache imutável em `/assets/*`, headers de segurança.

## Pendências
Número real de WhatsApp já configurado (`5511993353728`). IDs de tag (GTM/GA4/Pixel)
não instalados: ver o report final / `state.json`.
