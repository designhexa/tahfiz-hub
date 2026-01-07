import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Award, 
  Plus,
  User,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { getJuzName } from "@/lib/quran-data";

// Urutan juz untuk ujian tasmi'
const JUZ_ORDER = [30, 29, 28, 27, 26, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

// Fungsi untuk mendapatkan predikat berdasarkan nilai
const getPredikat = (nilai: number): { label: string; color: string; passed: boolean } => {
  if (nilai >= 96) return { label: "Mumtaz Murtafi'", color: "bg-emerald-500", passed: true };
  if (nilai >= 90) return { label: "Mumtaz", color: "bg-green-500", passed: true };
  if (nilai >= 76) return { label: "Jayyid Jiddan", color: "bg-blue-500", passed: true };
  if (nilai >= 70) return { label: "Jayyid", color: "bg-amber-500", passed: true };
  return { label: "Tidak Lulus", color: "bg-red-500", passed: false };
};

// Data dummy santri
const dummySantri = [
  { id: "1", nama: "Ahmad Fauzi", halaqoh: "Halaqoh Al-Fatih", juzSelesai: [30, 29] },
  { id: "2", nama: "Muhammad Rizki", halaqoh: "Halaqoh Al-Fatih", juzSelesai: [30] },
  { id: "3", nama: "Abdullah Hakim", halaqoh: "Halaqoh An-Nur", juzSelesai: [] },
];

// Data dummy hasil ujian
const dummyHasilUjian = [
  { 
    id: "1", 
    santriId: "1", 
    santriNama: "Ahmad Fauzi",
    juz: 30, 
    tanggal: "2025-01-05",
    nilaiTotal: 92,
    predikat: "Mumtaz",
    status: "Lulus",
    penguji: "Ustadz Ahmad",
    catatanPerHalaman: [
      { halaman: 1, pancingan: 1, catatan: "Perlu perbaikan mad" },
      { halaman: 2, pancingan: 0, catatan: "" },
    ],
    catatanUmum: "Secara keseluruhan bagus, perlu perbaikan pada mad dan ghunnah"
  },
  { 
    id: "2", 
    santriId: "1", 
    santriNama: "Ahmad Fauzi",
    juz: 29, 
    tanggal: "2025-01-06",
    nilaiTotal: 88,
    predikat: "Jayyid Jiddan",
    status: "Lulus",
    penguji: "Ustadz Ahmad",
    catatanPerHalaman: [],
    catatanUmum: "Perlu lebih lancar lagi"
  },
];

interface PenilaianHalaman {
  halaman: number;
  pancingan: number;
  catatan: string;
}

const UjianTasmi = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedUjian, setSelectedUjian] = useState<typeof dummyHasilUjian[0] | null>(null);
  const [expandedRules, setExpandedRules] = useState(false);
  
  // Form state
  const [selectedSantri, setSelectedSantri] = useState("");
  const [selectedJuz, setSelectedJuz] = useState("");
  const [penilaianHalaman, setPenilaianHalaman] = useState<PenilaianHalaman[]>(
    Array.from({ length: 20 }, (_, i) => ({ halaman: i + 1, pancingan: 0, catatan: "" }))
  );
  const [catatanUmum, setCatatanUmum] = useState("");
  const [diberhentikan, setDiberhentikan] = useState(false);

  // Hitung nilai total
  const hitungNilaiTotal = () => {
    return penilaianHalaman.reduce((total, h) => {
      const nilaiHalaman = Math.max(0, 5 - h.pancingan);
      return total + nilaiHalaman;
    }, 0);
  };

  const nilaiTotal = hitungNilaiTotal();
  const predikat = getPredikat(nilaiTotal);

  const handleOpenDetail = (ujian: typeof dummyHasilUjian[0]) => {
    setSelectedUjian(ujian);
    setIsDetailOpen(true);
  };

  const handleSubmit = () => {
    console.log("Submit ujian", {
      santri: selectedSantri,
      juz: selectedJuz,
      penilaian: penilaianHalaman,
      catatanUmum,
      diberhentikan,
      nilaiTotal,
      predikat: predikat.label
    });
    setIsFormOpen(false);
    // Reset form
    setSelectedSantri("");
    setSelectedJuz("");
    setPenilaianHalaman(Array.from({ length: 20 }, (_, i) => ({ halaman: i + 1, pancingan: 0, catatan: "" })));
    setCatatanUmum("");
    setDiberhentikan(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Award className="w-7 h-7 text-amber-500" />
              Ujian Tasmi'
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Ujian hafalan 1 juz penuh setelah menyelesaikan drill
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Ujian Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Form Ujian Tasmi'
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Pilih Santri & Juz */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Santri</Label>
                    <Select value={selectedSantri} onValueChange={setSelectedSantri}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih santri" />
                      </SelectTrigger>
                      <SelectContent>
                        {dummySantri.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Juz yang Diujikan</Label>
                    <Select value={selectedJuz} onValueChange={setSelectedJuz}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih juz" />
                      </SelectTrigger>
                      <SelectContent>
                        {JUZ_ORDER.map((juz) => (
                          <SelectItem key={juz} value={juz.toString()}>
                            {getJuzName(juz)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Info Nilai */}
                <Card className={`${predikat.passed ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Nilai Total</p>
                        <p className="text-3xl font-bold">{nilaiTotal}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Predikat</p>
                        <Badge className={`${predikat.color} text-white`}>
                          {predikat.label}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Penilaian Per Halaman */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Penilaian Per Halaman</Label>
                  <p className="text-xs text-muted-foreground">
                    Nilai per halaman: 5 poin. Setiap pancingan mengurangi 1 poin. Maks 5 pancingan/halaman.
                  </p>
                  
                <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {penilaianHalaman.map((h, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 p-1.5 border rounded-md bg-card">
                        <span className="text-xs font-medium whitespace-nowrap">
                          Hal {h.halaman} <span className="text-muted-foreground">({Math.max(0, 5 - h.pancingan)})</span>
                        </span>
                        <div className="flex items-center gap-0.5 ml-auto">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 text-xs"
                            onClick={() => {
                              const newPenilaian = [...penilaianHalaman];
                              newPenilaian[idx].pancingan = Math.max(0, newPenilaian[idx].pancingan - 1);
                              setPenilaianHalaman(newPenilaian);
                            }}
                          >
                            -
                          </Button>
                          <span className="w-5 text-center text-xs font-medium">{h.pancingan}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 text-xs"
                            onClick={() => {
                              const newPenilaian = [...penilaianHalaman];
                              newPenilaian[idx].pancingan = Math.min(5, newPenilaian[idx].pancingan + 1);
                              setPenilaianHalaman(newPenilaian);
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Catatan Tajwid Umum */}
                <div className="space-y-2">
                  <Label>Catatan Tajwid / Makhorijul Huruf</Label>
                  <Textarea
                    placeholder="Catatan perbaikan tajwid dan makhorijul huruf..."
                    value={catatanUmum}
                    onChange={(e) => setCatatanUmum(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Opsi Diberhentikan */}
                <Card className="border-red-500/30 bg-red-500/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="diberhentikan"
                        checked={diberhentikan}
                        onChange={(e) => setDiberhentikan(e.target.checked)}
                        className="mt-1"
                      />
                      <div>
                        <Label htmlFor="diberhentikan" className="text-red-600 font-medium cursor-pointer">
                          Santri Diberhentikan
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Centang jika santri tidak bisa melanjutkan hafalan sama sekali setelah dipancing dan harus mengulang di pekan selanjutnya.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                    Batal
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-amber-500 to-orange-500"
                    disabled={!selectedSantri || !selectedJuz}
                  >
                    Simpan Hasil Ujian
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Aturan Ujian */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader 
            className="pb-2 cursor-pointer"
            onClick={() => setExpandedRules(!expandedRules)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Ketentuan Ujian Tasmi'
              </CardTitle>
              {expandedRules ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </CardHeader>
          {expandedRules && (
            <CardContent className="text-sm space-y-4">
              <div>
                <h4 className="font-semibold mb-2">📚 Urutan Juz:</h4>
                <p className="text-muted-foreground">
                  Juz 30 → 29 → 28 → 27 → 26, lalu Juz 1 → 2 → 3 dst...
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🎯 Aturan Pancingan:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Penguji memberi kode ketukan jika salah (maks 2 kali)</li>
                  <li>Jika tetap salah, penguji memancing hafalan</li>
                  <li>Maksimal 5 kali pancingan per halaman</li>
                  <li>Jika santri tidak bisa melanjutkan sama sekali, ujian dihentikan dan mengulang pekan selanjutnya</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">📊 Penilaian Kelancaran:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Total nilai: 100 poin (5 poin per halaman × 20 halaman)</li>
                  <li>Setiap pancingan mengurangi 1 poin dari halaman tersebut</li>
                  <li>Tajwid/Makhorijul huruf tidak dinilai, tapi wajib dicatat</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🏆 Kriteria Kelulusan:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <Badge className="bg-emerald-500 text-white justify-center">96-100: Mumtaz Murtafi'</Badge>
                  <Badge className="bg-green-500 text-white justify-center">90-95: Mumtaz</Badge>
                  <Badge className="bg-blue-500 text-white justify-center">76-89: Jayyid Jiddan</Badge>
                  <Badge className="bg-amber-500 text-white justify-center">70-75: Jayyid</Badge>
                  <Badge className="bg-red-500 text-white justify-center">&lt;70: Tidak Lulus</Badge>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Tabel Hasil Ujian */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Riwayat Ujian Tasmi'
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Santri</TableHead>
                    <TableHead>Juz</TableHead>
                    <TableHead className="text-center">Nilai</TableHead>
                    <TableHead className="text-center">Predikat</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Penguji</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyHasilUjian.map((ujian) => {
                    const pred = getPredikat(ujian.nilaiTotal);
                    return (
                      <TableRow key={ujian.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(ujian.tanggal).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="font-medium">{ujian.santriNama}</TableCell>
                        <TableCell>{getJuzName(ujian.juz)}</TableCell>
                        <TableCell className="text-center font-bold">{ujian.nilaiTotal}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={`${pred.color} text-white`}>
                            {ujian.predikat}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {pred.passed ? (
                            <Badge variant="outline" className="border-green-500 text-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Lulus
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-500 text-red-600">
                              <XCircle className="w-3 h-3 mr-1" />
                              Tidak Lulus
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{ujian.penguji}</TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleOpenDetail(ujian)}
                          >
                            <BookOpen className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Rekap Per Santri */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Progress Tasmi' Per Santri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dummySantri.map((santri) => (
                <Card key={santri.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{santri.nama}</h4>
                        <p className="text-xs text-muted-foreground">{santri.halaqoh}</p>
                      </div>
                      <Badge variant="outline">
                        {santri.juzSelesai.length} Juz Lulus
                      </Badge>
                    </div>
                    
                    {/* Progress Juz */}
                    <div className="flex flex-wrap gap-1">
                      {JUZ_ORDER.slice(0, 10).map((juz) => {
                        const selesai = santri.juzSelesai.includes(juz);
                        return (
                          <div
                            key={juz}
                            className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${
                              selesai 
                                ? 'bg-green-500 text-white' 
                                : 'bg-muted text-muted-foreground'
                            }`}
                            title={`Juz ${juz}`}
                          >
                            {juz}
                          </div>
                        );
                      })}
                      {JUZ_ORDER.length > 10 && (
                        <div className="w-8 h-8 rounded flex items-center justify-center text-xs text-muted-foreground bg-muted">
                          ...
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Detail Ujian Tasmi'
              </DialogTitle>
            </DialogHeader>
            
            {selectedUjian && (
              <div className="space-y-4">
                {/* Info Utama */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Santri</p>
                    <p className="font-semibold">{selectedUjian.santriNama}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Juz</p>
                    <p className="font-semibold">{getJuzName(selectedUjian.juz)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tanggal</p>
                    <p className="font-semibold">
                      {new Date(selectedUjian.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Penguji</p>
                    <p className="font-semibold">{selectedUjian.penguji}</p>
                  </div>
                </div>

                {/* Hasil */}
                <Card className={`${getPredikat(selectedUjian.nilaiTotal).passed ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Nilai Total</p>
                        <p className="text-4xl font-bold">{selectedUjian.nilaiTotal}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getPredikat(selectedUjian.nilaiTotal).color} text-white text-lg px-4 py-1`}>
                          {selectedUjian.predikat}
                        </Badge>
                        <p className="text-sm mt-2">
                          {getPredikat(selectedUjian.nilaiTotal).passed ? (
                            <span className="text-green-600 flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-4 h-4" /> LULUS
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center justify-end gap-1">
                              <XCircle className="w-4 h-4" /> TIDAK LULUS
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Catatan Tajwid */}
                {selectedUjian.catatanUmum && (
                  <div>
                    <h4 className="font-semibold mb-2">📝 Catatan Tajwid / Perbaikan:</h4>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <p className="text-sm">{selectedUjian.catatanUmum}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Detail Per Halaman jika ada */}
                {selectedUjian.catatanPerHalaman && selectedUjian.catatanPerHalaman.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">📄 Catatan Per Halaman:</h4>
                    <div className="space-y-2">
                      {selectedUjian.catatanPerHalaman.filter(h => h.catatan || h.pancingan > 0).map((h) => (
                        <div key={h.halaman} className="flex items-start gap-3 text-sm">
                          <Badge variant="outline" className="shrink-0">Hal {h.halaman}</Badge>
                          <div>
                            {h.pancingan > 0 && (
                              <span className="text-amber-600 mr-2">({h.pancingan} pancingan)</span>
                            )}
                            {h.catatan && <span>{h.catatan}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default UjianTasmi;
