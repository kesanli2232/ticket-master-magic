
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
      title: "Status Updated",
      description: `Ticket has been marked as ${status}`,
      duration: 3000
    });
  };
  
  const handleDeleteTicket = (id: string) => {
    const updatedTickets = tickets.filter((ticket) => ticket.id !== id);
    setTickets(updatedTickets);
    
    toast({
      title: "Ticket Deleted",
      description: "The ticket has been successfully deleted",
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
      title: "Ticket Updated",
      description: "The ticket has been successfully updated",
      duration: 3000
    });
  };

  return (
    <div className="animate-fadeIn">
      <FilterBar onFilter={setFilters} />
      
      {filteredTickets.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No tickets found</h3>
          <p className="text-muted-foreground">
            {Object.keys(filters).length > 0 
              ? "Try adjusting your filters to see more results"
              : "No tickets have been created yet"}
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
              <DialogTitle>Edit Ticket</DialogTitle>
              <DialogDescription>
                Make changes to the ticket information below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingTicket.title}
                  onChange={(e) => setEditingTicket({ ...editingTicket, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingTicket.description}
                  onChange={(e) => setEditingTicket({ ...editingTicket, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingTicket.status}
                    onValueChange={(value) => setEditingTicket({ ...editingTicket, status: value as Status })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
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
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select
                      value={editingTicket.priority}
                      onValueChange={(value) => {
                        // Auto set priority for Printer Issue
                        if (editingTicket.category === 'Printer Issue' && value !== 'Very Important') {
                          toast({
                            title: "Auto Priority",
                            description: "Printer issues are always set to 'Very Important'",
                            duration: 3000
                          });
                          setEditingTicket({ ...editingTicket, priority: 'Very Important' });
                        } else {
                          setEditingTicket({ ...editingTicket, priority: value as any });
                        }
                      }}
                    >
                      <SelectTrigger id="edit-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem 
                            key={priority} 
                            value={priority}
                            disabled={editingTicket.category === 'Printer Issue' && priority !== 'Very Important'}
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
                      <Label htmlFor="edit-assignee">Assignee</Label>
                      <Select
                        value={editingTicket.assignedTo}
                        onValueChange={(value) => setEditingTicket({ ...editingTicket, assignedTo: value as any })}
                      >
                        <SelectTrigger id="edit-assignee">
                          <SelectValue placeholder="Select assignee" />
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
                      <Label htmlFor="edit-category">Category</Label>
                      <Select
                        value={editingTicket.category}
                        onValueChange={(value) => {
                          const newCategory = value as any;
                          // Auto set priority for Printer Issue
                          if (newCategory === 'Printer Issue') {
                            setEditingTicket({ 
                              ...editingTicket, 
                              category: newCategory,
                              priority: 'Very Important'
                            });
                            
                            toast({
                              title: "Auto Priority",
                              description: "Priority has been set to 'Very Important' for Printer Issue",
                              duration: 3000
                            });
                          } else {
                            setEditingTicket({ ...editingTicket, category: newCategory });
                          }
                        }}
                      >
                        <SelectTrigger id="edit-category">
                          <SelectValue placeholder="Select category" />
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
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TicketList;
