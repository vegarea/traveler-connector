import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AdminAuth = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/95 p-4">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
      <Card className="w-full max-w-md relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F4007A]/10 to-transparent pointer-events-none" />
        <CardHeader>
          <CardTitle className="text-center">Panel de Control</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#F4007A',
                    brandAccent: '#F4007A',
                    brandButtonText: 'white',
                    defaultButtonBackground: 'transparent',
                    defaultButtonBackgroundHover: '#F4007A20',
                    inputBackground: 'transparent',
                    inputBorder: '#F4007A40',
                    inputBorderHover: '#F4007A',
                    inputBorderFocus: '#F4007A',
                  },
                },
              },
              className: {
                button: 'bg-[#F4007A] hover:bg-[#F4007A]/90',
                input: 'bg-white/5 border-white/10',
                label: 'text-foreground',
              },
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Correo electrónico',
                  password_label: 'Contraseña',
                  button_label: 'Iniciar sesión',
                },
                sign_up: {
                  email_label: 'Correo electrónico',
                  password_label: 'Contraseña',
                  button_label: 'Registrarse',
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};