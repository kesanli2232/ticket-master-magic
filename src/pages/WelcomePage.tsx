
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare, User, User2, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Örnek CSV verisi (gerçek projede CSV'den alınacak)
const employeeData = [
  { firstName: "Ahmet", lastName: "Yılmaz" },
  { firstName: "Mehmet", lastName: "Kaya" },
  { firstName: "Ayşe", lastName: "Demir" },
  { firstName: "Fatma", lastName: "Çelik" },
  { firstName: "Ali", lastName: "Şahin" },
  { firstName: "Zeynep", lastName: "Öztürk" },
  { firstName: "Mustafa", lastName: "Arslan" },
  { firstName: "Elif", lastName: "Yıldız" },
  { firstName: "Emre", lastName: "Aydın" },
  { firstName: "Seda", lastName: "Koç" }
];

// Form şeması ile zorunlu alanları ve doğrulamaları belirliyoruz
const welcomeSchema = z.object({
  firstName: z.string().min(1, "İsim alanı gereklidir"),
  lastName: z.string().min(1, "Soyisim alanı gereklidir"),
  password: z.string().min(1, "Şifre alanı gereklidir"),
});

type WelcomeFormValues = z.infer<typeof welcomeSchema>;

const WelcomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form yönetimi için react-hook-form kullanıyoruz
  const form = useForm<WelcomeFormValues>({
    resolver: zodResolver(welcomeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  const onSubmit = (values: WelcomeFormValues) => {
    setIsLoading(true);
    
    // CSV verilerinde kullanıcıyı arayalım
    const employeeExists = employeeData.some(
      employee => 
        employee.firstName.toLowerCase() === values.firstName.toLowerCase() && 
        employee.lastName.toLowerCase() === values.lastName.toLowerCase()
    );
    
    // Şifre kontrolü
    const isPasswordCorrect = values.password === "Belediye22";
    
    setTimeout(() => {
      if (employeeExists && isPasswordCorrect) {
        // Giriş başarılı - isim ve soyismi localStorage'a kaydedelim
        const fullName = `${values.firstName} ${values.lastName}`;
        localStorage.setItem('visitorName', fullName);
        
        // Başarılı giriş bildirimini göster
        toast({
          title: "Giriş başarılı",
          description: `Hoş geldiniz, ${fullName}!`,
          duration: 3000
        });
        
        // Ana sayfaya yönlendir
        navigate('/index');
      } else if (!employeeExists) {
        // Kullanıcı bulunamadı
        toast({
          title: "Giriş başarısız",
          description: "Bu isim ve soyisim ile kayıtlı bir çalışan bulunamadı.",
          variant: "destructive",
          duration: 3000
        });
      } else {
        // Şifre yanlış
        toast({
          title: "Giriş başarısız",
          description: "Girilen şifre yanlış.",
          variant: "destructive",
          duration: 3000
        });
      }
      
      setIsLoading(false);
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
          <CardDescription>Sisteme giriş yapmak için bilgilerinizi girin</CardDescription>
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
                <p>İsim: <code className="text-foreground">Ahmet</code>, Soyisim: <code className="text-foreground">Yılmaz</code>, Şifre: <code className="text-foreground">Belediye22</code></p>
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

export default WelcomePage;
