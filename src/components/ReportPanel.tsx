
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useToast } from '@/components/ui/use-toast';

interface ReportPanelProps {
  onClose: () => void;
}

interface TicketSummaryReport {
  id: string;
  title: string;
  assigned_to: string;
  created_at: string;
  status: string;
  resolved_at: string | null;
}

interface TicketStatusSummary {
  status: string;
  ticket_count: number;
}

interface TicketPriorityDistribution {
  priority: string;
  ticket_count: number;
}

interface TicketByDepartment {
  created_by_department: string;
  ticket_count: number;
}

interface TicketsPerUser {
  assigned_to: string;
  ticket_count: number;
}

interface TicketsPerUserStatus {
  assigned_to: string;
  status: string;
  ticket_count: number;
}

interface TicketHourlyDistribution {
  hour_of_day: number;
  ticket_count: number;
}

interface AverageResolutionTime {
  avg_resolution_time: string | null;
}

const ReportPanel = ({ onClose }: ReportPanelProps) => {
  const [ticketSummary, setTicketSummary] = useState<TicketSummaryReport[]>([]);
  const [recentTickets, setRecentTickets] = useState<TicketSummaryReport[]>([]);
  const [statusSummary, setStatusSummary] = useState<TicketStatusSummary[]>([]);
  const [priorityDistribution, setPriorityDistribution] = useState<TicketPriorityDistribution[]>([]);
  const [departmentDistribution, setDepartmentDistribution] = useState<TicketByDepartment[]>([]);
  const [ticketsPerUser, setTicketsPerUser] = useState<TicketsPerUser[]>([]);
  const [ticketsPerUserStatus, setTicketsPerUserStatus] = useState<TicketsPerUserStatus[]>([]);
  const [hourlyDistribution, setHourlyDistribution] = useState<TicketHourlyDistribution[]>([]);
  const [avgResolutionTime, setAvgResolutionTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];
  
  // Status colors
  const STATUS_COLORS: Record<string, string> = {
    'Açık': '#22c55e',
    'İşlemde': '#3b82f6',
    'Çözüldü': '#10b981',
    'Çözülemedi': '#ef4444'
  };

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        // Fetch ticket summary report
        const { data: summaryData, error: summaryError } = await supabase
          .from('ticket_summary_report')
          .select('*');
        
        if (summaryError) throw summaryError;
        setTicketSummary(summaryData || []);

        // Fetch tickets from last 7 days
        const { data: recentData, error: recentError } = await supabase
          .from('tickets_last_7_days')
          .select('*');
        
        if (recentError) throw recentError;
        setRecentTickets(recentData || []);

        // Fetch ticket status summary
        const { data: statusData, error: statusError } = await supabase
          .from('ticket_status_summary')
          .select('*');
        
        if (statusError) throw statusError;
        setStatusSummary(statusData || []);

        // Fetch ticket priority distribution
        const { data: priorityData, error: priorityError } = await supabase
          .from('ticket_priority_distribution')
          .select('*');
        
        if (priorityError) throw priorityError;
        setPriorityDistribution(priorityData || []);

        // Fetch department distribution
        const { data: deptData, error: deptError } = await supabase
          .from('ticket_distribution_by_department')
          .select('*');
        
        if (deptError) throw deptError;
        setDepartmentDistribution(deptData || []);

        // Fetch tickets per user
        const { data: userTicketsData, error: userTicketsError } = await supabase
          .from('tickets_per_user')
          .select('*');
        
        if (userTicketsError) throw userTicketsError;
        setTicketsPerUser(userTicketsData || []);

        // Fetch tickets per user by status
        const { data: userStatusData, error: userStatusError } = await supabase
          .from('tickets_per_user_status')
          .select('*');
        
        if (userStatusError) throw userStatusError;
        setTicketsPerUserStatus(userStatusData || []);

        // Fetch hourly distribution
        const { data: hourlyData, error: hourlyError } = await supabase
          .from('ticket_hourly_distribution')
          .select('*');
        
        if (hourlyError) throw hourlyError;
        setHourlyDistribution(hourlyData || []);

        // Fetch average resolution time
        const { data: avgTimeData, error: avgTimeError } = await supabase
          .from('average_resolution_time')
          .select('*');
        
        if (avgTimeError) throw avgTimeError;
        if (avgTimeData && avgTimeData.length > 0) {
          setAvgResolutionTime(avgTimeData[0].avg_resolution_time);
        }

      } catch (error) {
        console.error('Error fetching report data:', error);
        toast({
          title: "Rapor Verileri Yüklenemedi",
          description: "Rapor verileri alınırken bir hata oluştu",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [toast]);

  // Format the average resolution time to be more readable
  const formatResolutionTime = (time: string | null) => {
    if (!time) return 'Veri yok';
    
    // Extract days, hours, minutes from the interval string
    const matches = time.match(/(?:(\d+) days? )?(?:(\d+):(\d+):(\d+))?/);
    if (!matches) return time;
    
    const days = matches[1] ? parseInt(matches[1]) : 0;
    const hours = matches[2] ? parseInt(matches[2]) : 0;
    const minutes = matches[3] ? parseInt(matches[3]) : 0;
    
    const parts = [];
    if (days > 0) parts.push(`${days} gün`);
    if (hours > 0) parts.push(`${hours} saat`);
    if (minutes > 0) parts.push(`${minutes} dakika`);
    
    return parts.join(' ');
  };

  // Function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Belirtilmemiş';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Rapor verileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="status">Durum Dağılımı</TabsTrigger>
          <TabsTrigger value="departments">Departmanlar</TabsTrigger>
          <TabsTrigger value="users">Kullanıcı Analizi</TabsTrigger>
          <TabsTrigger value="summary">Tam Liste</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Tickets Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Toplam Talep</CardTitle>
                <CardDescription>Sistemdeki toplam talep sayısı</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{ticketSummary.length}</p>
              </CardContent>
            </Card>

            {/* Resolution Rate Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Çözüm Oranı</CardTitle>
                <CardDescription>Çözülen taleplerin oranı</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">
                  {statusSummary.length > 0 
                    ? `${Math.round((statusSummary.find(s => s.status === 'Çözüldü')?.ticket_count || 0) / 
                      statusSummary.reduce((acc, curr) => acc + (curr.ticket_count || 0), 0) * 100)}%`
                    : '0%'}
                </p>
              </CardContent>
            </Card>

            {/* Average Resolution Time Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Ortalama Çözüm Süresi</CardTitle>
                <CardDescription>Taleplerin ortalama çözüm süresi</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatResolutionTime(avgResolutionTime)}</p>
              </CardContent>
            </Card>

            {/* Recent Tickets Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Son 7 Gün</CardTitle>
                <CardDescription>Son 7 günde açılan talepler</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{recentTickets.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Status and Priority Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Durum Dağılımı</CardTitle>
                <CardDescription>Taleplerin duruma göre dağılımı</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer 
                  config={{
                    'Açık': { color: STATUS_COLORS['Açık'] },
                    'İşlemde': { color: STATUS_COLORS['İşlemde'] },
                    'Çözüldü': { color: STATUS_COLORS['Çözüldü'] },
                    'Çözülemedi': { color: STATUS_COLORS['Çözülemedi'] },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={statusSummary}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="ticket_count"
                      nameKey="status"
                      label={({ status, ticket_count, percent }) => 
                        `${status}: ${ticket_count} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {statusSummary.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Öncelik Dağılımı</CardTitle>
                <CardDescription>Taleplerin önceliğe göre dağılımı</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer
                  config={{
                    'Çok Önemli': { color: '#ef4444' },
                    'Önemli': { color: '#f97316' },
                    'İkincil': { color: '#3b82f6' },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={priorityDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="ticket_count"
                      nameKey="priority"
                      label={({ priority, ticket_count, percent }) => 
                        `${priority}: ${ticket_count} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {priorityDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.priority === 'Çok Önemli' 
                            ? '#ef4444' 
                            : entry.priority === 'Önemli' 
                              ? '#f97316' 
                              : '#3b82f6'} 
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Hourly Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Saatlik Dağılım</CardTitle>
              <CardDescription>Taleplerin saate göre dağılımı</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ChartContainer config={{}}>
                <BarChart data={hourlyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour_of_day"
                    label={{ value: 'Saat', position: 'insideBottom', offset: -5 }}
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis
                    label={{ value: 'Talep Sayısı', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} talep`, 'Talep Sayısı']}
                    labelFormatter={(hour) => `Saat: ${hour}:00`}
                  />
                  <Legend />
                  <Bar dataKey="ticket_count" name="Talep Sayısı" fill="#3b82f6" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status Tab */}
        <TabsContent value="status">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Durum Özeti</CardTitle>
                <CardDescription>Taleplerin durum dağılımı</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">Talep Sayısı</TableHead>
                      <TableHead className="text-right">Yüzde</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statusSummary.map((item) => {
                      const total = statusSummary.reduce((acc, curr) => acc + (curr.ticket_count || 0), 0);
                      const percentage = total > 0 ? (item.ticket_count / total) * 100 : 0;
                      return (
                        <TableRow key={item.status}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || '#888' }}
                            ></div>
                            {item.status}
                          </TableCell>
                          <TableCell className="text-right">{item.ticket_count}</TableCell>
                          <TableCell className="text-right">{percentage.toFixed(1)}%</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">Toplam</TableCell>
                      <TableCell className="text-right font-bold">
                        {statusSummary.reduce((acc, curr) => acc + (curr.ticket_count || 0), 0)}
                      </TableCell>
                      <TableCell className="text-right font-bold">100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Öncelik Özeti</CardTitle>
                <CardDescription>Taleplerin öncelik dağılımı</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Öncelik</TableHead>
                      <TableHead className="text-right">Talep Sayısı</TableHead>
                      <TableHead className="text-right">Yüzde</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {priorityDistribution.map((item) => {
                      const total = priorityDistribution.reduce((acc, curr) => acc + (curr.ticket_count || 0), 0);
                      const percentage = total > 0 ? (item.ticket_count / total) * 100 : 0;
                      return (
                        <TableRow key={item.priority}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: item.priority === 'Çok Önemli' 
                                  ? '#ef4444' 
                                  : item.priority === 'Önemli' 
                                    ? '#f97316' 
                                    : '#3b82f6'
                              }}
                            ></div>
                            {item.priority}
                          </TableCell>
                          <TableCell className="text-right">{item.ticket_count}</TableCell>
                          <TableCell className="text-right">{percentage.toFixed(1)}%</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">Toplam</TableCell>
                      <TableCell className="text-right font-bold">
                        {priorityDistribution.reduce((acc, curr) => acc + (curr.ticket_count || 0), 0)}
                      </TableCell>
                      <TableCell className="text-right font-bold">100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Departman Analizi</CardTitle>
              <CardDescription>Departmanlara göre talep dağılımı</CardDescription>
            </CardHeader>
            <CardContent className="h-[600px]">
              <ChartContainer config={{}}>
                <BarChart
                  data={departmentDistribution}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 220, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="created_by_department" 
                    width={200}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} talep`, 'Talep Sayısı']}
                  />
                  <Legend />
                  <Bar dataKey="ticket_count" name="Talep Sayısı" fill="#8884d8" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı Bazlı Analiz</CardTitle>
              <CardDescription>Atanan kişi bazında talep dağılımı</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ChartContainer config={{}}>
                <BarChart data={ticketsPerUser}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="assigned_to" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} talep`, 'Talep Sayısı']}
                  />
                  <Legend />
                  <Bar dataKey="ticket_count" name="Talep Sayısı" fill="#8884d8" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı-Durum Analizi</CardTitle>
              <CardDescription>Atanan kişi ve duruma göre dağılım</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Atanan Kişi</TableHead>
                    <TableHead className="text-right">Durum</TableHead>
                    <TableHead className="text-right">Talep Sayısı</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketsPerUserStatus.map((item, index) => (
                    <TableRow key={`${item.assigned_to}-${item.status}-${index}`}>
                      <TableCell className="font-medium">{item.assigned_to}</TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || '#888' }}
                        ></div>
                        {item.status}
                      </TableCell>
                      <TableCell className="text-right">{item.ticket_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Talep Özeti</CardTitle>
              <CardDescription>Tüm taleplerin özet listesi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Başlık</TableHead>
                      <TableHead>Atanan Kişi</TableHead>
                      <TableHead>Oluşturulma Tarihi</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Çözüm Tarihi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ticketSummary.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id.substring(0, 8)}...</TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{ticket.assigned_to}</TableCell>
                        <TableCell>{formatDate(ticket.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: STATUS_COLORS[ticket.status as keyof typeof STATUS_COLORS] || '#888' }}
                            ></div>
                            {ticket.status}
                          </div>
                        </TableCell>
                        <TableCell>{ticket.resolved_at ? formatDate(ticket.resolved_at) : 'Çözülmedi'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportPanel;
