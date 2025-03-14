
import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Pencil, Trash2, AlertTriangle, CheckCircle, AlertCircle, Calendar, User, Briefcase, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Ticket, Status, Priority, AssignedTo } from '@/types';
import { useAuth } from '@/context/AuthContext';

type TicketCardProps = {
  ticket: Ticket;
  onDelete: (id: string) => void;
  onEdit: (ticket: Ticket) => void;
  onUpdateStatus: (id: string, status: Status) => void;
};

const TicketCard = ({ ticket, onDelete, onEdit, onUpdateStatus }: TicketCardProps) => {
  const { role } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const toggleStatus = () => {
    const newStatus: Status = ticket.status === 'Açık' ? 'Çözüldü' : 'Açık';
    onUpdateStatus(ticket.id, newStatus);
  };
  
  const getStatusColor = (status: Status) => {
    return status === 'Açık' ? 'bg-blue-500' : 'bg-green-500';
  };
  
  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'Çok Önemli':
        return <AlertTriangle className="h-4 w-4 text-ticket-high-priority" />;
      case 'Önemli':
        return <AlertCircle className="h-4 w-4 text-ticket-medium-priority" />;
      default:
        return <CheckCircle className="h-4 w-4 text-ticket-low-priority" />;
    }
  };
  
  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
      case 'Çok Önemli':
        return 'high-priority';
      case 'Önemli':
        return 'medium-priority';
      default:
        return 'low-priority';
    }
  };
  
  const getStatusClass = (status: Status) => {
    return status === 'Açık' ? 'open' : 'solved';
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPpp', { locale: tr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <div className={`ticket-card ${getStatusClass(ticket.status)} ${getPriorityClass(ticket.priority)} animate-slideIn`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-lg line-clamp-1">{ticket.title}</h3>
        
        <div className="flex gap-1">
          {role === 'admin' && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => onEdit(ticket)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Düzenle</span>
              </Button>
              
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Sil</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Talebi Sil</DialogTitle>
                    <DialogDescription>
                      Bu talebi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      İptal
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        onDelete(ticket.id);
                        setIsDeleteDialogOpen(false);
                      }}
                    >
                      Sil
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
      
      <p className="text-muted-foreground mb-4 line-clamp-2">{ticket.description}</p>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center text-sm">
          <User className="h-4 w-4 mr-1.5" />
          <span>{ticket.createdByName} {ticket.createdBySurname}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Briefcase className="h-4 w-4 mr-1.5" />
          <span className="truncate" title={ticket.createdByDepartment}>
            {ticket.createdByDepartment}
          </span>
        </div>
        
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-1.5" />
          <span>{ticket.assignedTo}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-1.5" />
          <span title={formatDate(ticket.createdAt)}>
            {format(new Date(ticket.createdAt), 'PP', { locale: tr })}
          </span>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mt-auto">
        <Badge 
          variant="outline" 
          className="flex items-center gap-1"
        >
          {getPriorityIcon(ticket.priority)}
          <span>{ticket.priority}</span>
        </Badge>
        
        <div className="ml-auto">
          <Button 
            variant={ticket.status === 'Açık' ? 'outline' : 'default'} 
            size="sm"
            className={
              ticket.status === 'Açık' 
                ? 'border-blue-500 text-blue-500 hover:bg-blue-50' 
                : 'bg-green-500 hover:bg-green-600'
            }
            onClick={toggleStatus}
          >
            {ticket.status}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
