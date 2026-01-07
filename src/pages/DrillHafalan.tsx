import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  CheckCircle, 
  Search,
  CalendarIcon,
  ChevronRight,
  Lock,
  Unlock,
  Target,
  Eye,
  X,
  Award,
  AlertCircle,
  BookOpen,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { JuzSelector } from "@/components/JuzSelector";
import { getSurahsByJuz, Surah } from "@/lib/quran-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Types for drill progression
interface DrillSurahEntry {
  id: string;
  surahNumber: number;
  surahName: string;
  ayatDari: number;
  ayatSampai: number;
}

interface DrillResult {
  id: string;
  tanggal: Date;
  drillLevel: string;
  juz: number;
  surahs: DrillSurahEntry[];
  jumlahKesalahan: number;
  nilaiKelancaran: number;
  catatanTajwid: string;
  lulus: boolean;
}

interface DrillProgress {
  santriId: string;
  juz: number;
  drill1Completed: boolean;
  drill2Completed: boolean;
  drillHalfJuzCompleted: boolean;
  drillFirstHalfJuz: boolean;
  drillSecondHalfJuz: boolean;
  tasmi1JuzUnlocked: boolean;
  drillResults: DrillResult[];
}

// Mock data for santri drill progress
const mockSantriDrillProgress: DrillProgress[] = [
  {
    santriId: "1",
    juz: 30,
    drill1Completed: true,
    drill2Completed: true,
    drillHalfJuzCompleted: true,
    drillFirstHalfJuz: true,
    drillSecondHalfJuz: false,
    tasmi1JuzUnlocked: false,
    drillResults: [
      {
        id: "dr1",
        tanggal: new Date("2025-01-02"),
        drillLevel: "drill1",
        juz: 30,
        surahs: [
          { id: "s1", surahNumber: 78, surahName: "An-Naba'", ayatDari: 1, ayatSampai: 40 },
          { id: "s2", surahNumber: 79, surahName: "An-Nazi'at", ayatDari: 1, ayatSampai: 46 },
        ],
        jumlahKesalahan: 5,
        nilaiKelancaran: 95,
        catatanTajwid: "Perhatikan mad lazim",
        lulus: true,
      },
      {
        id: "dr2",
        tanggal: new Date("2025-01-05"),
        drillLevel: "drill2",
        juz: 30,
        surahs: [
          { id: "s3", surahNumber: 80, surahName: "'Abasa", ayatDari: 1, ayatSampai: 42 },
        ],
        jumlahKesalahan: 8,
        nilaiKelancaran: 92,
        catatanTajwid: "",
        lulus: true,
      },
    ],
  },
  {
    santriId: "2",
    juz: 30,
    drill1Completed: true,
    drill2Completed: false,
    drillHalfJuzCompleted: false,
    drillFirstHalfJuz: false,
    drillSecondHalfJuz: false,
    tasmi1JuzUnlocked: false,
    drillResults: [
      {
        id: "dr3",
        tanggal: new Date("2025-01-03"),
        drillLevel: "drill1",
        juz: 30,
        surahs: [
          { id: "s4", surahNumber: 78, surahName: "An-Naba'", ayatDari: 1, ayatSampai: 40 },
        ],
        jumlahKesalahan: 10,
        nilaiKelancaran: 90,
        catatanTajwid: "Perbaiki bacaan qalqalah",
        lulus: true,
      },
    ],
  },
  {
    santriId: "3",
    juz: 30,
    drill1Completed: false,
    drill2Completed: false,
    drillHalfJuzCompleted: false,
    drillFirstHalfJuz: false,
    drillSecondHalfJuz: false,
    tasmi1JuzUnlocked: false,
    drillResults: [],
  },
];

const mockSantri = [
  { id: "1", nama: "Muhammad Faiz", nis: "S001", halaqoh: "Halaqoh Al-Azhary" },
  { id: "2", nama: "Fatimah Zahra", nis: "S003", halaqoh: "Halaqoh Al-Furqon" },
  { id: "3", nama: "Aisyah Nur", nis: "S002", halaqoh: "Halaqoh Al-Azhary" },
  { id: "4", nama: "Ahmad Rizky", nis: "S004", halaqoh: "Halaqoh Al-Azhary" },
  { id: "5", nama: "Ali Akbar", nis: "S005", halaqoh: "Halaqoh Al-Furqon" },
  { id: "6", nama: "Umar Faruq", nis: "S006", halaqoh: "Halaqoh Al-Hidayah" },
];

