import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { validateWordPressToken, syncWordPressUser } from '@/utils/wordpressAuth';
import { useToast } from "@/hooks/use-toast";
import { useWordPressConfig } from '@/components/wordpress/hooks/useWordPressConfig';

const WordPressCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const { data: wpConfig } = useWordPressConfig();

  useEffect(() => {
    const processToken = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          toast({
            title: "Error de autenticación",
            description: "No se recibió el token de WordPress",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Validar el token
        const payload = await validateWordPressToken(token);
        if (!payload) {
          toast({
            title: "Error de autenticación",
            description: "Token de WordPress inválido",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Sincronizar usuario
        const user = await syncWordPressUser(payload);
        if (!user) {
          toast({
            title: "Error",
            description: "No se pudo sincronizar el usuario",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Guardar token y datos de usuario
        localStorage.setItem('wp_token', token);
        localStorage.setItem('user', JSON.stringify(user));

        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente",
        });

        // Determinar la URL de redirección
        let redirectUrl = '/'; // Por defecto, redirige al home

        // Si estamos en desarrollo, redirige al perfil del usuario
        if (import.meta.env.DEV) {
          redirectUrl = `/u/${user.username}`;
        }

        // Si hay una URL de redirección configurada en WordPress, úsala
        if (wpConfig?.login_redirect_url) {
          redirectUrl = wpConfig.login_redirect_url;
        }

        // Redirigir al usuario
        navigate(redirectUrl);
      } catch (error) {
        console.error('Error processing WordPress token:', error);
        toast({
          title: "Error",
          description: "Ocurrió un error al procesar la autenticación",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setIsProcessing(false);
      }
    };

    processToken();
  }, [searchParams, navigate, toast, wpConfig]);

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