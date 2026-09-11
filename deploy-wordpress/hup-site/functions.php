<?php
/**
 * HUP Governança — funções do tema.
 * O CSS e o JS são carregados diretamente no index.php / page-privacidade.php
 * (tags <link>/<script> com get_template_directory_uri), então aqui só declaramos
 * os suportes de tema. wp_head()/wp_footer() já estão presentes nos templates para
 * compatibilidade com plugins (analytics, LGPD, cache).
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'after_setup_theme', function () {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', array( 'style', 'script' ) );
    add_theme_support( 'automatic-feed-links' );
} );

/**
 * Garante que o <title> do WordPress não sobrescreva o título fixo do tema na home.
 */
add_filter( 'pre_get_document_title', function ( $title ) {
    if ( is_front_page() || is_home() ) {
        return 'HUP · Governança de Investimentos Imobiliários';
    }
    return $title;
} );
