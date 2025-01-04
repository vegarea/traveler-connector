import { supabase } from "@/integrations/supabase/client";

interface WordPressTokenPayload {
  user_email: string;
  user_nicename: string;
  user_id: number;
}

export const generateWordPressLoginUrl = async (): Promise<string> => {
  try {
    // Obtener la configuración de WordPress
    const { data: wpConfig, error: configError } = await supabase
      .from('wordpress_config')
      .select('wp_url, auth_callback_url')
      .single();

    if (configError || !wpConfig?.wp_url) {
      console.error('Error al obtener configuración de WordPress:', configError);
      throw new Error('No se pudo obtener la configuración de WordPress');
    }

    // Construir la URL de login
    const loginUrl = new URL(`${wpConfig.wp_url}/wp-json/jwt-auth/v1/auth-redirect`);
    loginUrl.searchParams.append('redirect_url', wpConfig.auth_callback_url || window.location.origin + '/auth/wordpress/callback');
    
    console.log('URL de login generada:', loginUrl.toString());
    return loginUrl.toString();
  } catch (error) {
    console.error('Error al generar URL de login:', error);
    throw error;
  }
};

export const validateWordPressToken = async (token: string): Promise<WordPressTokenPayload | null> => {
  try {
    console.log('Iniciando validación de token de WordPress...');
    
    // Obtener la configuración de WordPress
    const { data: wpConfig, error: configError } = await supabase
      .from('wordpress_config')
      .select('wp_url')
      .single();

    if (configError || !wpConfig?.wp_url) {
      console.error('Error al obtener configuración de WordPress:', configError);
      return null;
    }

    console.log('URL de WordPress obtenida:', wpConfig.wp_url);

    // Validar el token contra el endpoint de WordPress
    const response = await fetch(`${wpConfig.wp_url}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Respuesta de validación:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token inválido:', errorText);
      return null;
    }

    // Decodificar el token (asumiendo que es un JWT válido)
    const payload = JSON.parse(atob(token.split('.')[1])) as WordPressTokenPayload;
    console.log('Token validado exitosamente:', payload);
    
    return payload;
  } catch (error) {
    console.error('Error al validar token:', error);
    return null;
  }
};

export const syncWordPressUser = async (payload: WordPressTokenPayload) => {
  try {
    console.log('Iniciando sincronización de usuario de WordPress:', payload);
    
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('wordpress_user_id', payload.user_id)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error al buscar usuario:', userError);
      return null;
    }

    if (existingUser) {
      console.log('Usuario existente encontrado:', existingUser);
      // Actualizar usuario existente
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          email: payload.user_email,
          username: payload.user_nicename,
          last_login_date: new Date().toISOString()
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error al actualizar usuario:', updateError);
        return null;
      }

      console.log('Usuario actualizado:', updatedUser);
      return updatedUser;
    } else {
      console.log('Creando nuevo usuario...');
      // Crear nuevo usuario
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          wordpress_user_id: payload.user_id,
          email: payload.user_email,
          username: payload.user_nicename,
          account_status: 'active',
          email_verified: true,
          last_login_date: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('Error al crear usuario:', createError);
        return null;
      }

      console.log('Nuevo usuario creado:', newUser);
      return newUser;
    }
  } catch (error) {
    console.error('Error al sincronizar usuario:', error);
    return null;
  }
};