<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
add_action('after_setup_theme',function(){add_theme_support('title-tag');add_theme_support('post-thumbnails');add_theme_support('html5',array('style','script'));});
add_filter('pre_get_document_title',function($t){ if(is_front_page()||is_home()){return 'HUP � Governan�a de Investimentos Imobili�rios';} return $t; });

/* BuildV: GTM (GTM-534KFN2M) */
add_action('wp_head', function () { ?>
<!-- BuildV: GTM -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-534KFN2M');</script>
<!-- /BuildV: GTM -->
<?php }, 1);
add_action('wp_body_open', function () { ?>
<!-- BuildV: GTM (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-534KFN2M"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- /BuildV: GTM (noscript) -->
<?php });