const halaqohOptions = ["Semua Halaqoh", "Halaqoh Al-Azhary", "Halaqoh Al-Furqon", "Halaqoh Al-Hidayah"];

const BATAS_LULUS = 88;
const BATAS_KESALAHAN = 12;

function tentukanStatus(kelancaran: number, kesalahan: number) {
  return kelancaran >= BATAS_LULUS && kesalahan <= BATAS_KESALAHAN;
}

const drillLevels = [
  { id: "drill1", name: "Drill 1", desc: "5 Halaman / 5 Surat", icon: "📘" },
  { id: "drill2", name: "Drill 2", desc: "5 Halaman berikutnya", icon: "📗" },
  { id: "drillHalfJuz", name: "Drill ½ Juz", desc: "10 Halaman", icon: "📙" },
  { id: "drillFirstHalf", name: "½ Juz Pertama", desc: "Setengah juz awal", icon: "📕" },
  { id: "drillSecondHalf", name: "½ Juz Kedua", desc: "Setengah juz akhir", icon: "📓" },
  { id: "tasmi1Juz", name: "Tasmi' 1 Juz", desc: "Ujian lengkap 1 juz", icon: "🏆" },
];

const getDrillLevelName = (levelId: string) => {
  return drillLevels.find(l => l.id === levelId)?.name || levelId;
};

