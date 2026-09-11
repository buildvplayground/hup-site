# Deploy WordPress — HUP Governança

Tema single-page (`hup-site/`) que reproduz o site da HUP dentro do WordPress.
HTML estático + CSS + JS vanilla empacotados como tema (padrão BuildV).

## Instalação

1. Compacte a pasta `hup-site/` em `hup-site.zip`.
2. No painel do WordPress: **Aparência > Temas > Adicionar novo > Enviar tema** e envie o zip.
3. **Ative** o tema "HUP Governança".
4. A home do site já mostra a página (o tema usa `index.php` como front page).

## Página de Privacidade (LGPD)

1. **Páginas > Adicionar nova**, título "Privacidade".
2. Em **Atributos da página > Modelo**, escolha **"Privacidade HUP"**.
3. Publique com o slug `privacidade` (o rodapé do site já aponta para `/privacidade/`).

## Observações

- As fontes (Google Fonts) e os assets (`assets/css`, `assets/js`, `assets/img`) são
  carregados direto do tema. Não é preciso plugin de página.
- `wp_head()` e `wp_footer()` estão nos templates: plugins de analytics/LGPD/cache
  funcionam normalmente. O banner de cookies do próprio site emite `consent_update`
  no `dataLayer` para tags respeitarem a escolha do usuário.
- Número de WhatsApp e IDs de tag: ver o report final / `state.json` (pendências).
- Não há campos de formulário: o CTA abre o WhatsApp comercial da HUP.
