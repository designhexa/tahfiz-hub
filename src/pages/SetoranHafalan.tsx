import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download, Edit, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { JuzSelector } from "@/components/JuzSelector";

// Mock data for setoran
const mockSetoran = [
  { id: 1, tanggal: "15/12/2025", santri: "Muhammad Faiz", ustadz: "Ustadz Ahmad Fauzi", juz: 3, ayatDari: 101, ayatSampai: 200, nilai: 95, status: "Lancar", catatan: "Sempurna!" },
  { id: 2, tanggal: "13/12/2025", santri: "Fatimah Zahra", ustadz: "Ustadz Budi Santoso", juz: 4, ayatDari: 1, ayatSampai: 70, nilai: 96, status: "Lancar", catatan: "Allahu Akbar" },
  { id: 3, tanggal: "12/12/2025", santri: "Muhammad Faiz", ustadz: "Ustadz Ahmad Fauzi", juz: 3, ayatDari: 51, ayatSampai: 100, nilai: 92, status: "Lancar", catatan: "Masya Allah" },
  { id: 4, tanggal: "11/12/2025", santri: "Aisyah Nur", ustadz: "Ustadz Muhammad Yusuf", juz: 3, ayatDari: 1, ayatSampai: 70, nilai: 95, status: "Lancar", catatan: "Allahu Akbar" },
  { id: 5, tanggal: "09/12/2025", santri: "Fatimah Zahra", ustadz: "Ustadz Budi Santoso", juz: 3, ayatDari: 61, ayatSampai: 130, nilai: 94, status: "Lancar", catatan: "Barakallah" },
  { id: 6, tanggal: "07/12/2025", santri: "Muhammad Faiz", ustadz: "Ustadz Ahmad Fauzi", juz: 3, ayatDari: 1, ayatSampai: 50, nilai: 85, status: "Lancar", catatan: "Baik sekali" },
];

const mockSantri = [
  { id: "1", nama: "Muhammad Faiz", nis: "S001", halaqoh: "Halaqoh Al-Azhary" },
  { id: "2", nama: "Fatimah Zahra", nis: "S003", halaqoh: "Halaqoh Al-Furqon" },
  { id: "3", nama: "Aisyah Nur", nis: "S002", halaqoh: "Halaqoh Al-Azhary" },
];

