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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Plus, CheckCircle, Trash2, User, Calendar, BookOpen, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { JuzSelector } from "@/components/JuzSelector";
import { getSurahsByJuz, Surah } from "@/lib/quran-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data
const mockTasmiStats = {
  total: 8,
  manzil1: 5,
  manzil2: 2,
  manzil3: 0,
  manzil4: 0,
  manzil5: 0,
};

const mockTasmiData = [
  {
    id: 1,
    santri: "Fatimah Zahra",
    nis: "S003",
    halaqoh: "Halaqoh Al-Furqon",
    manzil: 1,
    mode: "1 Halaman",
    tanggal: "5/12/2025",
    ustadz: "Ustadz Budi Santoso",
    kelancaran: 93,
    kesalahan: 7,
    juz: 2,
    catatan: "Masya Allah tabarakallah. Siap manzil 3. Terus istiqomah.",
    lulus: true,
  },
  {
    id: 2,
    santri: "Muhammad Faiz",
    nis: "S001",
    halaqoh: "Halaqoh Al-Azhary",
    manzil: 2,
    mode: "5 Halaman",
    tanggal: "3/12/2025",
    ustadz: "Ustadz Ahmad Fauzi",
    kelancaran: 74,
    kesalahan: 12,
    juz: 3,
    catatan: "Perlu perbaikan di tajwid. Semangat!",
    lulus: false,
  },
  {
    id: 3,
    santri: "Aisyah Nur",
    nis: "S002",
    halaqoh: "Halaqoh Al-Azhary",
    manzil: 1,
    mode: "Per 3-5 Baris",
    tanggal: "1/12/2025",
    ustadz: "Ustadz Muhammad Yusuf",
    kelancaran: 95,
    kesalahan: 5,
    juz: 1,
    catatan: "Sangat baik! Lanjutkan ke tahap berikutnya.",
    lulus: true,
  },
];

const mockSantri = [
  { id: "1", nama: "Muhammad Faiz", nis: "S001" },
  { id: "2", nama: "Fatimah Zahra", nis: "S003" },
  { id: "3", nama: "Aisyah Nur", nis: "S002" },
];

const surahList = [
  { nomor: 1, nama: "Al-Fatihah", jumlahAyat: 7 },
  { nomor: 2, nama: "Al-Baqarah", jumlahAyat: 286 },
  { nomor: 3, nama: "Ali 'Imran", jumlahAyat: 200 },
  // Add more surahs as needed
];

