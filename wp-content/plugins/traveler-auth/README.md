# Traveler Auth Plugin

Este plugin maneja la integración entre WordPress y la aplicación Traveler, proporcionando:

1. Interceptación de login exitoso
2. Generación de token JWT
3. Redirección a la aplicación Traveler con el token

## Requisitos

- WordPress 5.0+
- Plugin JWT Authentication instalado y configurado
- URL de la aplicación Traveler configurada

## Instalación

1. Sube la carpeta `traveler-auth` al directorio `/wp-content/plugins/`
2. Activa el plugin desde el panel de WordPress
3. Configura la URL de tu aplicación en Ajustes > Traveler Auth

## Funcionamiento

El plugin intercepta cualquier login exitoso en WordPress (incluyendo login social) y:

1. Genera un token JWT usando el plugin JWT Authentication
2. Redirige al usuario a la aplicación Traveler con el token
3. La aplicación Traveler valida el token y completa el proceso de login

## Configuración

En el panel de WordPress, ve a Ajustes > Traveler Auth y configura:

- URL de la Aplicación: La URL base de tu aplicación Traveler

## Solución de problemas

Revisa los logs de error de WordPress si:

- La redirección no funciona
- No se genera el token JWT
- Hay problemas de CORS