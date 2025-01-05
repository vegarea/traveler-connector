export const createAuthHeader = (username: string, token: string) => {
  return `Basic ${btoa(`${username}:${token}`)}`;
};

export const getJWTToken = async (wpUrl: string, username: string, password: string) => {
  console.log('Obteniendo token JWT...');
  try {
    const response = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error al obtener token JWT:', data);
      throw new Error(data.message || 'Error al obtener token JWT');
    }

    console.log('Token JWT obtenido exitosamente:', data);
    return data;
  } catch (error) {
    console.error('Error en la solicitud JWT:', error);
    throw error;
  }
};

export const validateJWTToken = async (wpUrl: string, token: string) => {
  console.log('Validando token JWT...');
  try {
    const response = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error al validar token JWT:', data);
      throw new Error(data.message || 'Token JWT inválido');
    }

    console.log('Token JWT validado exitosamente:', data);
    return data;
  } catch (error) {
    console.error('Error en la validación JWT:', error);
    throw error;
  }
};

export const loginToWordPress = async (wpUrl: string, jwtToken: string) => {
  console.log('Iniciando login en WordPress usando plugin Traveler Auth...');
  console.log('URL:', wpUrl);
  console.log('Token JWT:', jwtToken);
  
  try {
    // Primero validamos el token JWT antes de intentar el login
    await validateJWTToken(wpUrl, jwtToken);
    
    const response = await fetch(`${wpUrl}/wp-json/traveler-auth/v1/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log('Respuesta completa del login:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText
    });

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error al parsear respuesta:', e);
      throw new Error(`Respuesta inválida del servidor: ${responseText}`);
    }

    if (!response.ok) {
      console.error('Error en login de WordPress:', data);
      throw new Error(data.message || 'Error al iniciar sesión en WordPress');
    }

    console.log('Login en WordPress exitoso:', data);
    return data;
  } catch (error) {
    console.error('Error en la solicitud de login:', error);
    throw error;
  }
};

export const checkEndpoint = async (endpoint: string, wpUrl: string, wpUsername: string, wpToken: string) => {
  console.log(`Verificando endpoint: ${endpoint}`);
  try {
    // Primero obtenemos un token JWT usando las credenciales
    const jwtResponse = await getJWTToken(wpUrl, wpUsername, wpToken);
    console.log('Token JWT obtenido para endpoint:', endpoint);
    
    // Usamos el token JWT para la verificación del endpoint
    const response = await fetch(`${wpUrl}/wp-json${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${jwtResponse.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Respuesta del endpoint ${endpoint}:`, {
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error(`Error en endpoint ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
    }

    return response.ok;
  } catch (error) {
    console.error(`Error al verificar endpoint ${endpoint}:`, error);
    return false;
  }
};

export const fetchUserStructure = async (wpUrl: string, wpUsername: string, wpToken: string) => {
  try {
    // Primero obtenemos un token JWT usando las credenciales
    const jwtResponse = await getJWTToken(wpUrl, wpUsername, wpToken);
    console.log('Token JWT obtenido para estructura de usuario');
    
    const response = await fetch(`${wpUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        'Authorization': `Bearer ${jwtResponse.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Error al obtener estructura de usuario:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error('No se pudo obtener la estructura de usuarios');
    }

    const data = await response.json();
    console.log('Estructura de usuario obtenida:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener estructura de usuario:', error);
    throw error;
  }
};