const DrillHafalan = () => {
  const [search, setSearch] = useState("");
  const [filterHalaqoh, setFilterHalaqoh] = useState("Semua Halaqoh");
  const [selectedJuz, setSelectedJuz] = useState("30");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedSantriDetail, setSelectedSantriDetail] = useState<string | null>(null);
  
  // View state: "table" or "cards"
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedHalaqohForCards, setSelectedHalaqohForCards] = useState("");

  // Form state
  const [selectedSantri, setSelectedSantri] = useState("");
  const [tanggalDrill, setTanggalDrill] = useState<Date>();
  const [drillLevel, setDrillLevel] = useState("");
  const [juz, setJuz] = useState("");
  const [surahEntries, setSurahEntries] = useState<DrillSurahEntry[]>([
    { id: "1", surahNumber: 0, surahName: "", ayatDari: 1, ayatSampai: 7 }
  ]);
  const [jumlahKesalahan, setJumlahKesalahan] = useState("0");
  const [catatanTajwid, setCatatanTajwid] = useState("");

  const surahByJuz: Surah[] = useMemo(() => {
    if (!juz) return [];
    return getSurahsByJuz(Number(juz));
  }, [juz]);

  const nilaiKelancaran = Math.max(0, 100 - parseInt(jumlahKesalahan || "0"));

  // Get progress for a specific santri
  const getSantriProgress = (santriId: string) => {
    return mockSantriDrillProgress.find(p => p.santriId === santriId);
  };

  // Check if a drill level is unlocked for a santri
  const isDrillUnlocked = (progress: DrillProgress | undefined, level: string) => {
    if (!progress) return level === "drill1";
    
    switch (level) {
      case "drill1":
        return true;
      case "drill2":
        return progress.drill1Completed;
      case "drillHalfJuz":
        return progress.drill1Completed && progress.drill2Completed;
      case "drillFirstHalf":
        return progress.drillHalfJuzCompleted;
      case "drillSecondHalf":
        return progress.drillHalfJuzCompleted && progress.drillFirstHalfJuz;
      case "tasmi1Juz":
        return progress.drillFirstHalfJuz && progress.drillSecondHalfJuz;
      default:
        return false;
    }
  };

  // Filter santri based on search and halaqoh
  const filteredSantri = mockSantri.filter((santri) => {
    const matchSearch = santri.nama.toLowerCase().includes(search.toLowerCase()) ||
      santri.nis.toLowerCase().includes(search.toLowerCase());
    const matchHalaqoh = filterHalaqoh === "Semua Halaqoh" || santri.halaqoh === filterHalaqoh;
    return matchSearch && matchHalaqoh;
  });

  // Filter for card view
  const filteredSantriForCards = mockSantri.filter((santri) => {
    return santri.halaqoh === selectedHalaqohForCards;
  });

  // Get last drill info for a santri
  const getLastDrillInfo = (santriId: string) => {
    const progress = getSantriProgress(santriId);
    if (!progress || progress.drillResults.length === 0) {
      return { lastDrill: null, currentStage: "Drill 1", progressPercent: 0 };
    }
    
    const lastDrill = progress.drillResults[progress.drillResults.length - 1];
    
    let currentStage = "Drill 1";
    let progressPercent = 0;
    
    const stages = [
      progress.drill1Completed,
      progress.drill2Completed,
      progress.drillHalfJuzCompleted,
      progress.drillFirstHalfJuz,
      progress.drillSecondHalfJuz,
    ];
    
    const completed = stages.filter(Boolean).length;
    progressPercent = completed * 20;
    
    if (progress.drillFirstHalfJuz && progress.drillSecondHalfJuz) {
      currentStage = "Siap Tasmi'";
    } else if (progress.drillSecondHalfJuz) {
      currentStage = "Tasmi' 1 Juz";
    } else if (progress.drillFirstHalfJuz) {
      currentStage = "½ Juz Kedua";
    } else if (progress.drillHalfJuzCompleted) {
      currentStage = "½ Juz Pertama";
    } else if (progress.drill2Completed) {
      currentStage = "Drill ½ Juz";
    } else if (progress.drill1Completed) {
      currentStage = "Drill 2";
    }
    
    return { lastDrill, currentStage, progressPercent };
  };

  const handleAddSurahEntry = () => {
    setSurahEntries(prev => [
      ...prev,
      { id: Date.now().toString(), surahNumber: 0, surahName: "", ayatDari: 1, ayatSampai: 7 }
    ]);
  };

  const handleRemoveSurahEntry = (id: string) => {
    if (surahEntries.length > 1) {
      setSurahEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleSurahEntryChange = (id: string, field: keyof DrillSurahEntry, value: number | string) => {
    setSurahEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        if (field === "surahNumber") {
          const surah = surahByJuz.find(s => s.number === Number(value));
          return { 
            ...entry, 
            surahNumber: Number(value), 
            surahName: surah?.name || "",
            ayatDari: 1,
            ayatSampai: surah?.numberOfAyahs || 7
          };
        }
        return { ...entry, [field]: value };
      }
      return entry;
    }));
  };

  const handleSubmit = () => {
    const kelancaran = nilaiKelancaran;
    const kesalahan = Number(jumlahKesalahan);
    const lulus = tentukanStatus(kelancaran, kesalahan);

    toast.success(
      lulus
        ? "Drill lulus! Santri dapat melanjutkan ke tahap berikutnya."
        : "Drill perlu diulang. Semangat!"
    );

    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedSantri("");
    setTanggalDrill(undefined);
    setDrillLevel("");
    setJuz("");
    setSurahEntries([{ id: "1", surahNumber: 0, surahName: "", ayatDari: 1, ayatSampai: 7 }]);
    setJumlahKesalahan("0");
    setCatatanTajwid("");
  };

  const openDetailDialog = (santriId: string) => {
    setSelectedSantriDetail(santriId);
    setIsDetailDialogOpen(true);
  };

  const getSelectedSantriForDetail = () => {
    if (!selectedSantriDetail) return null;
    return mockSantri.find(s => s.id === selectedSantriDetail);
  };

  const getSelectedProgressForDetail = () => {
    if (!selectedSantriDetail) return null;
    return getSantriProgress(selectedSantriDetail);
  };

  const handleOpenCards = (halaqoh: string) => {
    setSelectedHalaqohForCards(halaqoh);
    setViewMode("cards");
  };

  const handleBackToTable = () => {
    setViewMode("table");
    setSelectedHalaqohForCards("");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Drill Hafalan</h1>
            <p className="text-sm md:text-base text-muted-foreground">Kelola tahapan drill hafalan santri dengan sistem checkpoint</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto bg-gradient-to-r from-green-500 to-lime-500">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Drill
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Drill Hafalan</DialogTitle>
                <DialogDescription>Masukkan penilaian drill hafalan untuk santri</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4">
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
                    <Label>Tanggal Drill *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !tanggalDrill && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {tanggalDrill ? format(tanggalDrill, "dd/MM/yyyy") : "Pilih tanggal"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={tanggalDrill}
                          onSelect={setTanggalDrill}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <JuzSelector value={juz} onValueChange={setJuz} required />

                <div className="space-y-2">
                  <Label>Level Drill *</Label>
                  <Select value={drillLevel} onValueChange={setDrillLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih level drill" />
                    </SelectTrigger>
                    <SelectContent>
                      {drillLevels.map(level => {
                        const progress = getSantriProgress(selectedSantri);
                        const unlocked = isDrillUnlocked(progress, level.id);
                        return (
                          <SelectItem 
                            key={level.id} 
                            value={level.id}
                            disabled={!unlocked}
                          >
                            <span className="flex items-center gap-2">
                              <span>{level.icon}</span>
                              <span>{level.name}</span>
                              {!unlocked && <Lock className="w-3 h-3 ml-1" />}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Multi Surah Selection */}
                <Card className="border-dashed border-primary/50 bg-primary/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Materi Drill</CardTitle>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleAddSurahEntry}
                        disabled={!juz}
                        className="h-7 text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Tambah Surat
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {surahEntries.map((entry, index) => {
                      const selectedSurah = surahByJuz.find(s => s.number === entry.surahNumber);
                      return (
                        <div key={entry.id} className="space-y-3 p-3 bg-background rounded-lg border relative">
                          {surahEntries.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveSurahEntry(entry.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">Surat {index + 1}</Badge>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">Nama Surah *</Label>
                            <Select 
                              value={entry.surahNumber ? String(entry.surahNumber) : ""} 
                              onValueChange={(v) => handleSurahEntryChange(entry.id, "surahNumber", v)}
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
                          </div>

                          {selectedSurah && (
                            <div className="p-2 bg-primary/10 rounded border border-primary/20">
                              <p className="text-xs">
                                {selectedSurah.name} ({selectedSurah.arabicName}) – {selectedSurah.numberOfAyahs} ayat
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Ayat Dari *</Label>
                              <Input
                                type="number"
                                min={1}
                                max={selectedSurah?.numberOfAyahs}
                                value={entry.ayatDari}
                                onChange={(e) => handleSurahEntryChange(entry.id, "ayatDari", Number(e.target.value))}
                                disabled={!selectedSurah}
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Ayat Sampai *</Label>
                              <Input
                                type="number"
                                min={entry.ayatDari}
                                max={selectedSurah?.numberOfAyahs}
                                value={entry.ayatSampai}
                                onChange={(e) => handleSurahEntryChange(entry.id, "ayatSampai", Number(e.target.value))}
                                disabled={!selectedSurah}
                                className="h-9"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Penilaian Section */}
                <div className="pt-4 border-t space-y-4">
                  <h4 className="font-semibold">Penilaian</h4>
                  
                  <div className="space-y-2">
                    <Label>Jumlah Kesalahan *</Label>
                    <Input 
                      type="number" 
                      value={jumlahKesalahan}
                      onChange={(e) => setJumlahKesalahan(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">Setiap kesalahan -1 poin dari 100</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <Label>Nilai Kelancaran</Label>
                    <span className={cn(
                      "text-2xl font-bold",
                      nilaiKelancaran >= BATAS_LULUS ? "text-green-600" : "text-destructive"
                    )}>
                      {nilaiKelancaran}
                    </span>
                  </div>

                  {/* Kunci Kelulusan Info */}
                  <Card className={cn(
                    "p-3 border-2",
                    nilaiKelancaran >= BATAS_LULUS 
                      ? "border-green-500 bg-green-50 dark:bg-green-950/30" 
                      : "border-destructive bg-destructive/10"
                  )}>
                    <div className="flex items-start gap-3">
                      {nilaiKelancaran >= BATAS_LULUS ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-sm">
                          {nilaiKelancaran >= BATAS_LULUS ? "Memenuhi syarat lulus" : "Belum memenuhi syarat lulus"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Batas lulus: Minimal nilai <strong>{BATAS_LULUS}</strong> dan maksimal <strong>{BATAS_KESALAHAN}</strong> kesalahan
                        </p>
                      </div>
                    </div>
                  </Card>

                  <div className="space-y-2">
                    <Label>Catatan Tajwid</Label>
                    <Textarea 
                      placeholder="Catatan perbaikan tajwid..."
                      value={catatanTajwid}
                      onChange={(e) => setCatatanTajwid(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90">
                  Simpan Drill
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {viewMode === "table" ? (
          /* Table View */
          <div className="bg-card rounded-lg border border-border p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari santri..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterHalaqoh} onValueChange={setFilterHalaqoh}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {halaqohOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedJuz} onValueChange={setSelectedJuz}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Juz" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>Juz {i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-muted-foreground">NIS</TableHead>
                    <TableHead className="text-muted-foreground">Nama Santri</TableHead>
                    <TableHead className="text-muted-foreground">Halaqoh</TableHead>
                    <TableHead className="text-muted-foreground">Tahap Saat Ini</TableHead>
                    <TableHead className="text-muted-foreground">Drill Terakhir</TableHead>
                    <TableHead className="text-muted-foreground">Nilai</TableHead>
                    <TableHead className="text-muted-foreground">Progress</TableHead>
                    <TableHead className="text-muted-foreground">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSantri.map((santri) => {
                    const { lastDrill, currentStage, progressPercent } = getLastDrillInfo(santri.id);
                    return (
                      <TableRow key={santri.id}>
                        <TableCell className="font-medium">{santri.nis}</TableCell>
                        <TableCell className="text-primary font-medium">{santri.nama}</TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-primary hover:underline"
                            onClick={() => handleOpenCards(santri.halaqoh)}
                          >
                            {santri.halaqoh}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {currentStage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {lastDrill ? (
                            <div className="text-sm">
                              <p className="font-medium">{getDrillLevelName(lastDrill.drillLevel)}</p>
                              <p className="text-xs text-muted-foreground">{format(lastDrill.tanggal, "dd/MM/yyyy")}</p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {lastDrill ? (
                            <Badge className={cn(
                              lastDrill.lulus ? "bg-green-500" : "bg-destructive"
                            )}>
                              {lastDrill.nilaiKelancaran}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progressPercent} className="h-2 w-16" />
                            <span className="text-xs text-muted-foreground">{progressPercent}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openDetailDialog(santri.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredSantri.map((santri) => {
                const { lastDrill, currentStage, progressPercent } = getLastDrillInfo(santri.id);
                return (
                  <Card key={santri.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-primary">{santri.nama}</p>
                        <p className="text-xs text-muted-foreground">{santri.nis} • {santri.halaqoh}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {currentStage}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Drill Terakhir</p>
                        <p className="font-medium">{lastDrill ? getDrillLevelName(lastDrill.drillLevel) : "-"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Nilai</p>
                        {lastDrill ? (
                          <Badge className={cn(
                            "text-xs",
                            lastDrill.lulus ? "bg-green-500" : "bg-destructive"
                          )}>
                            {lastDrill.nilaiKelancaran}
                          </Badge>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <Progress value={progressPercent} className="h-2" />
                        <span className="text-xs text-muted-foreground">{progressPercent}%</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="ml-3"
                        onClick={() => openDetailDialog(santri.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          /* Cards View - Per Halaqoh */
          <div className="space-y-4">
            <Button variant="outline" onClick={handleBackToTable} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Tabel
            </Button>
            
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-t-lg">
                <CardTitle>{selectedHalaqohForCards}</CardTitle>
                <CardDescription className="text-white/80">
                  {filteredSantriForCards.length} santri • Juz {selectedJuz}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {filteredSantriForCards.map(santri => {
                  const progress = getSantriProgress(santri.id) || {
                    santriId: santri.id,
                    juz: Number(selectedJuz),
                    drill1Completed: false,
                    drill2Completed: false,
                    drillHalfJuzCompleted: false,
                    drillFirstHalfJuz: false,
                    drillSecondHalfJuz: false,
                    tasmi1JuzUnlocked: false,
                    drillResults: [],
                  };

                  const totalTahap = [
                    progress.drill1Completed,
                    progress.drill2Completed,
                    progress.drillHalfJuzCompleted,
                    progress.drillFirstHalfJuz,
                    progress.drillSecondHalfJuz,
                  ].filter(Boolean).length;

                  const tasmiUnlocked =
                    progress.tasmi1JuzUnlocked ||
                    (progress.drillFirstHalfJuz && progress.drillSecondHalfJuz);

                  const { lastDrill } = getLastDrillInfo(santri.id);

                  return (
                    <Card key={santri.id} className="overflow-hidden border-l-4 border-l-primary">
                      <CardContent className="p-4 space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold">{santri.nama}</h3>
                            <p className="text-xs text-muted-foreground">{santri.nis}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDetailDialog(santri.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detail
                          </Button>
                        </div>

                        {/* Last Drill Info */}
                        {lastDrill && (
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Drill Terakhir</p>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{getDrillLevelName(lastDrill.drillLevel)}</p>
                                <p className="text-xs text-muted-foreground">{format(lastDrill.tanggal, "dd/MM/yyyy")}</p>
                              </div>
                              <Badge className={cn(
                                lastDrill.lulus ? "bg-green-500" : "bg-destructive"
                              )}>
                                Nilai: {lastDrill.nilaiKelancaran}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {/* Drill Progress */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase">Tahapan Drill</p>
                          <div className="grid grid-cols-2 gap-2">
                            <DrillCheckbox label="Drill 1" desc="5 Halaman" checked={progress.drill1Completed} unlocked />
                            <DrillCheckbox label="Drill 2" desc="5 Halaman" checked={progress.drill2Completed} unlocked={progress.drill1Completed} />
                          </div>
                          <DrillCheckbox label="Drill ½ Juz" desc="10 Halaman" checked={progress.drillHalfJuzCompleted} unlocked={progress.drill1Completed && progress.drill2Completed} fullWidth />
                          <div className="grid grid-cols-2 gap-2">
                            <DrillCheckbox label="½ Juz Pertama" desc="Awal" checked={progress.drillFirstHalfJuz} unlocked={progress.drillHalfJuzCompleted} />
                            <DrillCheckbox label="½ Juz Kedua" desc="Akhir" checked={progress.drillSecondHalfJuz} unlocked={progress.drillHalfJuzCompleted && progress.drillFirstHalfJuz} />
                          </div>
                        </div>

                        {/* Tasmi Status */}
                        <div className={cn(
                          "p-3 rounded-lg border-2",
                          tasmiUnlocked 
                            ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30" 
                            : "border-muted bg-muted/30"
                        )}>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              tasmiUnlocked ? "bg-amber-400 text-white" : "bg-muted"
                            )}>
                              {tasmiUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">🏆 Tasmi' 1 Juz</p>
                              <p className="text-xs text-muted-foreground">
                                {tasmiUnlocked ? "Siap ujian!" : "Selesaikan drill dulu"}
                              </p>
                            </div>
                            {tasmiUnlocked && (
                              <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                                <Target className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="pt-2 border-t">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{totalTahap}/5 tahap</span>
                          </div>
                          <Progress value={totalTahap * 20} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2">ℹ️ Sistem Checkpoint Drill</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• <strong>Drill 1:</strong> 5 halaman atau 5 surat pertama</li>
              <li>• <strong>Drill 2:</strong> 5 halaman/surat berikutnya (unlock setelah Drill 1)</li>
              <li>• <strong>Drill ½ Juz:</strong> 10 halaman gabungan (unlock setelah Drill 1 & 2)</li>
              <li>• <strong>Persiapan 1 Juz:</strong> Drill setengah juz pertama, lalu kedua</li>
              <li>• <strong>Tasmi' 1 Juz:</strong> Ujian lengkap 1 juz (unlock setelah semua drill)</li>
              <li className="pt-2 border-t mt-2">
                <strong>Syarat Lulus:</strong> Nilai minimal {BATAS_LULUS} dan maksimal {BATAS_KESALAHAN} kesalahan
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Hasil Drill Hafalan
              </DialogTitle>
              <DialogDescription>
                {getSelectedSantriForDetail()?.nama} - Juz {selectedJuz}
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                {/* Progress Summary */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Status Tahapan Drill</h4>
                    <div className="space-y-2">
                      {drillLevels.slice(0, 5).map(level => {
                        const progress = getSelectedProgressForDetail();
                        let completed = false;
                        if (progress) {
                          switch (level.id) {
                            case "drill1": completed = progress.drill1Completed; break;
                            case "drill2": completed = progress.drill2Completed; break;
                            case "drillHalfJuz": completed = progress.drillHalfJuzCompleted; break;
                            case "drillFirstHalf": completed = progress.drillFirstHalfJuz; break;
                            case "drillSecondHalf": completed = progress.drillSecondHalfJuz; break;
                          }
                        }
                        return (
                          <div key={level.id} className="flex items-center justify-between p-2 rounded bg-background">
                            <div className="flex items-center gap-2">
                              <span>{level.icon}</span>
                              <span className="text-sm font-medium">{level.name}</span>
                            </div>
                            <Badge variant={completed ? "default" : "secondary"} className={cn(
                              completed && "bg-green-500"
                            )}>
                              {completed ? "Lulus" : "Belum"}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Drill Results */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Riwayat Penilaian Drill</h4>
                  {getSelectedProgressForDetail()?.drillResults?.length ? (
                    getSelectedProgressForDetail()?.drillResults.map(result => (
                      <Card key={result.id} className={cn(
                        "border-l-4",
                        result.lulus ? "border-l-green-500" : "border-l-destructive"
                      )}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">{getDrillLevelName(result.drillLevel)}</Badge>
                                <Badge variant={result.lulus ? "default" : "destructive"} className={cn(
                                  result.lulus && "bg-green-500"
                                )}>
                                  {result.lulus ? "LULUS" : "ULANG"}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                {format(result.tanggal, "dd MMMM yyyy")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={cn(
                                "text-2xl font-bold",
                                result.nilaiKelancaran >= BATAS_LULUS ? "text-green-600" : "text-destructive"
                              )}>
                                {result.nilaiKelancaran}
                              </p>
                              <p className="text-xs text-muted-foreground">{result.jumlahKesalahan} kesalahan</p>
                            </div>
                          </div>

                          {/* Surahs */}
                          <div className="space-y-2 mb-3">
                            <p className="text-xs font-medium text-muted-foreground uppercase">Materi Disetorkan:</p>
                            {result.surahs.map((surah) => (
                              <div key={surah.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                                <BookOpen className="w-4 h-4 text-primary" />
                                <span className="font-medium">{surah.surahName}</span>
                                <span className="text-muted-foreground">
                                  Ayat {surah.ayatDari} - {surah.ayatSampai}
                                </span>
                              </div>
                            ))}
                          </div>

                          {result.catatanTajwid && (
                            <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-200 dark:border-amber-800">
                              <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">Catatan Tajwid:</p>
                              <p className="text-sm text-amber-900 dark:text-amber-100">{result.catatanTajwid}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center text-muted-foreground">
                        <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p>Belum ada riwayat drill</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

// Drill Checkbox Component
interface DrillCheckboxProps {
  label: string;
  desc: string;
  checked: boolean;
  unlocked: boolean;
  fullWidth?: boolean;
}

const DrillCheckbox = ({ label, desc, checked, unlocked, fullWidth }: DrillCheckboxProps) => (
  <div className={cn(
    "flex items-center gap-2 p-2 rounded-lg border transition-all",
    checked 
      ? "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700" 
      : unlocked 
        ? "bg-background border-border" 
        : "bg-muted/50 border-muted opacity-60",
    fullWidth && "col-span-2"
  )}>
    <div className={cn(
      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
      checked 
        ? "bg-green-500 text-white" 
        : unlocked 
          ? "bg-muted border border-border" 
          : "bg-muted"
    )}>
      {checked ? (
        <CheckCircle className="w-3 h-3" />
      ) : unlocked ? null : (
        <Lock className="w-2.5 h-2.5 text-muted-foreground" />
      )}
    </div>
    <div className="min-w-0">
      <p className={cn(
        "font-medium text-xs truncate",
        !unlocked && "text-muted-foreground"
      )}>
        {label}
      </p>
      <p className="text-[10px] text-muted-foreground truncate">{desc}</p>
    </div>
  </div>
);

export default DrillHafalan;
