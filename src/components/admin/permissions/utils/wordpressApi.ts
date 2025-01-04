export const createAuthHeader = (username: string, token: string) => {
  return `Basic ${btoa(`${username}:${token}`)}`;
};

export const getJWTToken = async (wpUrl: string, username: string, password: string) => {
  console.log('Obteniendo token JWT...');
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
    console.error('Error al obtener token JWT:', errorData);
    throw new Error(errorData.message || 'Error al obtener token JWT');
  }

  const data = await response.json();
  console.log('Token JWT obtenido exitosamente');
  return data;
};

export const validateJWTToken = async (wpUrl: string, token: string) => {
  console.log('Validando token JWT...');
  const response = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token/validate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
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
};

export const checkEndpoint = async (endpoint: string, wpUrl: string, wpUsername: string, wpToken: string) => {
  console.log(`Verificando endpoint: ${endpoint}`);
  try {
    const response = await fetch(`${wpUrl}/wp-json${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${wpToken}`
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
    const response = await fetch(`${wpUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        'Authorization': `Bearer ${wpToken}`
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