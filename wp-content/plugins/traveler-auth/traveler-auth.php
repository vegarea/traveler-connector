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
        'permission_callback' => function() {
            return true; // Permitimos el acceso al endpoint para poder validar el token
        }
    ));
});

function traveler_handle_login($request) {
    $auth_header = $request->get_header('Authorization');
    
    if (!$auth_header) {
        return new WP_Error('no_token', 'Token no proporcionado', array('status' => 401));
    }

    // Eliminar "Bearer " del token si está presente
    $jwt_token = str_replace('Bearer ', '', $auth_header);
    
    // Validar el token JWT usando el endpoint de validación
    $validation_url = get_rest_url(null, 'jwt-auth/v1/token/validate');
    $validation_response = wp_remote_post($validation_url, array(
        'headers' => array(
            'Authorization' => 'Bearer ' . $jwt_token
        )
    ));

    if (is_wp_error($validation_response)) {
        error_log('Error validando token JWT: ' . $validation_response->get_error_message());
        return new WP_Error(
            'token_validation_failed', 
            'Error al validar el token: ' . $validation_response->get_error_message(), 
            array('status' => 401)
        );
    }

    $response_code = wp_remote_retrieve_response_code($validation_response);
    $response_body = json_decode(wp_remote_retrieve_body($validation_response), true);
    
    error_log('Respuesta de validación JWT: ' . print_r($response_body, true));

    if ($response_code !== 200) {
        return new WP_Error(
            'invalid_token', 
            'Token inválido: ' . ($response_body['message'] ?? 'Error desconocido'), 
            array('status' => 401)
        );
    }

    // Decodificar el token JWT
    $token_parts = explode('.', $jwt_token);
    if (count($token_parts) !== 3) {
        return new WP_Error('invalid_token_format', 'Formato de token inválido', array('status' => 401));
    }

    $payload = json_decode(base64_decode($token_parts[1]), true);
    if (!$payload || !isset($payload['data']['user']['id'])) {
        return new WP_Error('invalid_token_payload', 'Payload del token inválido', array('status' => 401));
    }

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
            'email' => $user->user_email,
            'display_name' => $user->display_name
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

// Agregar logs para debugging de JWT
add_action('rest_api_init', function() {
    error_log('JWT_AUTH_SECRET_KEY definida: ' . (defined('JWT_AUTH_SECRET_KEY') ? 'Sí' : 'No'));
    error_log('JWT_AUTH_CORS_ENABLE definida: ' . (defined('JWT_AUTH_CORS_ENABLE') ? 'Sí' : 'No'));
});