const TasmiMarhalah = () => {
  const [filterSantri, setFilterSantri] = useState("all");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [activeTab, setActiveTab] = useState("semua");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [selectedSantri, setSelectedSantri] = useState("");
  const [tanggalTasmi, setTanggalTasmi] = useState<Date>();
  const [manzil, setManzil] = useState("");
  const [modePilihan, setModePilihan] = useState("surah");
  const [juz, setJuz] = useState("");
  const [surah, setSurah] = useState("");
  const [ayatDari, setAyatDari] = useState("1");
  const [ayatSampai, setAyatSampai] = useState("7");
  const [jumlahKesalahan, setJumlahKesalahan] = useState("0");
  const [catatanTajwid, setCatatanTajwid] = useState("");

  // =========================
  // 1️⃣ SURAH BY JUZ (DULU)
  // =========================
  const surahByJuz: Surah[] = useMemo(() => {
    if (!juz) return [];
    return getSurahsByJuz(Number(juz));
  }, [juz]);

  // =========================
  // 2️⃣ SELECTED SURAH
  // =========================
  const selectedSurah = useMemo(() => {
    return surahByJuz.find(s => s.number === Number(surah));
  }, [surah, surahByJuz]);

  // =========================
  // 3️⃣ NILAI
  // =========================
  const nilaiKelancaran = Math.max(
    0,
    100 - parseInt(jumlahKesalahan || "0")
  );

  const handleSubmit = () => {
    toast.success("Tasmi' marhalah berhasil ditambahkan!");
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    toast.success("Tasmi' berhasil dihapus!");
  };

  const filteredData = mockTasmiData.filter(item => {
    if (activeTab !== "semua" && `manzil${item.manzil}` !== activeTab)
      return false;
    return true;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tasmi' Marhalah</h1>
            <p className="text-muted-foreground">Kelola tasmi' marhalah (ujian tahapan hafalan) santri</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-lime-500">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Tasmi'
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Tasmi' Marhalah</DialogTitle>
                <p className="text-sm text-muted-foreground">Masukkan penilaian tasmi' marhalah untuk santri</p>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
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
                            {santri.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Tasmi' *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !tanggalTasmi && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {tanggalTasmi ? format(tanggalTasmi, "dd/MM/yyyy") : "Pilih tanggal"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={tanggalTasmi}
                          onSelect={setTanggalTasmi}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Manzil *</Label>
                  <Select value={manzil} onValueChange={setManzil}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih manzil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Manzil 1 - Per 3-5 Baris</SelectItem>
                      <SelectItem value="2">Manzil 2 - Per Halaman</SelectItem>
                      <SelectItem value="3">Manzil 3 - Per 5 Halaman</SelectItem>
                      <SelectItem value="4">Manzil 4 - Per 1/2 Juz</SelectItem>
                      <SelectItem value="5">Manzil 5 - Per Juz (Tasmi')</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                          min={ayatDari}
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
                      <span className="text-2xl font-bold text-primary">{nilaiKelancaran}</span>
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
                  Simpan Tasmi'
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Tasmi'</p>
              <p className="text-2xl font-bold text-primary">{mockTasmiStats.total}</p>
            </CardContent>
          </Card>
          {[1, 2, 3, 4, 5].map((manzilNum) => (
            <Card key={manzilNum} className="border-l-4 border-l-primary/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Manzil {manzilNum}</p>
                <p className={`text-2xl font-bold ${
                  mockTasmiStats[`manzil${manzilNum}` as keyof typeof mockTasmiStats] > 0 
                    ? "text-primary" 
                    : "text-destructive"
                }`}>
                  {mockTasmiStats[`manzil${manzilNum}` as keyof typeof mockTasmiStats]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Filter Santri</Label>
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
              </div>
              <div className="space-y-2">
                <Label>Filter Halaqoh</Label>
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
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="semua">Semua</TabsTrigger>
            <TabsTrigger value="manzil1">Manzil 1</TabsTrigger>
            <TabsTrigger value="manzil2">Manzil 2</TabsTrigger>
            <TabsTrigger value="manzil3">Manzil 3</TabsTrigger>
            <TabsTrigger value="manzil4">Manzil 4</TabsTrigger>
            <TabsTrigger value="manzil5">Manzil 5</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {filteredData.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{item.santri}</h3>
                        <Badge variant="outline">{item.nis}</Badge>
                        <Badge className="bg-primary">{item.halaqoh}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {item.mode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {item.tanggal}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {item.ustadz}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Kelancaran</span>
                          <span className="text-2xl font-bold text-primary">{item.kelancaran}/100</span>
                        </div>
                        <Progress value={item.kelancaran} className="h-2" />
                      </div>
                      
                      <div className="flex gap-8 mt-4 text-sm">
                        <span>Kesalahan: <strong>{item.kesalahan}</strong></span>
                        <span>Juz: <strong>{item.juz}</strong></span>
                      </div>
                      
                      <p className="mt-4 text-sm italic text-muted-foreground">"{item.catatan}"</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {item.lulus ? (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Lulus
                        </Badge>
                      ) : (
                        <Badge className="bg-lime-500 text-black hover:bg-yellow-600">
                          ⟳ Ulang
                        </Badge>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredData.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Belum ada data tasmi' untuk manzil ini</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TasmiMarhalah;
