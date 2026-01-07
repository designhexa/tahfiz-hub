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
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  CheckCircle, 
  Trash2, 
  User, 
  Calendar, 
  BookOpen, 
  CalendarIcon,
  ChevronRight,
  Lock,
  Unlock,
  Target
} from "lucide-react";
import { toast } from "sonner";
import { JuzSelector } from "@/components/JuzSelector";
import { getSurahsByJuz, Surah } from "@/lib/quran-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Types for drill progression
interface DrillProgress {
  santriId: string;
  juz: number;
  drill1Completed: boolean;
  drill2Completed: boolean;
  drillHalfJuzCompleted: boolean;
  drillFirstHalfJuz: boolean;
  drillSecondHalfJuz: boolean;
  tasmi1JuzUnlocked: boolean;
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
  },
];

const mockSantri = [
  { id: "1", nama: "Muhammad Faiz", nis: "S001", halaqoh: "Halaqoh Al-Azhary" },
  { id: "2", nama: "Fatimah Zahra", nis: "S003", halaqoh: "Halaqoh Al-Furqon" },
  { id: "3", nama: "Aisyah Nur", nis: "S002", halaqoh: "Halaqoh Al-Azhary" },
];

const BATAS_LULUS = 88;
const BATAS_KESALAHAN = 12;

function tentukanStatus(kelancaran: number, kesalahan: number) {
  return kelancaran >= BATAS_LULUS && kesalahan <= BATAS_KESALAHAN;
}

