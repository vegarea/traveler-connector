const createAuthHeader = (username: string, token: string) => {
  return `Basic ${btoa(`${username}:${token}`)}`;
};

export const getJWTTokenWithAdminCredentials = async (wpUrl: string, adminUsername: string, adminToken: string) => {
  console.log('Obteniendo token JWT usando credenciales de admin...');
  try {
    console.log('URL:', wpUrl);
    console.log('Usuario admin que solicita token:', adminUsername);
    
    const response = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: adminUsername,
        password: adminToken
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error en la respuesta:', response.status, errorData);
      throw new Error(errorData.message || `Error al obtener token JWT: ${response.status}`);
    }

    const data = await response.json();
    console.log('Token JWT obtenido exitosamente para admin');
    console.log('Respuesta completa:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error al obtener token JWT:', error);
    throw error;
  }
};

export const getJWTToken = async (wpUrl: string, adminUsername: string, adminToken: string, userLogin: string, userPassword: string) => {
  console.log('Obteniendo token JWT para usuario usando credenciales de admin...');
  try {
    console.log('URL:', wpUrl);
    console.log('Usuario admin que autoriza:', adminUsername);
    console.log('Usuario que intenta login:', userLogin);
    
    const response = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': createAuthHeader(adminUsername, adminToken)
      },
      body: JSON.stringify({
        username: userLogin,
        password: userPassword
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error en la respuesta:', response.status, errorData);
      throw new Error(errorData.message || `Error al obtener token JWT: ${response.status}`);
    }

    const data = await response.json();
    console.log('Token JWT obtenido exitosamente para usuario:', userLogin);
    console.log('Respuesta completa:', JSON.stringify(data, null, 2));
    
    // Guardar el token y la información del usuario en localStorage
    localStorage.setItem('wp_token', data.token);
    localStorage.setItem('wp_user_email', data.user_email);
    localStorage.setItem('wp_user_nicename', data.user_nicename);
    localStorage.setItem('wp_user_display_name', data.user_display_name);
    
    return data;
  } catch (error) {
    console.error('Error al obtener token JWT:', error);
    throw error;
  }
};

export const validateJWTToken = async (wpUrl: string, token: string) => {
  console.log('Validando token JWT...');
  try {
    console.log('URL de validación:', `${wpUrl}/wp-json/jwt-auth/v1/token/validate`);
    console.log('Token a validar:', token.substring(0, 20) + '...');
    
    const response = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const responseText = await response.text();
    console.log('Respuesta completa de validación:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error al parsear respuesta:', e);
      throw new Error('Respuesta de validación inválida');
    }

    if (!response.ok) {
      console.error('Error al validar token:', response.status, data);
      throw new Error(data.message || `Error al validar token JWT: ${response.status}`);
    }

    console.log('Token JWT validado exitosamente');
    console.log('Datos de validación:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error al validar token JWT:', error);
    throw error;
  }
};