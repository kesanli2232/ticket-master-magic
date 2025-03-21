
import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Pencil, Trash2, AlertTriangle, CheckCircle, AlertCircle, Calendar, User, Briefcase, Clock, Network } from 'lucide-react';
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
    // Durumu döngüsel olarak değiştirme
    let newStatus: Status;
    switch (ticket.status) {
      case 'Açık':
        newStatus = 'İşlemde';
        break;
      case 'İşlemde':
        newStatus = 'Çözüldü';
        break;
      case 'Çözüldü':
        newStatus = 'Açık';
        break;
      default:
        newStatus = 'Açık';
    }
    onUpdateStatus(ticket.id, newStatus);
  };
  
  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Açık':
        return 'bg-blue-500';
      case 'İşlemde':
        return 'bg-orange-500';
      case 'Çözüldü':
        return 'bg-green-500';
      case 'Çözülemedi':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
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
    switch (status) {
      case 'Açık':
        return 'open';
      case 'İşlemde':
        return 'in-progress';
      case 'Çözüldü':
        return 'solved';
      case 'Çözülemedi':
        return 'unsolved';
      default:
        return '';
    }
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

      {/* IP adresi ve oluşturulma saati bilgileri */}
      {role === 'admin' && (
        <div className="border-t border-border pt-2 mt-2 mb-3">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center text-xs text-muted-foreground">
              <Network className="h-3.5 w-3.5 mr-1" />
              <span title="IP Adresi">IP: {ticket.ipAddress || 'Bilinmiyor'}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span title="Tam Oluşturulma Zamanı">
                Saat: {format(new Date(ticket.createdAt), 'HH:mm:ss', { locale: tr })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Çözülemedi durumunda yorum gösterimi */}
      {ticket.status === 'Çözülemedi' && ticket.rejectionComment && (
        <div className="border-t border-border pt-2 mt-2 mb-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-red-500">Çözülememe Nedeni:</p>
            <p className="text-sm text-muted-foreground">{ticket.rejectionComment}</p>
          </div>
        </div>
      )}
      
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
            variant="outline" 
            size="sm"
            className={
              ticket.status === 'Açık' 
                ? 'border-blue-500 text-blue-500 hover:bg-blue-50' 
                : ticket.status === 'İşlemde'
                  ? 'border-orange-500 text-orange-500 hover:bg-orange-50'
                  : ticket.status === 'Çözüldü'
                    ? 'border-green-500 text-green-500 hover:bg-green-50'
                    : 'border-red-500 text-red-500 hover:bg-red-50'
            }
            onClick={ticket.status !== 'Çözülemedi' ? toggleStatus : undefined}
            disabled={ticket.status === 'Çözülemedi'}
          >
            {ticket.status}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
