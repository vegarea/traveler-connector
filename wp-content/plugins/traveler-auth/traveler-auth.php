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

// Crear tabla de logs al activar el plugin
register_activation_hook(__FILE__, function() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'traveler_auth_logs';
    
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        event_type varchar(50) NOT NULL,
        user_id bigint(20),
        user_email varchar(100),
        details text,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
});

// Función para registrar logs
function traveler_log_event($event_type, $user_id = null, $user_email = null, $details = '') {
    global $wpdb;
    $table_name = $wpdb->prefix . 'traveler_auth_logs';
    
    $wpdb->insert(
        $table_name,
        array(
            'event_type' => $event_type,
            'user_id' => $user_id,
            'user_email' => $user_email,
            'details' => $details
        )
    );
}

// Agregar menú de configuración
add_action('admin_menu', function() {
    add_menu_page(
        'Traveler Auth',
        'Traveler Auth',
        'manage_options',
        'traveler-auth',
        'traveler_auth_settings_page',
        'dashicons-admin-network'
    );

    add_submenu_page(
        'traveler-auth',
        'Logs',
        'Logs',
        'manage_options',
        'traveler-auth-logs',
        'traveler_auth_logs_page'
    );
});

// Página de logs
function traveler_auth_logs_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    global $wpdb;
    $table_name = $wpdb->prefix . 'traveler_auth_logs';
    $logs = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC LIMIT 100");

    ?>
    <div class="wrap">
        <h1>Traveler Auth - Logs</h1>
        <div class="notice notice-info">
            <p>Mostrando los últimos 100 eventos registrados.</p>
        </div>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Tipo de Evento</th>
                    <th>Usuario</th>
                    <th>Detalles</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($logs as $log): ?>
                <tr>
                    <td><?php echo esc_html(date('Y-m-d H:i:s', strtotime($log->created_at))); ?></td>
                    <td><?php echo esc_html($log->event_type); ?></td>
                    <td><?php echo $log->user_email ? esc_html($log->user_email) : 'N/A'; ?></td>
                    <td><?php echo esc_html($log->details); ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}

// Página de configuración
function traveler_auth_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    if (isset($_POST['traveler_auth_app_url'])) {
        $app_url = sanitize_text_field($_POST['traveler_auth_app_url']);
        update_option('traveler_auth_app_url', $app_url);
        
        traveler_log_event(
            'config_updated',
            get_current_user_id(),
            wp_get_current_user()->user_email,
            "URL de la aplicación actualizada a: $app_url"
        );
        
        echo '<div class="notice notice-success is-dismissible"><p>✅ Configuración guardada correctamente.</p></div>';
    }

    $app_url = get_option('traveler_auth_app_url', '');
    ?>
    <div class="wrap">
        <h1>Configuración de Traveler Auth</h1>
        
        <div class="card">
            <h2>Estado del Plugin</h2>
            <p>
                <strong>JWT Authentication:</strong>
                <?php 
                if (class_exists('JWT_AUTH_PUBLIC')) {
                    echo '<span style="color: green;">✅ Instalado y activo</span>';
                } else {
                    echo '<span style="color: red;">❌ No instalado</span>';
                }
                ?>
            </p>
            <p>
                <strong>URL actual configurada:</strong>
                <?php 
                if ($app_url) {
                    echo '<span style="color: green;">✅ ' . esc_html($app_url) . '</span>';
                } else {
                    echo '<span style="color: red;">❌ No configurada</span>';
                }
                ?>
            </p>
        </div>

        <form method="post" style="margin-top: 20px;">
            <table class="form-table">
                <tr>
                    <th scope="row">URL de la Aplicación</th>
                    <td>
                        <input 
                            type="url" 
                            name="traveler_auth_app_url" 
                            value="<?php echo esc_attr($app_url); ?>" 
                            class="regular-text"
                            required
                        >
                        <p class="description">URL base de tu aplicación Traveler (ej: https://app.traveler.com)</p>
                    </td>
                </tr>
            </table>
            <?php submit_button('Guardar Cambios', 'primary', 'submit', true, ['id' => 'submit-btn']); ?>
        </form>

        <div class="card" style="margin-top: 20px;">
            <h2>Información de Depuración</h2>
            <p>La URL de callback será: <code><?php echo esc_html($app_url . '/auth/wordpress/callback'); ?></code></p>
            <p>Esta URL recibirá el token JWT después de un login exitoso.</p>
        </div>
    </div>

    <style>
    .card {
        background: white;
        border: 1px solid #ccd0d4;
        border-radius: 4px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 1px 1px rgba(0,0,0,.04);
    }
    </style>
    <?php
}

// Interceptar login y redirigir
add_filter('login_redirect', function($redirect_to, $requested_redirect_to, $user) {
    if (!is_wp_error($user)) {
        try {
            // Obtener la URL de la app
            $app_url = get_option('traveler_auth_app_url');
            if (empty($app_url)) {
                traveler_log_event(
                    'redirect_error',
                    $user->ID,
                    $user->user_email,
                    'URL de la aplicación no configurada'
                );
                return $redirect_to;
            }

            // Generar token JWT usando el plugin JWT Authentication
            $token = generate_jwt_token($user);
            if (empty($token)) {
                traveler_log_event(
                    'jwt_error',
                    $user->ID,
                    $user->user_email,
                    'No se pudo generar el token JWT'
                );
                return $redirect_to;
            }

            // Construir URL de redirección con el token
            $auth_url = trailingslashit($app_url) . 'auth/wordpress/callback?token=' . urlencode($token);
            
            traveler_log_event(
                'login_success',
                $user->ID,
                $user->user_email,
                'Redirigiendo a: ' . $auth_url
            );
            
            return $auth_url;
        } catch (Exception $e) {
            traveler_log_event(
                'error',
                $user ? $user->ID : null,
                $user ? $user->user_email : null,
                'Error: ' . $e->getMessage()
            );
            return $redirect_to;
        }
    }
    return $redirect_to;
}, 99, 3);

// Función auxiliar para generar token JWT
function generate_jwt_token($user) {
    if (!class_exists('JWT_AUTH_PUBLIC')) {
        traveler_log_event(
            'jwt_plugin_error',
            $user->ID,
            $user->user_email,
            'Plugin JWT Authentication no está instalado'
        );
        return null;
    }

    try {
        $jwt_auth = new JWT_AUTH_PUBLIC('jwt-auth', '1.0.0');
        $token_response = $jwt_auth->generate_token([
            'username' => $user->user_login,
            'password' => '' // No necesitamos la contraseña aquí
        ]);

        if (is_wp_error($token_response)) {
            traveler_log_event(
                'jwt_generation_error',
                $user->ID,
                $user->user_email,
                'Error generando token JWT: ' . $token_response->get_error_message()
            );
            return null;
        }

        traveler_log_event(
            'jwt_generated',
            $user->ID,
            $user->user_email,
            'Token JWT generado exitosamente'
        );

        return $token_response->data->token;
    } catch (Exception $e) {
        traveler_log_event(
            'jwt_exception',
            $user->ID,
            $user->user_email,
            'Error: ' . $e->getMessage()
        );
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