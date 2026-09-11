<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
add_action( 'after_setup_theme', function () {
    add_theme_support( 'title-tag' ); add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', array( 'style', 'script' ) ); add_theme_support( 'automatic-feed-links' );
} );
add_filter( 'pre_get_document_title', function ( $t ) {
    if ( is_front_page() || is_home() ) { return 'HUP · Governança de Investimentos Imobiliários'; } return $t;
} );
