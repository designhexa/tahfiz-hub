import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Plus, AlertCircle, CheckCircle2, Info, Eye } from "lucide-react";
import { JuzSelector } from "@/components/JuzSelector";
import { supabase } from "@/integrations/supabase/client";

interface Halaqoh {
  id: string;
  nama_halaqoh: string;
}

interface Kelas {
  id: string;
  nama_kelas: string;
}

const UjianTahfidz = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState("");
  const [selectedAsatidz, setSelectedAsatidz] = useState("");
  const [tanggalUjian, setTanggalUjian] = useState("");
  const [materiDari, setMateriDari] = useState("");
  const [materiSampai, setMateriSampai] = useState("");
  const [catatan, setCatatan] = useState("");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterKelas, setFilterKelas] = useState("all");
  const [halaqohList, setHalaqohList] = useState<Halaqoh[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  
  // State untuk 10 soal - setiap soal memiliki halaman dan pengurangan nilai
  const [soalData, setSoalData] = useState<Array<{
    halaman: string;
    pengurangan: number;
  }>>(
    Array.from({ length: 10 }, () => ({
      halaman: "",
      pengurangan: 0,
    }))
  );

  useEffect(() => {
    const fetchFilters = async () => {
      const [halaqohRes, kelasRes] = await Promise.all([
        supabase.from("halaqoh").select("id, nama_halaqoh").order("nama_halaqoh"),
        supabase.from("kelas").select("id, nama_kelas").order("nama_kelas"),
      ]);
      if (halaqohRes.data) setHalaqohList(halaqohRes.data);
      if (kelasRes.data) setKelasList(kelasRes.data);
    };
    fetchFilters();
  }, []);

  // Dummy data
  const santriList = [
    { id: "1", nama: "Ahmad Fauzi", nis: "2024001", halaqoh: "Halaqoh A", kelas: "Paket A Kelas 6" },
    { id: "2", nama: "Muhammad Rizki", nis: "2024002", halaqoh: "Halaqoh A", kelas: "Paket A Kelas 6" },
    { id: "3", nama: "Abdullah Rahman", nis: "2024003", halaqoh: "Halaqoh B", kelas: "KBTK A" },
  ];

  const asatidzList = [
    { id: "1", nama: "Ustadz Ahmad" },
    { id: "2", nama: "Ustadz Mahmud" },
    { id: "3", nama: "Ustadzah Fatimah" },
  ];

  const ujianHistory = [
    { id: "1", santri: "Ahmad Fauzi", tanggal: "2024-01-15", materi: "Juz 1-2", nilaiTotal: 85, status: "Lulus" },
    { id: "2", santri: "Muhammad Rizki", tanggal: "2024-01-14", materi: "Juz 1-2", nilaiTotal: 65, status: "Tidak Lulus" },
  ];

  const filteredSantriList = santriList.filter((s) => {
    const matchHalaqoh = filterHalaqoh === "all" || s.halaqoh === filterHalaqoh;
    const matchKelas = filterKelas === "all" || s.kelas === filterKelas;
    return matchHalaqoh && matchKelas;
  });

  const handlePenguranganChange = (index: number, value: number) => {
    const newSoalData = [...soalData];
    // Maksimal pengurangan adalah 10 (nilai penuh per soal)
    newSoalData[index].pengurangan = Math.min(Math.max(0, value), 10);
    setSoalData(newSoalData);
  };

  const handleHalamanChange = (index: number, value: string) => {
    const newSoalData = [...soalData];
    newSoalData[index].halaman = value;
    setSoalData(newSoalData);
  };

  // Hitung nilai per soal (10 - pengurangan)
  const getNilaiSoal = (index: number) => {
    return 10 - soalData[index].pengurangan;
  };

  // Hitung total nilai
  const getTotalNilai = () => {
    return soalData.reduce((total, soal) => total + (10 - soal.pengurangan), 0);
  };

  // Cek apakah lulus (KKM = 70)
  const isLulus = () => {
    return getTotalNilai() >= 70;
  };

  const handleSubmit = () => {
    console.log({
      santri: selectedSantri,
      asatidz: selectedAsatidz,
      tanggal: tanggalUjian,
      materiDari,
      materiSampai,
      soalData,
      totalNilai: getTotalNilai(),
      status: isLulus() ? "Lulus" : "Tidak Lulus",
      catatan,
    });
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedSantri("");
    setSelectedAsatidz("");
    setTanggalUjian("");
    setMateriDari(null);
    setMateriSampai(null);
    setCatatan("");
    setSoalData(
      Array.from({ length: 10 }, () => ({
        halaman: "",
        pengurangan: 0,
      }))
    );
  };

  const selectedSantriData = santriList.find((s) => s.id === selectedSantri);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-purple-500" />
              Ujian Tahfidz
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Ujian tahfidz Al-Qur'an dengan 10 soal sambung ayat
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Ujian Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-500" />
                  Form Ujian Tahfidz
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Info Aturan */}
                <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
                  <CardContent className="pt-4">
                    <div className="flex gap-2">
                      <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                        <p className="font-medium">Aturan Penilaian:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-xs">
                          <li>10 soal sambung ayat, masing-masing bernilai maksimal 10 poin</li>
                          <li>Peserta melanjutkan ayat hingga 5 baris (toleransi 5.5-6 baris)</li>
                          <li>Setiap baris sempurna = 2 poin (5 baris × 2 = 10 poin)</li>
                          <li>Kesalahan setelah 3x diingatkan = -1 poin per kesalahan</li>
                          <li>KKM (Kriteria Ketuntasan Minimal) = 70</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Filter Halaqoh & Kelas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Filter Halaqoh</Label>
                    <Select value={filterHalaqoh} onValueChange={setFilterHalaqoh}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Halaqoh" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Halaqoh</SelectItem>
                        {halaqohList.map((h) => (
                          <SelectItem key={h.id} value={h.nama_halaqoh}>
                            {h.nama_halaqoh}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Filter Kelas</Label>
                    <Select value={filterKelas} onValueChange={setFilterKelas}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kelas</SelectItem>
                        {kelasList.map((k) => (
                          <SelectItem key={k.id} value={k.nama_kelas}>
                            {k.nama_kelas}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Data Ujian */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Santri</Label>
                    <Select value={selectedSantri} onValueChange={setSelectedSantri}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih santri" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSantriList.map((santri) => (
                          <SelectItem key={santri.id} value={santri.id}>
                            {santri.nama} - {santri.nis}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Penguji</Label>
                    <Select value={selectedAsatidz} onValueChange={setSelectedAsatidz}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih penguji" />
                      </SelectTrigger>
                      <SelectContent>
                        {asatidzList.map((asatidz) => (
                          <SelectItem key={asatidz.id} value={asatidz.id}>
                            {asatidz.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tanggal Ujian</Label>
                    <Input
                      type="date"
                      value={tanggalUjian}
                      onChange={(e) => setTanggalUjian(e.target.value)}
                    />
                  </div>

                  {selectedSantriData && (
                    <div className="space-y-2">
                      <Label>Halaqoh</Label>
                      <Input value={selectedSantriData.halaqoh} disabled />
                    </div>
                  )}
                </div>

                {/* Materi Ujian - Juz Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Materi Ujian (Juz)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <JuzSelector
                      value={materiDari}
                      onValueChange={setMateriDari}
                      label="Dari Juz"
                    />
                    <JuzSelector
                      value={materiSampai}
                      onValueChange={setMateriSampai}
                      label="Sampai Juz"
                    />
                  </div>
                  {materiDari && materiSampai && (
                    <p className="text-sm text-muted-foreground">
                      Materi: Juz {materiDari} - Juz {materiSampai} ({(parseInt(materiSampai) - parseInt(materiDari) + 1) * 20} halaman)
                    </p>
                  )}
                </div>

                {/* 10 Soal Accordion */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Penilaian 10 Soal</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Total Nilai:</span>
                      <Badge
                        variant={isLulus() ? "default" : "destructive"}
                        className={`text-lg px-3 py-1 ${
                          isLulus()
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {getTotalNilai()}
                      </Badge>
                    </div>
                  </div>

                  <Accordion type="multiple" className="space-y-2">
                    {soalData.map((soal, index) => (
                      <AccordionItem
                        key={index}
                        value={`soal-${index}`}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span className="font-medium">Soal {index + 1}</span>
                            <div className="flex items-center gap-2">
                              {soal.halaman && (
                                <span className="text-xs text-muted-foreground">
                                  Hal. {soal.halaman}
                                </span>
                              )}
                              <Badge
                                variant={getNilaiSoal(index) === 10 ? "default" : "secondary"}
                                className={
                                  getNilaiSoal(index) === 10
                                    ? "bg-green-600"
                                    : getNilaiSoal(index) >= 7
                                    ? "bg-yellow-600"
                                    : "bg-red-600"
                                }
                              >
                                {getNilaiSoal(index)}/10
                              </Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 pb-4">
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm">Halaman Soal</Label>
                              <Input
                                placeholder="Contoh: 5 atau 5-8"
                                value={soal.halaman}
                                onChange={(e) => handleHalamanChange(index, e.target.value)}
                              />
                            </div>

                            <div className="space-y-3">
                              <Label className="text-sm">Pengurangan Nilai</Label>
                              <p className="text-xs text-muted-foreground">
                                Kurangi nilai untuk setiap kesalahan setelah 3x diingatkan (-1 per kesalahan)
                              </p>
                              <div className="flex items-center gap-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handlePenguranganChange(index, soal.pengurangan - 1)
                                  }
                                  disabled={soal.pengurangan <= 0}
                                >
                                  -
                                </Button>
                                <span className="w-12 text-center font-mono text-lg">
                                  -{soal.pengurangan}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handlePenguranganChange(index, soal.pengurangan + 1)
                                  }
                                  disabled={soal.pengurangan >= 10}
                                >
                                  +
                                </Button>
                                <span className="text-sm text-muted-foreground ml-2">
                                  Nilai: {getNilaiSoal(index)}/10
                                </span>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* Ringkasan Nilai */}
                <Card
                  className={`${
                    isLulus()
                      ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                  }`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isLulus() ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        )}
                        <div>
                          <p
                            className={`font-semibold ${
                              isLulus() ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                            }`}
                          >
                            {isLulus() ? "LULUS" : "TIDAK LULUS"}
                          </p>
                          <p className="text-xs text-muted-foreground">KKM: 70</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-3xl font-bold ${
                            isLulus() ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {getTotalNilai()}
                        </p>
                        <p className="text-xs text-muted-foreground">dari 100</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Catatan */}
                <div className="space-y-2">
                  <Label>Catatan (Opsional)</Label>
                  <Textarea
                    placeholder="Catatan tambahan untuk ujian ini..."
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedSantri || !selectedAsatidz || !tanggalUjian}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Simpan Hasil Ujian
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Riwayat Ujian Tahfidz</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Santri</TableHead>
                  <TableHead>Materi</TableHead>
                  <TableHead className="text-center">Nilai</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ujianHistory.map((ujian) => (
                  <TableRow key={ujian.id}>
                    <TableCell>{ujian.tanggal}</TableCell>
                    <TableCell className="font-medium">{ujian.santri}</TableCell>
                    <TableCell>{ujian.materi}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={ujian.nilaiTotal >= 70 ? "default" : "destructive"}
                        className={
                          ujian.nilaiTotal >= 70
                            ? "bg-green-600"
                            : "bg-red-600"
                        }
                      >
                        {ujian.nilaiTotal}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={ujian.status === "Lulus" ? "default" : "destructive"}
                        className={
                          ujian.status === "Lulus"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }
                      >
                        {ujian.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UjianTahfidz;
