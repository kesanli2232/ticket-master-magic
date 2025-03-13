
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import TicketCard from './TicketCard';
import FilterBar from './FilterBar';
import { Ticket, Status, TicketFilter } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { assignees, categories, priorities, statuses } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';

type TicketListProps = {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
};

const TicketList = ({ tickets, setTickets }: TicketListProps) => {
  const [filters, setFilters] = useState<TicketFilter>({});
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { role } = useAuth();
  const { toast } = useToast();
  
  const filteredTickets = tickets.filter((ticket) => {
    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    if (filters.assignedTo && ticket.assignedTo !== filters.assignedTo) return false;
    if (filters.category && ticket.category !== filters.category) return false;
    return true;
  });
  
  const handleUpdateStatus = (id: string, status: Status) => {
    const updatedTickets = tickets.map((ticket) => 
      ticket.id === id ? { ...ticket, status } : ticket
    );
    setTickets(updatedTickets);
    
    toast({
      title: "Durum Güncellendi",
      description: `Talep durumu ${status} olarak değiştirildi`,
      duration: 3000
    });
  };
  
  const handleDeleteTicket = (id: string) => {
    const updatedTickets = tickets.filter((ticket) => ticket.id !== id);
    setTickets(updatedTickets);
    
    toast({
      title: "Talep Silindi",
      description: "Talep başarıyla silindi",
      duration: 3000
    });
  };
  
  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveEdit = () => {
    if (!editingTicket) return;
    
    const updatedTickets = tickets.map((ticket) => 
      ticket.id === editingTicket.id ? editingTicket : ticket
    );
    
    setTickets(updatedTickets);
    setIsEditDialogOpen(false);
    setEditingTicket(null);
    
    toast({
      title: "Talep Güncellendi",
      description: "Talep başarıyla güncellendi",
      duration: 3000
    });
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
                    onValueChange={(value) => setEditingTicket({ ...editingTicket, status: value as Status })}
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
                      onValueChange={(value) => {
                        // Yazıcı Sorunu için otomatik öncelik ayarla
                        if (editingTicket.category === 'Yazıcı Sorunu' && value !== 'Çok Önemli') {
                          toast({
                            title: "Otomatik Öncelik",
                            description: "Yazıcı sorunları her zaman 'Çok Önemli' olarak ayarlanır",
                            duration: 3000
                          });
                          setEditingTicket({ ...editingTicket, priority: 'Çok Önemli' });
                        } else {
                          setEditingTicket({ ...editingTicket, priority: value as Priority });
                        }
                      }}
                    >
                      <SelectTrigger id="edit-priority">
                        <SelectValue placeholder="Öncelik seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem 
                            key={priority} 
                            value={priority}
                            disabled={editingTicket.category === 'Yazıcı Sorunu' && priority !== 'Çok Önemli'}
                          >
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              {role === 'admin' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Kategori</Label>
                      <Select
                        value={editingTicket.category}
                        onValueChange={(value) => {
                          const newCategory = value as Category;
                          // Yazıcı Sorunu için otomatik öncelik ayarla
                          if (newCategory === 'Yazıcı Sorunu') {
                            setEditingTicket({ 
                              ...editingTicket, 
                              category: newCategory,
                              priority: 'Çok Önemli'
                            });
                            
                            toast({
                              title: "Otomatik Öncelik",
                              description: "Yazıcı Sorunu için öncelik 'Çok Önemli' olarak ayarlandı",
                              duration: 3000
                            });
                          } else {
                            setEditingTicket({ ...editingTicket, category: newCategory });
                          }
                        }}
                      >
                        <SelectTrigger id="edit-category">
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleSaveEdit}>Değişiklikleri Kaydet</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TicketList;
