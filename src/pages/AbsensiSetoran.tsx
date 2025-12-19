import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Download, Users, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

// Mock data
const mockSantri = [
  { id: "1", nama: "Muhammad Faiz", nis: "S001", halaqoh: "Halaqoh Al-Azhary" },
  { id: "2", nama: "Fatimah Zahra", nis: "S003", halaqoh: "Halaqoh Al-Furqon" },
  { id: "3", nama: "Aisyah Nur", nis: "S002", halaqoh: "Halaqoh Al-Azhary" },
  { id: "4", nama: "Ahmad Rasyid", nis: "S004", halaqoh: "Halaqoh Al-Furqon" },
  { id: "5", nama: "Khadijah Sari", nis: "S005", halaqoh: "Halaqoh Al-Azhary" },
];

const mockAbsensi = [
  { id: "1", tanggal: "2025-01-15", santriId: "1", status: "Hadir" },
  { id: "2", tanggal: "2025-01-15", santriId: "2", status: "Hadir" },
  { id: "3", tanggal: "2025-01-15", santriId: "3", status: "Izin" },
  { id: "4", tanggal: "2025-01-15", santriId: "4", status: "Sakit" },
  { id: "5", tanggal: "2025-01-15", santriId: "5", status: "Alfa" },
];

const AbsensiSetoran = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [absensiData, setAbsensiData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    mockAbsensi.forEach(a => {
      initial[a.santriId] = a.status;
    });
    return initial;
  });

  const statusOptions = [
    { value: "Hadir", label: "Hadir", icon: CheckCircle, color: "bg-green-500" },
    { value: "Izin", label: "Izin", icon: Clock, color: "bg-blue-500" },
    { value: "Sakit", label: "Sakit", icon: AlertCircle, color: "bg-yellow-500" },
    { value: "Alfa", label: "Alfa", icon: XCircle, color: "bg-red-500" },
  ];

  const handleStatusChange = (santriId: string, status: string) => {
    setAbsensiData(prev => ({ ...prev, [santriId]: status }));
  };

  const handleSaveAbsensi = () => {
    toast.success("Absensi berhasil disimpan!");
  };

  const handleExport = () => {
    toast.success("Data absensi berhasil diexport!");
  };

  const filteredSantri = mockSantri.filter(s => 
    filterHalaqoh === "all" || s.halaqoh.toLowerCase().includes(filterHalaqoh.toLowerCase())
  );

  // Calculate stats
  const stats = {
    total: filteredSantri.length,
    hadir: Object.values(absensiData).filter(s => s === "Hadir").length,
    izin: Object.values(absensiData).filter(s => s === "Izin").length,
    sakit: Object.values(absensiData).filter(s => s === "Sakit").length,
    alfa: Object.values(absensiData).filter(s => s === "Alfa").length,
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Absensi Setoran</h1>
            <p className="text-muted-foreground">Kelola absensi kehadiran setoran hafalan santri</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-green-500 to-lime-500" onClick={handleSaveAbsensi}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Simpan Absensi
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Santri</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-500">{stats.hadir}</p>
                  <p className="text-xs text-muted-foreground">Hadir</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-500">{stats.izin}</p>
                  <p className="text-xs text-muted-foreground">Izin</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-500">{stats.sakit}</p>
                  <p className="text-xs text-muted-foreground">Sakit</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">{stats.alfa}</p>
                  <p className="text-xs text-muted-foreground">Alfa</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Absensi Harian
            </CardTitle>
            <CardDescription>Input dan kelola absensi kehadiran setoran</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tanggal</label>
                <Input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Halaqoh</label>
                <Select value={filterHalaqoh} onValueChange={setFilterHalaqoh}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Halaqoh" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Halaqoh</SelectItem>
                    <SelectItem value="azhary">Halaqoh Al-Azhary</SelectItem>
                    <SelectItem value="furqon">Halaqoh Al-Furqon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>NIS</TableHead>
                    <TableHead>Nama Santri</TableHead>
                    <TableHead>Halaqoh</TableHead>
                    <TableHead className="text-center">Status Kehadiran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSantri.map((santri, index) => (
                    <TableRow key={santri.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{santri.nis}</TableCell>
                      <TableCell className="font-medium">{santri.nama}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{santri.halaqoh}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          {statusOptions.map((option) => (
                            <Button
                              key={option.value}
                              variant="outline"
                              size="sm"
                              className={
                                absensiData[santri.id] === option.value
                                  ? `!${option.color} !text-white border-transparent hover:opacity-90`
                                  : "text-muted-foreground"
                              }
                              onClick={() => handleStatusChange(santri.id, option.value)}
                            >
                              <option.icon
                                className={`w-3 h-3 mr-1 ${
                                  absensiData[santri.id] === option.value ? "text-white" : ""
                                }`}
                              />
                              {option.label}
                            </Button>

                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AbsensiSetoran;
