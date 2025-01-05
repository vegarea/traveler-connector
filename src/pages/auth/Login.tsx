import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestUserCreationForm } from "@/components/admin/forms/TestUserCreationForm";
import { LoginForm } from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <TestUserCreationForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;