const SetoranHafalan = () => {
  const [filterJuz, setFilterJuz] = useState("all");
  const [filterSantri, setFilterSantri] = useState("all");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [selectedSantri, setSelectedSantri] = useState("");
  const [tanggalSetoran, setTanggalSetoran] = useState("");
  const [modePilihan, setModePilihan] = useState("halaman");
  const [juz, setJuz] = useState("");
  const [halamanDari, setHalamanDari] = useState("1");
  const [halamanSampai, setHalamanSampai] = useState("5");
  const [nilaiKelancaran, setNilaiKelancaran] = useState([0]);
  const [statusHafalan, setStatusHafalan] = useState("Lancar");
  const [catatan, setCatatan] = useState("");

  const selectedSantriData = mockSantri.find(s => s.id === selectedSantri);
  const totalHalaman = parseInt(halamanSampai || "0") - parseInt(halamanDari || "0") + 1;
  const estimasiAyat = totalHalaman * 10; // Rough estimate

  const handleExport = () => {
    toast.success("Data setoran berhasil diexport!");
  };

  const handleSubmit = () => {
    toast.success("Setoran hafalan berhasil ditambahkan!");
    setIsDialogOpen(false);
    // Reset form
    setSelectedSantri("");
    setTanggalSetoran("");
    setJuz("");
    setHalamanDari("1");
    setHalamanSampai("5");
    setNilaiKelancaran([0]);
    setStatusHafalan("Lancar");
    setCatatan("");
  };

  const handleDelete = (id: number) => {
    toast.success("Setoran berhasil dihapus!");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Setoran Hafalan</h1>
            <p className="text-muted-foreground">Kelola dan catat setoran hafalan Al-Qur'an santri</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Setoran
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Tambah Setoran Hafalan
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Informasi Santri */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <span className="text-muted-foreground">👤</span> Informasi Santri
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Pilih Santri *</Label>
                          <Select value={selectedSantri} onValueChange={setSelectedSantri}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih santri" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockSantri.map(santri => (
                                <SelectItem key={santri.id} value={santri.id}>
                                  {santri.nama} - {santri.nis}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Tanggal Setoran</Label>
                          <Input 
                            type="date" 
                            value={tanggalSetoran}
                            onChange={(e) => setTanggalSetoran(e.target.value)}
                          />
                        </div>
                      </div>
                      {selectedSantriData && (
                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                          <p className="text-sm">Halaqoh: <span className="font-medium">{selectedSantriData.halaqoh}</span></p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Detail Hafalan */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        Detail Hafalan
                      </CardTitle>
                      <CardDescription>Pilih mode setoran dan detail hafalan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Mode Pilihan *</Label>
                          <Select value={modePilihan} onValueChange={setModePilihan}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="surah">📖 Pilih per Surah & Ayat</SelectItem>
                              <SelectItem value="halaman">📄 Pilih per Halaman</SelectItem>
                            </SelectContent>
                          </Select>
                      </div>
                      
                      <JuzSelector value={juz} onValueChange={setJuz} required />

                      <div className="space-y-2">
                        <Label>Pilih Halaman *</Label>
                        <p className="text-xs text-muted-foreground">Al-Qur'an memiliki 604 halaman (Mushaf Utsmani)</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs">Halaman Dari</Label>
                            <Input 
                              type="number" 
                              value={halamanDari}
                              onChange={(e) => setHalamanDari(e.target.value)}
                              min="1" 
                              max="604"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Halaman Sampai</Label>
                            <Input 
                              type="number" 
                              value={halamanSampai}
                              onChange={(e) => setHalamanSampai(e.target.value)}
                              min="1" 
                              max="604"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">Total Halaman: <span className="font-medium">{totalHalaman} halaman</span></p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                        <p className="text-sm">Total Ayat (Estimasi):</p>
                        <Badge className="bg-primary">{estimasiAyat} Ayat</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Penilaian Kelancaran */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <span>⭐</span> Penilaian Kelancaran
                      </CardTitle>
                      <CardDescription>Berikan penilaian berdasarkan kelancaran hafalan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Nilai Kelancaran (0-100)</Label>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                            {nilaiKelancaran[0]}
                          </Badge>
                        </div>
                        <Slider
                          value={nilaiKelancaran}
                          onValueChange={setNilaiKelancaran}
                          max={100}
                          step={1}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Kurang</span>
                          <span>Cukup</span>
                          <span>Baik</span>
                          <span>Sangat Baik</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Status Hafalan</Label>
                        <Select value={statusHafalan} onValueChange={setStatusHafalan}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Lancar">✅ Lancar</SelectItem>
                            <SelectItem value="Ulangi">🔄 Ulangi</SelectItem>
                            <SelectItem value="Salah">❌ Salah</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Catatan (Opsional)</Label>
                        <Textarea 
                          placeholder="Masukkan catatan tambahan..."
                          value={catatan}
                          onChange={(e) => setCatatan(e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90">
                    Simpan Setoran
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Setoran</CardTitle>
            <CardDescription>Riwayat setoran hafalan santri</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Select value={filterJuz} onValueChange={setFilterJuz}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Juz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Juz</SelectItem>
                  {Array.from({ length: 30 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>Juz {i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterSantri} onValueChange={setFilterSantri}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Santri" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Santri</SelectItem>
                  {mockSantri.map(santri => (
                    <SelectItem key={santri.id} value={santri.id}>{santri.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
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

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Santri</TableHead>
                    <TableHead>Ustadz</TableHead>
                    <TableHead>Juz</TableHead>
                    <TableHead>Ayat</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSetoran.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.tanggal}</TableCell>
                      <TableCell className="font-medium">{item.santri}</TableCell>
                      <TableCell>{item.ustadz}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                          Juz {item.juz}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.ayatDari}-{item.ayatSampai}</TableCell>
                      <TableCell className="font-semibold text-primary">{item.nilai}</TableCell>
                      <TableCell>
                        <Badge className={
                          item.status === "Lancar" 
                            ? "bg-green-500 hover:bg-green-600" 
                            : item.status === "Ulangi" 
                            ? "bg-yellow-500 hover:bg-yellow-600" 
                            : "bg-red-500 hover:bg-red-600"
                        }>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.catatan}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

export default SetoranHafalan;
