
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import TicketCard from './TicketCard';
import FilterBar from './FilterBar';
import { Ticket, Status, Priority, AssignedTo, TicketFilter } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { assignees, priorities, statuses } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';
import { DB } from '@/lib/data';

type TicketListProps = {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
};

const TicketList = ({ tickets, setTickets }: TicketListProps) => {
  const [filters, setFilters] = useState<TicketFilter>({});
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rejectionComment, setRejectionComment] = useState<string>("");
  const [showRejectionCommentField, setShowRejectionCommentField] = useState(false);
  const { role } = useAuth();
  const { toast } = useToast();
  
  const filteredTickets = tickets.filter((ticket) => {
    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    if (filters.assignedTo && ticket.assignedTo !== filters.assignedTo) return false;
    return true;
  });
  
  const handleUpdateStatus = async (id: string, status: Status) => {
    setIsUpdating(true);
    
    try {
      // Find the ticket to update
      const ticket = tickets.find(t => t.id === id);
      if (!ticket) return;
      
      // Create updated ticket
      const updatedTicket = { ...ticket, status };
      
      // Update in Supabase
      await DB.updateTicket(updatedTicket);
      
      // Update local state
      const updatedTickets = tickets.map(t => 
        t.id === id ? updatedTicket : t
      );
      setTickets(updatedTickets);
      
      toast({
        title: "Durum Güncellendi",
        description: `Talep durumu ${status} olarak değiştirildi`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: "Güncelleme Hatası",
        description: "Talep durumu güncellenirken bir hata oluştu",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteTicket = async (id: string) => {
    setIsUpdating(true);
    
    try {
      // Delete from Supabase
      await DB.deleteTicket(id);
      
      // Update local state
      const updatedTickets = tickets.filter(ticket => ticket.id !== id);
      setTickets(updatedTickets);
      
      toast({
        title: "Talep Silindi",
        description: "Talep başarıyla silindi",
        duration: 3000
      });
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast({
        title: "Silme Hatası",
        description: "Talep silinirken bir hata oluştu",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    // Eğer "Çözülemedi" durumunda ise yorum alanını göster
    setShowRejectionCommentField(ticket.status === 'Çözülemedi');
    // Varsa mevcut yorum değerini al
    setRejectionComment(ticket.rejectionComment || '');
    setIsEditDialogOpen(true);
  };

  const handleStatusChange = (value: Status) => {
    if (!editingTicket) return;
    
    setEditingTicket({ ...editingTicket, status: value });
    
    // "Çözülemedi" durumu seçildiğinde yorum alanını göster
    if (value === 'Çözülemedi') {
      setShowRejectionCommentField(true);
    } else {
      setShowRejectionCommentField(false);
      // Eğer "Çözülemedi" durumundan başka bir duruma geçilirse, yorumu sıfırla
      if (editingTicket.status === 'Çözülemedi') {
        setRejectionComment('');
      }
    }
  };
  
  const handleSaveEdit = async () => {
    if (!editingTicket) return;
    setIsUpdating(true);
    
    try {
      // Yeni ticket nesnesini oluştur ve "Çözülemedi" durumunda yorum ekle
      const updatedTicket = {
        ...editingTicket,
        rejectionComment: editingTicket.status === 'Çözülemedi' ? rejectionComment : undefined
      };
      
      // Update in Supabase
      await DB.updateTicket(updatedTicket);
      
      // Update local state
      const updatedTickets = tickets.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      );
      
      setTickets(updatedTickets);
      setIsEditDialogOpen(false);
      setEditingTicket(null);
      setRejectionComment('');
      setShowRejectionCommentField(false);
      
      toast({
        title: "Talep Güncellendi",
        description: "Talep başarıyla güncellendi",
        duration: 3000
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Güncelleme Hatası",
        description: "Talep güncellenirken bir hata oluştu",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <FilterBar onFilter={setFilters} />
      
      {filteredTickets.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Talep bulunamadı</h3>
          <p className="text-muted-foreground">
            {Object.keys(filters).length > 0 
              ? "Daha fazla sonuç görmek için filtrelerinizi ayarlayın"
              : "Henüz talep oluşturulmamış"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onDelete={handleDeleteTicket}
              onEdit={handleEditTicket}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
      
      {/* Edit Dialog */}
      {editingTicket && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Talebi Düzenle</DialogTitle>
              <DialogDescription>
                Aşağıdan talep bilgilerini düzenleyebilirsiniz
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Başlık</Label>
                <Input
                  id="edit-title"
                  value={editingTicket.title}
                  onChange={(e) => setEditingTicket({ ...editingTicket, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Açıklama</Label>
                <Textarea
                  id="edit-description"
                  value={editingTicket.description}
                  onChange={(e) => setEditingTicket({ ...editingTicket, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Durum</Label>
                  <Select
                    value={editingTicket.status}
                    onValueChange={(value) => handleStatusChange(value as Status)}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {role === 'admin' && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-priority">Öncelik</Label>
                    <Select
                      value={editingTicket.priority}
                      onValueChange={(value) => setEditingTicket({ ...editingTicket, priority: value as Priority })}
                    >
                      <SelectTrigger id="edit-priority">
                        <SelectValue placeholder="Öncelik seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              {role === 'admin' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-assignee">Atanan Kişi</Label>
                  <Select
                    value={editingTicket.assignedTo}
                    onValueChange={(value) => setEditingTicket({ ...editingTicket, assignedTo: value as AssignedTo })}
                  >
                    <SelectTrigger id="edit-assignee">
                      <SelectValue placeholder="Atanan kişiyi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignees.map((assignee) => (
                        <SelectItem key={assignee} value={assignee}>
                          {assignee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Çözülemedi durumu için yorum alanı */}
              {showRejectionCommentField && (
                <div className="space-y-2">
                  <Label htmlFor="rejection-comment" className="text-red-500">
                    Çözülememe Nedeni (Zorunlu)
                  </Label>
                  <Textarea
                    id="rejection-comment"
                    value={rejectionComment}
                    onChange={(e) => setRejectionComment(e.target.value)}
                    rows={3}
                    placeholder="Bu talebin neden çözülemediğini açıklayın"
                    className="border-red-200 focus-visible:ring-red-400"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                İptal
              </Button>
              <Button 
                onClick={handleSaveEdit}
                disabled={
                  editingTicket.status === 'Çözülemedi' && 
                  (!rejectionComment || rejectionComment.trim() === '')
                }
              >
                Değişiklikleri Kaydet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TicketList;
