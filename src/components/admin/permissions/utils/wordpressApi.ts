export const createAuthHeader = (username: string, token: string) => {
  return `Basic ${btoa(`${username}:${token}`)}`;
};

export const getJWTToken = async (wpUrl: string, username: string, password: string) => {
  console.log('Obteniendo token JWT...');
  try {
    const response = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
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
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Origin': window.location.origin
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
    const response = await fetch(`${wpUrl}/wp-json/traveler-auth/v1/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      }
    });

    // Leemos la respuesta una sola vez y la almacenamos
    const data = await response.json();
    console.log('Respuesta del login:', data);

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