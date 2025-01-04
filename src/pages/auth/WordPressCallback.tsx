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
        const token = searchParams.get('token');
        console.log('Token recibido:', token);
        
        if (!token) {
          console.error('No se recibió token');
          toast({
            title: "Error de autenticación",
            description: "No se recibió el token de WordPress",
            variant: "destructive",
          });
          navigate('/admin/settings/wordpress');
          return;
        }

        // Validar el token
        console.log('Intentando validar token...');
        const payload = await validateWordPressToken(token);
        console.log('Resultado de validación:', payload);
        
        if (!payload) {
          console.error('Token inválido');
          toast({
            title: "Error de autenticación",
            description: "Token de WordPress inválido",
            variant: "destructive",
          });
          navigate('/admin/settings/wordpress');
          return;
        }

        // Sincronizar usuario
        console.log('Intentando sincronizar usuario:', payload);
        const user = await syncWordPressUser(payload);
        console.log('Resultado de sincronización:', user);
        
        if (!user) {
          console.error('Error en sincronización de usuario');
          toast({
            title: "Error",
            description: "No se pudo sincronizar el usuario",
            variant: "destructive",
          });
          navigate('/admin/settings/wordpress');
          return;
        }

        // Guardar token y datos de usuario
        localStorage.setItem('wp_token', token);
        localStorage.setItem('user', JSON.stringify(user));

        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente",
        });

        // Redirigir al dashboard
        navigate('/admin');
      } catch (error) {
        console.error('Error procesando token de WordPress:', error);
        toast({
          title: "Error",
          description: "Ocurrió un error al procesar la autenticación",
          variant: "destructive",
        });
        navigate('/admin/settings/wordpress');
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