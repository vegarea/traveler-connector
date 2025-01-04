import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { validateWordPressToken, syncWordPressUser } from '@/utils/wordpressAuth';
import { useToast } from "@/hooks/use-toast";

const WordPressCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processToken = async () => {
      try {
        console.log('🔄 Iniciando proceso de callback de WordPress...');
        
        const token = searchParams.get('token');
        console.log('📦 Token recibido en callback:', token ? 'Token presente' : 'Token ausente');
        
        if (!token) {
          console.error('❌ Error: No se recibió token en la URL');
          toast({
            title: "Error de autenticación",
            description: "No se recibió el token de WordPress",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Validar el token
        console.log('🔑 Intentando validar token JWT...');
        const payload = await validateWordPressToken(token);
        console.log('✅ Resultado de validación JWT:', payload);
        
        if (!payload) {
          console.error('❌ Error: Token JWT inválido o expirado');
          toast({
            title: "Error de autenticación",
            description: "Token de WordPress inválido",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Sincronizar usuario
        console.log('👤 Iniciando sincronización de usuario:', {
          email: payload.user_email,
          username: payload.user_nicename,
          userId: payload.user_id
        });
        
        const user = await syncWordPressUser(payload);
        console.log('✅ Resultado de sincronización:', user);
        
        if (!user) {
          console.error('❌ Error: Fallo en sincronización de usuario');
          toast({
            title: "Error",
            description: "No se pudo sincronizar el usuario",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Guardar token y datos de usuario
        console.log('💾 Guardando token y datos en localStorage');
        localStorage.setItem('wp_token', token);
        localStorage.setItem('user', JSON.stringify(user));

        console.log('🎉 Proceso de autenticación completado exitosamente');
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente",
        });

        // Redirigir al perfil del usuario
        console.log('🔄 Redirigiendo a perfil:', `/u/${user.username}`);
        navigate(`/u/${user.username}`);
      } catch (error) {
        console.error('❌ Error crítico en proceso de autenticación:', error);
        if (error instanceof Error) {
          console.error('Detalles del error:', {
            message: error.message,
            stack: error.stack
          });
        }
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