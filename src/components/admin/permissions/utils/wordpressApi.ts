export const getJWTToken = async (wpUrl: string, username: string, password: string) => {
  console.log('Obteniendo token JWT...');
  try {
    const response = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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

    console.log('Token JWT obtenido exitosamente');
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
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error al validar token JWT:', data);
      throw new Error(data.message || 'Token JWT inválido');
    }

    console.log('Token JWT validado exitosamente');
    return data;
  } catch (error) {
    console.error('Error en la validación JWT:', error);
    throw error;
  }
};

export const getCurrentUser = async (wpUrl: string, token: string) => {
  console.log('Obteniendo información del usuario actual...');
  try {
    const response = await fetch(`${wpUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error al obtener usuario:', data);
      throw new Error(data.message || 'Error al obtener información del usuario');
    }

    console.log('Información del usuario obtenida exitosamente');
    return data;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
};

export const loginToWordPress = async (wpUrl: string, token: string) => {
  console.log('Iniciando sesión en WordPress...');
  try {
    const response = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error al iniciar sesión:', data);
      throw new Error(data.message || 'Error al iniciar sesión en WordPress');
    }

    console.log('Sesión iniciada exitosamente');
    return { success: true, ...data };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};