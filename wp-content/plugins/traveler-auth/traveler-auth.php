<?php
/*
Plugin Name: Traveler Auth
Plugin URI: https://traveler.com
Description: Maneja la autenticación entre WordPress y la aplicación Traveler
Version: 1.0
Author: Lovable
*/

// Evitar acceso directo al archivo
if (!defined('ABSPATH')) {
    exit;
}

// Agregar endpoint para autenticación
add_action('rest_api_init', function () {
    register_rest_route('traveler-auth/v1', '/login', array(
        'methods' => 'POST',
        'callback' => 'traveler_handle_login',
        'permission_callback' => '__return_true'
    ));
});

function traveler_handle_login($request) {
    $jwt_token = $request->get_header('Authorization');
    
    if (!$jwt_token) {
        return new WP_Error('no_token', 'Token no proporcionado', array('status' => 401));
    }

    // Eliminar "Bearer " del token si está presente
    $jwt_token = str_replace('Bearer ', '', $jwt_token);
    
    // Validar el token JWT usando el endpoint de validación
    $validation_response = wp_remote_post(get_site_url() . '/wp-json/jwt-auth/v1/token/validate', array(
        'headers' => array(
            'Authorization' => 'Bearer ' . $jwt_token
        )
    ));

    if (is_wp_error($validation_response)) {
        return new WP_Error('token_validation_failed', 'Error al validar el token', array('status' => 401));
    }

    $response_code = wp_remote_retrieve_response_code($validation_response);
    if ($response_code !== 200) {
        return new WP_Error('invalid_token', 'Token inválido', array('status' => 401));
    }

    // Decodificar el token JWT (asumiendo que es un token válido)
    $token_parts = explode('.', $jwt_token);
    $payload = json_decode(base64_decode($token_parts[1]), true);

    // Obtener el usuario por su ID de WordPress
    $user = get_user_by('id', $payload['data']['user']['id']);
    
    if (!$user) {
        return new WP_Error('user_not_found', 'Usuario no encontrado', array('status' => 404));
    }

    // Iniciar sesión del usuario
    wp_set_auth_cookie($user->ID, true);
    wp_set_current_user($user->ID);
    
    // Registrar el inicio de sesión
    error_log('Usuario ' . $user->user_login . ' autenticado vía Traveler Auth');

    return array(
        'success' => true,
        'message' => 'Autenticación exitosa',
        'user' => array(
            'id' => $user->ID,
            'username' => $user->user_login,
            'email' => $user->user_email
        )
    );
}

// Agregar mensaje de debug
add_action('init', function() {
    if (is_user_logged_in()) {
        error_log('Usuario actual: ' . wp_get_current_user()->user_login);
    } else {
        error_log('No hay usuario autenticado');
    }
});