
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { categories, departments } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, Department } from '@/types';
import { Send } from 'lucide-react';

type TicketFormProps = {
  addTicket: (ticket: {
    title: string;
    description: string;
    category: Category;
    createdByName: string;
    createdBySurname: string;
    createdByDepartment: Department;
  }) => void;
};

const TicketForm = ({ addTicket }: TicketFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(categories[0]);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [department, setDepartment] = useState<Department>(departments[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title || !description || !category || !name || !surname || !department) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate server request
    setTimeout(() => {
      addTicket({
        title,
        description,
        category,
        createdByName: name,
        createdBySurname: surname,
        createdByDepartment: department
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory(categories[0]);
      setName('');
      setSurname('');
      setDepartment(departments[0]);
      
      toast({
        title: "Ticket Created",
        description: "Your ticket has been successfully submitted",
      });
      
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <Card className="w-full max-w-xl mx-auto animate-fadeIn shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Submit a New Ticket</CardTitle>
        <CardDescription>Fill in the details to create a new support ticket</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete="off"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed explanation of the issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as Category)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">First Name</Label>
              <Input
                id="name"
                placeholder="Your first name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="surname">Last Name</Label>
              <Input
                id="surname"
                placeholder="Your last name"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={department}
              onValueChange={(value) => setDepartment(value as Department)}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full flex items-center gap-2" 
            disabled={isSubmitting}
          >
            <Send className="h-4 w-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Ticket'}</span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TicketForm;
