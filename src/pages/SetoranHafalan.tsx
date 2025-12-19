import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Download, Edit, Trash2, BookOpen, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { JuzSelector } from "@/components/JuzSelector";
import { getSurahsByJuz, Surah } from "@/lib/quran-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data for setoran
const mockSetoran = [
  { id: 1, tanggal: "15/12/2025", santri: "Muhammad Faiz", ustadz: "Ustadz Ahmad Fauzi", juz: 3, ayatDari: 101, ayatSampai: 200, nilai: 95, status: "Lancar", catatan: "Sempurna!" },
  { id: 2, tanggal: "13/12/2025", santri: "Fatimah Zahra", ustadz: "Ustadz Budi Santoso", juz: 4, ayatDari: 1, ayatSampai: 70, nilai: 96, status: "Lancar", catatan: "Allahu Akbar" },
  { id: 3, tanggal: "12/12/2025", santri: "Muhammad Faiz", ustadz: "Ustadz Ahmad Fauzi", juz: 3, ayatDari: 51, ayatSampai: 100, nilai: 92, status: "Lancar", catatan: "Masya Allah" },
  { id: 4, tanggal: "11/12/2025", santri: "Aisyah Nur", ustadz: "Ustadz Muhammad Yusuf", juz: 3, ayatDari: 1, ayatSampai: 70, nilai: 95, status: "Lancar", catatan: "Allahu Akbar" },
  { id: 5, tanggal: "09/12/2025", santri: "Fatimah Zahra", ustadz: "Ustadz Budi Santoso", juz: 3, ayatDari: 61, ayatSampai: 130, nilai: 78, status: "Kurang", catatan: "Barakallah" },
  { id: 6, tanggal: "07/12/2025", santri: "Muhammad Faiz", ustadz: "Ustadz Ahmad Fauzi", juz: 3, ayatDari: 1, ayatSampai: 50, nilai: 85, status: "Lancar", catatan: "Baik sekali" },
];

const mockSantri = [
  { id: "1", nama: "Muhammad Faiz", nis: "S001", halaqoh: "Halaqoh Al-Azhary" },
  { id: "2", nama: "Fatimah Zahra", nis: "S003", halaqoh: "Halaqoh Al-Furqon" },
  { id: "3", nama: "Aisyah Nur", nis: "S002", halaqoh: "Halaqoh Al-Azhary" },
];

const BATAS_LANCAR_SETORAN = 80;

function tentukanStatusSetoran(nilai: number): "Lancar" | "Kurang" {
  return nilai >= BATAS_LANCAR_SETORAN ? "Lancar" : "Kurang";
}

