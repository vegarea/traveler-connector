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
    $auth_header = $request->get_header('Authorization');
    error_log('Auth Header recibido: ' . $auth_header);
    
    if (!$auth_header) {
        return new WP_Error('no_token', 'Token no proporcionado', array('status' => 401));
    }

    // Eliminar "Bearer " del token si está presente
    $jwt_token = str_replace('Bearer ', '', $auth_header);
    
    // Intentar decodificar el token JWT directamente
    $token_parts = explode('.', $jwt_token);
    if (count($token_parts) !== 3) {
        error_log('Token JWT inválido - formato incorrecto');
        return new WP_Error('invalid_token_format', 'Formato de token inválido', array('status' => 401));
    }

    try {
        $payload = json_decode(base64_decode($token_parts[1]), true);
        error_log('Payload del token: ' . print_r($payload, true));

        if (!$payload || !isset($payload['data']['user']['id'])) {
            error_log('Payload del token inválido o sin ID de usuario');
            return new WP_Error('invalid_token_payload', 'Payload del token inválido', array('status' => 401));
        }

        // Obtener el usuario por su ID de WordPress
        $user = get_user_by('id', $payload['data']['user']['id']);
        if (!$user) {
            error_log('Usuario no encontrado: ' . $payload['data']['user']['id']);
            return new WP_Error('user_not_found', 'Usuario no encontrado', array('status' => 404));
        }

        // Iniciar sesión del usuario
        wp_set_auth_cookie($user->ID, true);
        wp_set_current_user($user->ID);
        
        error_log('Usuario autenticado exitosamente: ' . $user->user_login);

        return array(
            'success' => true,
            'message' => 'Autenticación exitosa',
            'user' => array(
                'id' => $user->ID,
                'username' => $user->user_login,
                'email' => $user->user_email,
                'display_name' => $user->display_name
            )
        );
    } catch (Exception $e) {
        error_log('Error procesando token JWT: ' . $e->getMessage());
        return new WP_Error(
            'jwt_processing_error',
            'Error procesando el token JWT: ' . $e->getMessage(),
            array('status' => 401)
        );
    }
}

// Agregar mensaje de debug
add_action('init', function() {
    if (is_user_logged_in()) {
        error_log('Usuario actual: ' . wp_get_current_user()->user_login);
    } else {
        error_log('No hay usuario autenticado');
    }
});

// Agregar logs para debugging de JWT
add_action('rest_api_init', function() {
    error_log('Endpoints REST API inicializados');
    error_log('URL base de la API: ' . get_rest_url());
});