const DrillHafalan = () => {
  const [selectedSantriFilter, setSelectedSantriFilter] = useState("all");
  const [selectedJuz, setSelectedJuz] = useState("30");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [selectedSantri, setSelectedSantri] = useState("");
  const [tanggalDrill, setTanggalDrill] = useState<Date>();
  const [drillLevel, setDrillLevel] = useState("");
  const [juz, setJuz] = useState("");
  const [surah, setSurah] = useState("");
  const [ayatDari, setAyatDari] = useState("1");
  const [ayatSampai, setAyatSampai] = useState("7");
  const [jumlahKesalahan, setJumlahKesalahan] = useState("0");
  const [catatanTajwid, setCatatanTajwid] = useState("");

  const surahByJuz: Surah[] = useMemo(() => {
    if (!juz) return [];
    return getSurahsByJuz(Number(juz));
  }, [juz]);

  const selectedSurah = useMemo(() => {
    return surahByJuz.find(s => s.number === Number(surah));
  }, [surah, surahByJuz]);

  const nilaiKelancaran = Math.max(0, 100 - parseInt(jumlahKesalahan || "0"));

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
    setSurah("");
    setAyatDari("1");
    setAyatSampai("7");
    setJumlahKesalahan("0");
    setCatatanTajwid("");
  };

  // Get progress for a specific santri
  const getSantriProgress = (santriId: string) => {
    return mockSantriDrillProgress.find(p => p.santriId === santriId);
  };

  // Check if a drill level is unlocked for a santri
  const isDrillUnlocked = (progress: DrillProgress | undefined, level: string) => {
    if (!progress) return level === "drill1"; // First drill always unlocked
    
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

  const drillLevels = [
    { id: "drill1", name: "Drill 1", desc: "5 Halaman / 5 Surat", icon: "📘" },
    { id: "drill2", name: "Drill 2", desc: "5 Halaman berikutnya", icon: "📗" },
    { id: "drillHalfJuz", name: "Drill ½ Juz", desc: "10 Halaman", icon: "📙" },
    { id: "drillFirstHalf", name: "½ Juz Pertama", desc: "Setengah juz awal", icon: "📕" },
    { id: "drillSecondHalf", name: "½ Juz Kedua", desc: "Setengah juz akhir", icon: "📓" },
    { id: "tasmi1Juz", name: "Tasmi' 1 Juz", desc: "Ujian lengkap 1 juz", icon: "🏆" },
  ];

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col gap-3">
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
                <p className="text-sm text-muted-foreground">Masukkan penilaian drill hafalan untuk santri</p>
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

                {/* Surah Selection */}
                <Card className="border-dashed border-primary/50 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Materi Drill</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nama Surah *</Label>
                      <Select value={surah} onValueChange={setSurah} disabled={!juz}>
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
                        <p className="text-sm">
                          {selectedSurah.name} ({selectedSurah.arabicName}) – {selectedSurah.numberOfAyahs} ayat
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

        {/* Filter - Mobile Optimized */}
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Filter Santri</Label>
                <Select value={selectedSantriFilter} onValueChange={setSelectedSantriFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Santri</SelectItem>
                    {mockSantri.map(santri => (
                      <SelectItem key={santri.id} value={santri.id}>{santri.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Juz</Label>
                <Select value={selectedJuz} onValueChange={setSelectedJuz}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Pilih Juz" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>Juz {i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drill Progress Cards - Mobile First */}
        <div className="space-y-4">
          {mockSantri
            .filter(s => selectedSantriFilter === "all" || s.id === selectedSantriFilter)
            .map(santri => {
              const progress = getSantriProgress(santri.id) || {
                santriId: santri.id,
                juz: Number(selectedJuz),
                drill1Completed: false,
                drill2Completed: false,
                drillHalfJuzCompleted: false,
                drillFirstHalfJuz: false,
                drillSecondHalfJuz: false,
                tasmi1JuzUnlocked: false,
              };

              return (
                <Card key={santri.id} className="overflow-hidden">
                  {/* Santri Header */}
                  <div className="bg-gradient-to-r from-green-500 to-lime-500 p-3 md:p-4">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <h3 className="font-bold text-lg">{santri.nama}</h3>
                        <p className="text-sm opacity-90">{santri.halaqoh} • Juz {selectedJuz}</p>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white border-0">
                        {santri.nis}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-3 md:p-4">
                    {/* Drill Progression - Visual Timeline */}
                    <div className="space-y-3">
                      {/* Phase 1: Drill 1 & 2 */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tahap Awal</p>
                        <div className="grid grid-cols-2 gap-2">
                          <DrillCheckbox 
                            label="Drill 1" 
                            desc="5 Halaman/Surat"
                            checked={progress.drill1Completed}
                            unlocked={true}
                          />
                          <DrillCheckbox 
                            label="Drill 2" 
                            desc="5 Halaman berikutnya"
                            checked={progress.drill2Completed}
                            unlocked={progress.drill1Completed}
                          />
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      {(progress.drill1Completed && progress.drill2Completed) && (
                        <div className="flex justify-center">
                          <ChevronRight className="w-5 h-5 text-green-500 rotate-90" />
                        </div>
                      )}

                      {/* Phase 2: Half Juz */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Drill ½ Juz</p>
                        <DrillCheckbox 
                          label="Drill ½ Juz" 
                          desc="10 Halaman"
                          checked={progress.drillHalfJuzCompleted}
                          unlocked={progress.drill1Completed && progress.drill2Completed}
                          fullWidth
                        />
                      </div>

                      {/* Arrow indicator */}
                      {progress.drillHalfJuzCompleted && (
                        <div className="flex justify-center">
                          <ChevronRight className="w-5 h-5 text-green-500 rotate-90" />
                        </div>
                      )}

                      {/* Phase 3: Full Juz Preparation */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Persiapan 1 Juz</p>
                        <div className="grid grid-cols-2 gap-2">
                          <DrillCheckbox 
                            label="½ Juz Pertama" 
                            desc="Setengah awal"
                            checked={progress.drillFirstHalfJuz}
                            unlocked={progress.drillHalfJuzCompleted}
                          />
                          <DrillCheckbox 
                            label="½ Juz Kedua" 
                            desc="Setengah akhir"
                            checked={progress.drillSecondHalfJuz}
                            unlocked={progress.drillHalfJuzCompleted && progress.drillFirstHalfJuz}
                          />
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      {(progress.drillFirstHalfJuz && progress.drillSecondHalfJuz) && (
                        <div className="flex justify-center">
                          <ChevronRight className="w-5 h-5 text-green-500 rotate-90" />
                        </div>
                      )}

                      {/* Phase 4: Tasmi 1 Juz */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ujian Akhir</p>
                        <Card className={cn(
                          "border-2 p-3",
                          progress.drillFirstHalfJuz && progress.drillSecondHalfJuz
                            ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30"
                            : "border-muted bg-muted/30"
                        )}>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              progress.drillFirstHalfJuz && progress.drillSecondHalfJuz
                                ? "bg-amber-400 text-white"
                                : "bg-muted text-muted-foreground"
                            )}>
                              {progress.drillFirstHalfJuz && progress.drillSecondHalfJuz 
                                ? <Unlock className="w-5 h-5" /> 
                                : <Lock className="w-5 h-5" />
                              }
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">🏆 Tasmi' 1 Juz</p>
                              <p className="text-xs text-muted-foreground">
                                {progress.drillFirstHalfJuz && progress.drillSecondHalfJuz 
                                  ? "Siap untuk ujian tasmi' 1 juz penuh!"
                                  : "Selesaikan semua drill untuk membuka"
                                }
                              </p>
                            </div>
                            {progress.drillFirstHalfJuz && progress.drillSecondHalfJuz && (
                              <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                                <Target className="w-4 h-4 mr-1" />
                                Mulai
                              </Button>
                            )}
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress Juz {selectedJuz}</span>
                        <span className="font-medium">
                          {[
                            progress.drill1Completed,
                            progress.drill2Completed,
                            progress.drillHalfJuzCompleted,
                            progress.drillFirstHalfJuz,
                            progress.drillSecondHalfJuz,
                          ].filter(Boolean).length}/5 tahap
                        </span>
                      </div>
                      <Progress 
                        value={
                          [
                            progress.drill1Completed,
                            progress.drill2Completed,
                            progress.drillHalfJuzCompleted,
                            progress.drillFirstHalfJuz,
                            progress.drillSecondHalfJuz,
                          ].filter(Boolean).length * 20
                        } 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>

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
            </ul>
          </CardContent>
        </Card>
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
    "flex items-center gap-3 p-3 rounded-lg border transition-all",
    checked 
      ? "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700" 
      : unlocked 
        ? "bg-background border-border hover:border-primary/50" 
        : "bg-muted/50 border-muted opacity-60",
    fullWidth && "col-span-2"
  )}>
    <div className={cn(
      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
      checked 
        ? "bg-green-500 text-white" 
        : unlocked 
          ? "bg-muted border-2 border-border" 
          : "bg-muted"
    )}>
      {checked ? (
        <CheckCircle className="w-4 h-4" />
      ) : unlocked ? null : (
        <Lock className="w-3 h-3 text-muted-foreground" />
      )}
    </div>
    <div className="min-w-0">
      <p className={cn(
        "font-medium text-sm truncate",
        !unlocked && "text-muted-foreground"
      )}>
        {label}
      </p>
      <p className="text-xs text-muted-foreground truncate">{desc}</p>
    </div>
  </div>
);

export default DrillHafalan;
