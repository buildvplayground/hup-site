# Deploy WordPress — HUP Governança

Tema single-page (`hup-site/`) que reproduz o site da HUP no WordPress.

## Instalação
1. Compacte `hup-site/` em `hup-site.zip`.
2. Aparência > Temas > Adicionar novo > Enviar tema > envie o zip > **Ative**.
3. A home já mostra a página (o tema usa `index.php` como front page).

## Página de Privacidade (LGPD)
1. Páginas > Adicionar nova, título "Privacidade".
2. Atributos da página > Modelo > **"Privacidade HUP"**.
3. Publique com slug `privacidade` (o rodapé aponta para `/privacidade/`).

## Observações
- Fontes (Google Fonts) e assets são carregados direto do tema.
- `wp_head()`/`wp_footer()` estão nos templates: plugins de analytics/LGPD/cache funcionam.
  O banner de cookies emite `consent_update` no `dataLayer`.
- CTA abre o WhatsApp comercial; não há formulário.