const SetoranHafalan = () => {
  const [filterJuz, setFilterJuz] = useState("all");
  const [filterSantri, setFilterSantri] = useState("all");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [selectedSantri, setSelectedSantri] = useState("");
  const [tanggalSetoran, setTanggalSetoran] = useState<Date>();
  const [modePilihan, setModePilihan] = useState("surah");
  const [juz, setJuz] = useState("");
  const [surah, setSurah] = useState("");
  const [ayatDari, setAyatDari] = useState("1");
  const [ayatSampai, setAyatSampai] = useState("7");
  const [jumlahKesalahan, setJumlahKesalahan] = useState("0");
  const [catatanTajwid, setCatatanTajwid] = useState("");

  const selectedSantriData = mockSantri.find(s => s.id === selectedSantri);
  
  // Surah by Juz
  const surahByJuz: Surah[] = useMemo(() => {
    if (!juz) return [];
    return getSurahsByJuz(Number(juz));
  }, [juz]);

  // Selected Surah
  const selectedSurah = useMemo(() => {
    return surahByJuz.find(s => s.number === Number(surah));
  }, [surah, surahByJuz]);

  // Nilai Kelancaran
  const nilaiKelancaran = Math.max(0, 100 - parseInt(jumlahKesalahan || "0"));
  const selisihNilai = Math.max(0, BATAS_LANCAR_SETORAN - nilaiKelancaran);

  const handleExport = () => {
    toast.success("Data setoran berhasil diexport!");
  };

  const handleSubmit = () => {
    if (!tanggalSetoran || !selectedSantriData) return;

    // 🔹 hitung nilai & status
    const nilai = nilaiKelancaran;
    const status = tentukanStatusSetoran(nilai);

    // 🔹 DATA BARU
    const dataBaru = {
      id: Date.now(),
      tanggal: format(tanggalSetoran, "dd/MM/yyyy"),
      santri: selectedSantriData.nama,
      ustadz: "Ustadz Penguji",
      juz: Number(juz),
      ayatDari: Number(ayatDari),
      ayatSampai: Number(ayatSampai),
      nilai,
      status,
      selisih: status === "Kurang" ? selisihNilai : 0,
      catatan: catatanTajwid,
    };

    console.log("SETORAN BARU:", dataBaru);

    toast.success(
      status === "Lancar"
        ? "Setoran lancar, bisa ditingkatkan lagi 💪"
        : `Setoran dicatat, kurang ${selisihNilai} poin ✍️`
    );

    setIsDialogOpen(false);

    // 🔹 reset form
    setSelectedSantri("");
    setTanggalSetoran(undefined);
    setJuz("");
    setSurah("");
    setAyatDari("1");
    setAyatSampai("7");
    setJumlahKesalahan("0");
    setCatatanTajwid("");
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
                <Button className="bg-gradient-to-r from-green-500 to-lime-500">
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
                          <Label>Tanggal Setoran *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !tanggalSetoran && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {tanggalSetoran ? format(tanggalSetoran, "dd/MM/yyyy") : "Pilih tanggal"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={tanggalSetoran}
                                onSelect={setTanggalSetoran}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
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

                      {/* Surah Selection Card */}
                      <Card className="border-dashed border-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Surah #1</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Nama Surah *</Label>
                            <Select
                              value={surah}
                              onValueChange={setSurah}
                              disabled={!juz}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={juz ? "Pilih surah" : "Pilih juz dulu"} />
                              </SelectTrigger>
                              <SelectContent>
                                {surahByJuz.map((s) => (
                                  <SelectItem key={s.number} value={String(s.number)}>
                                    {s.number}. {s.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              Menampilkan surah dalam Juz {juz || "-"}
                            </p>
                          </div>

                          {selectedSurah && (
                            <div className="p-2 bg-primary/10 rounded border border-primary/20">
                              <p className="text-sm">
                                {selectedSurah.name} ({selectedSurah.arabicName}) – Jumlah ayat:{" "}
                                {selectedSurah.numberOfAyahs}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs">Ayat Dari *</Label>
                              <Input
                                type="number"
                                min={1}
                                max={selectedSurah?.numberOfAyahs}
                                value={ayatDari}
                                onChange={(e) => setAyatDari(e.target.value)}
                                disabled={!selectedSurah}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Ayat Sampai *</Label>
                              <Input
                                type="number"
                                min={Number(ayatDari)}
                                max={selectedSurah?.numberOfAyahs}
                                value={ayatSampai}
                                onChange={(e) => setAyatSampai(e.target.value)}
                                disabled={!selectedSurah}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Button variant="outline" className="w-full border-dashed">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Surah Lain
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Penilaian Section */}
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-4">Penilaian</h4>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Jumlah Kesalahan *</Label>
                        <Input 
                          type="number" 
                          value={jumlahKesalahan}
                          onChange={(e) => setJumlahKesalahan(e.target.value)}
                          min="0"
                        />
                        <p className="text-xs text-muted-foreground">Setiap kesalahan mengurangi 1 poin dari nilai 100</p>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <Label>Nilai Kelancaran</Label>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-primary">{nilaiKelancaran}</span>

                          {nilaiKelancaran < BATAS_LANCAR_SETORAN && (
                            <p className="text-xs text-yellow-600">
                              Kurang {selisihNilai} poin dari batas lancar
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Catatan Tajwid *</Label>
                        <Textarea 
                          placeholder="Contoh: Bacaan ikhfa perlu diperbaiki, mad wajib sudah baik..."
                          value={catatanTajwid}
                          onChange={(e) => setCatatanTajwid(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

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
          <CardContent className="overflow-hidden">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Select value={filterJuz} onValueChange={setFilterJuz}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Juz" />
                </SelectTrigger>

                <SelectContent className="p-2">
                  {/* item default */}
                  <SelectItem value="all">Semua Juz</SelectItem>

                  {/* grid juz */}
                  <div className="grid grid-cols-6 gap-1 mt-2">
                    {Array.from({ length: 30 }, (_, i) => (
                      <SelectItem
                        key={i + 1}
                        value={String(i + 1)}
                        className="justify-center"
                      >
                        {i + 1}
                      </SelectItem>
                    ))}
                  </div>
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
            <div className="relative -mx-4 sm:-mx-6 overflow-x-auto">
              <div className="px-4 sm:px-6">
                <div className="rounded-md border">
                  <Table className="min-w-[900px]">
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
                            <Badge
                              className={
                                item.status === "Lancar"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-yellow-500 hover:bg-yellow-600"
                              }
                            >
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SetoranHafalan;
