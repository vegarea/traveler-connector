export const createAuthHeader = (username: string, token: string) => {
  return `Basic ${btoa(`${username}:${token}`)}`;
};

export const getJWTToken = async (wpUrl: string, username: string, password: string) => {
  console.log('Obteniendo token JWT...');
  try {
    console.log('Haciendo solicitud a:', `${wpUrl}/wp-json/jwt-auth/v1/token`);
    console.log('Usuario que intenta login:', username);
    
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error en respuesta JWT:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.message || 'Error al obtener token JWT');
    }

    const data = await response.json();
    console.log('Token JWT obtenido exitosamente');
    
    // Guardar el token y la información del usuario en localStorage
    localStorage.setItem('wp_token', data.token);
    localStorage.setItem('wp_user', JSON.stringify({
      username: data.user_nicename,
      display_name: data.user_display_name,
      email: data.user_email
    }));
    
    return data;
  } catch (error) {
    console.error('Error en la solicitud JWT:', error);
    throw error;
  }
};

export const validateJWTToken = async (wpUrl: string, token: string) => {
  console.log('Validando token JWT...');
  try {
    // Intentar recuperar el token del localStorage si no se proporciona
    const tokenToUse = token || localStorage.getItem('wp_token');
    
    if (!tokenToUse) {
      throw new Error('No hay token JWT disponible');
    }

    const response = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenToUse}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error al validar token JWT:', errorData);
      throw new Error(errorData.message || 'Token JWT inválido');
    }

    const data = await response.json();
    console.log('Token JWT validado exitosamente:', data);
    return data;
  } catch (error) {
    console.error('Error en la validación JWT:', error);
    throw error;
  }
};

export const checkEndpoint = async (endpoint: string, wpUrl: string, wpUsername: string, wpToken: string) => {
  console.log(`Verificando endpoint: ${endpoint}`);
  try {
    // Intentar usar el token JWT del localStorage primero
    const savedToken = localStorage.getItem('wp_token');
    
    if (savedToken) {
      console.log('Usando token JWT guardado para verificación');
      const response = await fetch(`${wpUrl}/wp-json${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${savedToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        return true;
      }
    }

    // Si no hay token guardado o falló la verificación, intentar obtener uno nuevo
    console.log('Obteniendo nuevo token JWT para verificación');
    const jwtResponse = await getJWTToken(
      wpUrl,
      wpUsername,
      wpToken
    );

    console.log('Token JWT obtenido para endpoint:', endpoint);
    
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

    return response.ok;
  } catch (error) {
    console.error(`Error al verificar endpoint ${endpoint}:`, error);
    return false;
  }
};

export const fetchUserStructure = async (wpUrl: string, wpUsername: string, wpToken: string) => {
  try {
    // Intentar usar el token JWT del localStorage primero
    const savedToken = localStorage.getItem('wp_token');
    let tokenToUse;

    if (savedToken) {
      tokenToUse = savedToken;
    } else {
      // Si no hay token guardado, obtener uno nuevo
      const jwtResponse = await getJWTToken(
        wpUrl,
        wpUsername,
        wpToken
      );
      tokenToUse = jwtResponse.token;
    }

    console.log('Token JWT obtenido para estructura de usuario');
    
    const response = await fetch(`${wpUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        'Authorization': `Bearer ${tokenToUse}`,
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