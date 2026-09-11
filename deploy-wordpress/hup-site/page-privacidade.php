<?php /* Template Name: Privacidade HUP */ ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Política de Privacidade · HUP</title>
<meta name="description" content="Política de Privacidade da HUP Governança de Investimentos Imobiliários. Como coletamos, usamos e protegemos seus dados, em conformidade com a LGPD.">
<meta name="robots" content="index,follow">
<meta name="theme-color" content="#FFFFFF">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&family=Krub:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/css/styles.css">
<?php wp_head(); ?>
</head>
<body>
<header class="site-header" data-solid="true" style="position:fixed">
  <div class="container bar">
    <a class="brand" href="<?php echo esc_url( home_url('/') ); ?>" aria-label="HUP, página inicial">
      <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/img/logo-hup-ink.png" alt="HUP">
      <span class="tag">Governança de<br>investimentos imobiliários</span>
    </a>
    <a class="btn ghost" href="<?php echo esc_url( home_url('/') ); ?>"><span>Voltar ao site</span></a>
  </div>
</header>

<main class="legal">
  <div class="container">
    <div class="head">
      <p class="eyebrow" style="opacity:1"><span class="rule" style="transform:scaleX(1)"></span>Documento legal</p>
      <h1>Política de Privacidade</h1>
      <p class="updated">Última atualização: setembro de 2026</p>
    </div>
    <div class="body">
      <p>A HUP Governança de Investimentos Imobiliários respeita a sua privacidade e trata os dados pessoais em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados, LGPD). Este documento explica quais dados coletamos, como os usamos e quais são os seus direitos.</p>

      <h2>1. Dados que coletamos</h2>
      <p>Coletamos apenas os dados necessários para responder ao seu contato e prestar nossos serviços:</p>
      <ul>
        <li>Dados de identificação e contato que você informa voluntariamente ao falar conosco (nome, telefone, e-mail).</li>
        <li>Informações sobre o seu projeto ou obra fornecidas durante a conversa comercial.</li>
        <li>Dados de navegação coletados por cookies (páginas visitadas, origem do acesso), somente mediante o seu consentimento.</li>
      </ul>

      <h2>2. Como usamos os dados</h2>
      <ul>
        <li>Responder a solicitações de orçamento e contato comercial.</li>
        <li>Elaborar propostas e conduzir a governança do seu investimento imobiliário.</li>
        <li>Entender o desempenho do site e melhorar a sua experiência (analytics), quando autorizado.</li>
      </ul>

      <h2>3. Cookies</h2>
      <p>Utilizamos cookies essenciais, necessários ao funcionamento do site, e cookies de análise, que dependem do seu consentimento. Você controla a sua escolha pelo banner de cookies e pode revê-la a qualquer momento limpando os dados do site no seu navegador.</p>

      <h2>4. Compartilhamento</h2>
      <p>Não vendemos seus dados. Podemos compartilhá-los apenas com prestadores que viabilizam a operação do site e do atendimento (por exemplo, plataformas de comunicação e analytics), sempre limitados à finalidade descrita nesta política.</p>

      <h2>5. Seus direitos</h2>
      <p>Nos termos da LGPD, você pode solicitar a confirmação do tratamento, o acesso, a correção, a anonimização, a portabilidade ou a eliminação dos seus dados, além de revogar o consentimento. Para exercer esses direitos, entre em contato pelos canais abaixo.</p>

      <h2>6. Segurança e retenção</h2>
      <p>Adotamos medidas técnicas e administrativas para proteger os dados contra acesso não autorizado. Mantemos os dados apenas pelo tempo necessário às finalidades informadas ou às obrigações legais aplicáveis.</p>

      <h2>7. Contato do controlador</h2>
      <p>HUP Governança de Investimentos Imobiliários<br>
      WhatsApp comercial: <a href="tel:+5511993353728">+55 11 99335&#8209;3728</a><br>
      Site: <a href="https://www.hupxp.com" target="_blank" rel="noopener">www.hupxp.com</a></p>
    </div>
  </div>
</main>

<footer class="site-footer" data-bg="dark">
  <div class="container">
    <div class="foot-bottom" style="border-top:0;margin-top:0">
      <span>© <span data-year>2026</span> HUP Governança de Investimentos Imobiliários</span>
      <a href="<?php echo esc_url( home_url('/') ); ?>">Voltar ao início</a>
    </div>
  </div>
</footer>
<script>document.querySelectorAll('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear();});</script>
<?php wp_footer(); ?>
</body>
</html>
