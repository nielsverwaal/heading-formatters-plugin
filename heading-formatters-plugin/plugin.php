<?php

/**
 * Plugin Name: Heading Formatters
 * Description: Voeg inline kleur en onderstreping toe aan headings in Gutenberg, met je eigen kleurpalette.
 * Version: 1.0
 * Author: Fris & Nieuw
 */

add_action('enqueue_block_editor_assets', function () {
    $handle = 'heading-formatters-editor';

    // 1. palette.json inladen vanuit het child theme
    $palette_path = get_stylesheet_directory() . '/palette.json';
    $palette_json = file_exists($palette_path) ? file_get_contents($palette_path) : '{}';

    wp_enqueue_script(
        $handle,
        plugin_dir_url(__FILE__) . 'editor.js',
        [
            'wp-blocks',
            'wp-dom-ready',
            'wp-edit-post',
            'wp-rich-text',
            'wp-element',
            'wp-components',
            'wp-i18n',
            'wp-data',
            'wp-block-editor',
        ],
        filemtime(plugin_dir_path(__FILE__) . 'editor.js'),
        true
    );
    // ✅ 2. editor.css toevoegen
    wp_enqueue_style(
        'heading-formatters-editor-style',
        plugin_dir_url(__FILE__) . 'editor.css',
        [],
        filemtime(plugin_dir_path(__FILE__) . 'editor.css')
    );
    // 3. Injecteer het palette als JS object
    wp_add_inline_script($handle, 'window.headingFormattersPalette = ' . $palette_json . ';', 'before');
});
