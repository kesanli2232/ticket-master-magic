
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare, User, User2 } from 'lucide-react';

// Form şeması ile zorunlu alanları ve doğrulamaları belirliyoruz
const welcomeSchema = z.object({
  firstName: z.string().min(1, "İsim alanı gereklidir"),
  lastName: z.string().min(1, "Soyisim alanı gereklidir"),
});

type WelcomeFormValues = z.infer<typeof welcomeSchema>;

const WelcomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Form yönetimi için react-hook-form kullanıyoruz
  const form = useForm<WelcomeFormValues>({
    resolver: zodResolver(welcomeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = (values: WelcomeFormValues) => {
    setIsLoading(true);
    
    // İsim ve soyismi localStorage'a kaydedelim
    const fullName = `${values.firstName} ${values.lastName}`;
    localStorage.setItem('visitorName', fullName);
    
    // Kısa bir gecikme ekleyelim
    setTimeout(() => {
      setIsLoading(false);
      // Ana sayfaya yönlendir
      navigate('/home');
    }, 600);
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
          <CardTitle className="text-2xl">Hoş Geldiniz</CardTitle>
          <CardDescription>Lütfen bilgilerinizi girin</CardDescription>
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
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'İşleniyor...' : 'Devam Et'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default WelcomePage;
