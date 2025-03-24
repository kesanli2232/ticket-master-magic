
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare, Lock, User, User2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Form şeması ile zorunlu alanları ve doğrulamaları belirliyoruz
const loginSchema = z.object({
  firstName: z.string().min(1, "İsim alanı gereklidir"),
  lastName: z.string().min(1, "Soyisim alanı gereklidir"),
  password: z.string().min(1, "Şifre alanı gereklidir"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form yönetimi için react-hook-form kullanıyoruz
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setIsLoading(true);
    
    // Ağ isteğini simüle etmek için küçük bir gecikme ekleyin
    setTimeout(() => {
      // Kullanıcı adını isim ve soyisimden oluşturalım (küçük harflerle)
      const username = `${values.firstName.toLowerCase()}_${values.lastName.toLowerCase()}`;
      const success = login(username, values.password);
      
      if (success) {
        navigate('/');
      }
      
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="page-transition min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-md animate-fadeIn shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-primary/10 p-3">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Talep Sistemine Giriş</CardTitle>
          <CardDescription>Giriş yapmak için bilgilerinizi girin</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {/* İsim alanı */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İsim</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Adınızı girin"
                          className="pl-10"
                          autoComplete="given-name"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Soyisim alanı */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soyisim</FormLabel>
                    <div className="relative">
                      <User2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Soyadınızı girin"
                          className="pl-10"
                          autoComplete="family-name"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Şifre alanı */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Şifrenizi girin"
                          className="pl-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-xs text-muted-foreground mt-2">
                <p>Örnek Giriş Bilgileri:</p>
                <p>İsim: <code className="text-foreground">Admin</code>, Soyisim: <code className="text-foreground">User</code>, Şifre: <code className="text-foreground">admin123</code></p>
                <p>İsim: <code className="text-foreground">Viewer</code>, Soyisim: <code className="text-foreground">User</code>, Şifre: <code className="text-foreground">viewer123</code></p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
