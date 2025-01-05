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
            return true; // Permitir acceso público al endpoint
        }
    ));
});

function traveler_handle_login($request) {
    error_log('Iniciando proceso de login en Traveler Auth');
    
    // Obtener el token JWT del header
    $auth_header = $request->get_header('Authorization');
    if (!$auth_header || strpos($auth_header, 'Bearer ') !== 0) {
        error_log('Token no proporcionado o formato incorrecto');
        return new WP_Error(
            'no_token',
            'Token no proporcionado o formato incorrecto',
            array('status' => 401)
        );
    }

    // Extraer el token JWT
    $token = str_replace('Bearer ', '', $auth_header);
    error_log('Token recibido: ' . $token);

    // Verificar que la clave secreta JWT está configurada
    if (!defined('JWT_AUTH_SECRET_KEY')) {
        error_log('JWT_AUTH_SECRET_KEY no está definida en wp-config.php');
        return new WP_Error(
            'jwt_auth_bad_config',
            'JWT no está configurado correctamente',
            array('status' => 403)
        );
    }

    try {
        // Validar el token usando la biblioteca JWT
        $decoded_token = JWT::decode(
            $token,
            new Key(JWT_AUTH_SECRET_KEY, 'HS256')
        );
        
        error_log('Token decodificado: ' . print_r($decoded_token, true));

        // Verificar que el token contiene la información del usuario
        if (!isset($decoded_token->data->user->id)) {
            error_log('Token no contiene ID de usuario');
            return new WP_Error(
                'invalid_token',
                'Token inválido - no contiene ID de usuario',
                array('status' => 401)
            );
        }

        // Obtener el usuario por ID
        $user = get_user_by('id', $decoded_token->data->user->id);
        if (!$user) {
            error_log('Usuario no encontrado: ' . $decoded_token->data->user->id);
            return new WP_Error(
                'user_not_found',
                'Usuario no encontrado',
                array('status' => 404)
            );
        }

        // Iniciar sesión
        wp_set_current_user($user->ID);
        wp_set_auth_cookie($user->ID, true);

        error_log('Login exitoso para usuario: ' . $user->user_login);

        return array(
            'success' => true,
            'user_id' => $user->ID,
            'user_login' => $user->user_login,
            'user_email' => $user->user_email,
            'display_name' => $user->display_name
        );

    } catch (Exception $e) {
        error_log('Error procesando token JWT: ' . $e->getMessage());
        return new WP_Error(
            'invalid_token',
            'Token inválido: ' . $e->getMessage(),
            array('status' => 401)
        );
    }
}

// Asegurarnos de que la biblioteca JWT está disponible
if (!class_exists('JWT')) {
    require_once(plugin_dir_path(__FILE__) . 'vendor/firebase/php-jwt/src/JWT.php');
    require_once(plugin_dir_path(__FILE__) . 'vendor/firebase/php-jwt/src/Key.php');
}

// Agregar headers CORS
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
        return $value;
    });
});

// Manejar preflight OPTIONS requests
add_action('init', function() {
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
        exit(0);
    }
});