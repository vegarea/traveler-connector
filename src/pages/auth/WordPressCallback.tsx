import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WordPressCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processAuth = async () => {
      try {
        const appPassword = searchParams.get('app_password');
        const username = searchParams.get('username');
        
        if (!appPassword || !username) {
          console.error('Faltan credenciales de WordPress');
          toast({
            title: "Error de autenticación",
            description: "Credenciales de WordPress incompletas",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        // Obtener la configuración de WordPress
        const { data: wpConfig, error: configError } = await supabase
          .from('wordpress_config')
          .select('wp_url')
          .single();

        if (configError || !wpConfig?.wp_url) {
          console.error('Error al obtener configuración de WordPress:', configError);
          throw new Error('Error de configuración');
        }

        // Validar las credenciales contra WordPress
        const response = await fetch(`${wpConfig.wp_url}/wp-json/wp/v2/users/me`, {
          headers: {
            'Authorization': `Basic ${btoa(`${username}:${appPassword}`)}`,
          },
        });

        if (!response.ok) {
          console.error('Error validando credenciales:', await response.text());
          throw new Error('Credenciales inválidas');
        }

        const wpUser = await response.json();

        // Crear o actualizar usuario en Supabase
        const { data: existingUser, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('wordpress_user_id', wpUser.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error al buscar usuario:', userError);
          throw new Error('Error de base de datos');
        }

        const userData = {
          wordpress_user_id: wpUser.id,
          username: wpUser.slug,
          email: wpUser.email,
          avatar_url: wpUser.avatar_urls['96'],
          wp_auth_token: appPassword,
          wp_auth_token_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          account_status: 'active',
          email_verified: true,
        };

        let user;
        if (existingUser) {
          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update(userData)
            .eq('id', existingUser.id)
            .select()
            .single();

          if (updateError) {
            console.error('Error actualizando usuario:', updateError);
            throw new Error('Error actualizando usuario');
          }
          user = updatedUser;
        } else {
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert(userData)
            .select()
            .single();

          if (createError) {
            console.error('Error creando usuario:', createError);
            throw new Error('Error creando usuario');
          }
          user = newUser;
        }

        // Guardar información en localStorage
        localStorage.setItem('wp_auth', JSON.stringify({
          username,
          token: appPassword,
          user_id: wpUser.id
        }));
        localStorage.setItem('user', JSON.stringify(user));

        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente",
        });

        // Redirigir al perfil del usuario
        navigate(`/u/${user.username}`);

      } catch (error) {
        console.error('Error procesando autenticación:', error);
        toast({
          title: "Error",
          description: "No se pudo completar la autenticación",
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    processAuth();
  }, [searchParams, navigate, toast]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">Procesando autenticación...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default WordPressCallback;