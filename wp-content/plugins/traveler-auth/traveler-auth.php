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

// Agregar menú de configuración
add_action('admin_menu', function() {
    add_options_page(
        'Traveler Auth',
        'Traveler Auth',
        'manage_options',
        'traveler-auth',
        'traveler_auth_settings_page'
    );
});

// Página de configuración
function traveler_auth_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    if (isset($_POST['traveler_auth_app_url'])) {
        update_option('traveler_auth_app_url', sanitize_text_field($_POST['traveler_auth_app_url']));
        echo '<div class="notice notice-success"><p>Configuración guardada.</p></div>';
    }

    $app_url = get_option('traveler_auth_app_url', '');
    ?>
    <div class="wrap">
        <h1>Configuración de Traveler Auth</h1>
        <form method="post">
            <table class="form-table">
                <tr>
                    <th scope="row">URL de la Aplicación</th>
                    <td>
                        <input type="url" name="traveler_auth_app_url" value="<?php echo esc_attr($app_url); ?>" class="regular-text">
                        <p class="description">URL base de tu aplicación Traveler (ej: https://app.traveler.com)</p>
                    </td>
                </tr>
            </table>
            <?php submit_button('Guardar Cambios'); ?>
        </form>
    </div>
    <?php
}

// Interceptar login y redirigir
add_filter('login_redirect', function($redirect_to, $requested_redirect_to, $user) {
    if (!is_wp_error($user)) {
        try {
            // Obtener la URL de la app
            $app_url = get_option('traveler_auth_app_url');
            if (empty($app_url)) {
                error_log('Traveler Auth: URL de la aplicación no configurada');
                return $redirect_to;
            }

            // Generar token JWT usando el plugin JWT Authentication
            $token = generate_jwt_token($user);
            if (empty($token)) {
                error_log('Traveler Auth: No se pudo generar el token JWT');
                return $redirect_to;
            }

            // Construir URL de redirección con el token
            $auth_url = trailingslashit($app_url) . 'auth/wordpress/callback?token=' . urlencode($token);
            
            error_log('Traveler Auth: Redirigiendo a ' . $auth_url);
            return $auth_url;
        } catch (Exception $e) {
            error_log('Traveler Auth Error: ' . $e->getMessage());
            return $redirect_to;
        }
    }
    return $redirect_to;
}, 99, 3);

// Función auxiliar para generar token JWT
function generate_jwt_token($user) {
    // Verificar que el plugin JWT Authentication está activo
    if (!class_exists('JWT_AUTH_PUBLIC')) {
        error_log('Traveler Auth: Plugin JWT Authentication no está instalado');
        return null;
    }

    try {
        // Generar token JWT usando el plugin JWT Authentication
        $jwt_auth = new JWT_AUTH_PUBLIC('jwt-auth', '1.0.0');
        $token_response = $jwt_auth->generate_token([
            'username' => $user->user_login,
            'password' => '' // No necesitamos la contraseña aquí
        ]);

        if (is_wp_error($token_response)) {
            error_log('Traveler Auth: Error generando token JWT - ' . $token_response->get_error_message());
            return null;
        }

        return $token_response->data->token;
    } catch (Exception $e) {
        error_log('Traveler Auth Error: ' . $e->getMessage());
        return null;
    }
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