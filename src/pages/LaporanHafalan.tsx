import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, TrendingUp, BookOpen, Calendar, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

// Mock data
const mockLaporanHarian = [
  { tanggal: "15/01/2025", santri: "Muhammad Faiz", juz: 3, halaman: "45-50", ayat: 60, nilai: 95, status: "Lancar" },
  { tanggal: "15/01/2025", santri: "Fatimah Zahra", juz: 4, halaman: "1-5", ayat: 50, nilai: 92, status: "Lancar" },
  { tanggal: "14/01/2025", santri: "Aisyah Nur", juz: 3, halaman: "40-44", ayat: 45, nilai: 88, status: "Lancar" },
  { tanggal: "14/01/2025", santri: "Ahmad Rasyid", juz: 2, halaman: "30-35", ayat: 55, nilai: 90, status: "Lancar" },
  { tanggal: "13/01/2025", santri: "Muhammad Faiz", juz: 3, halaman: "40-44", ayat: 48, nilai: 94, status: "Lancar" },
];

const mockLaporanMingguan = [
  { minggu: "Minggu 1", totalSetoran: 25, totalAyat: 450, rataRata: 92, santriAktif: 45 },
  { minggu: "Minggu 2", totalSetoran: 28, totalAyat: 520, rataRata: 94, santriAktif: 48 },
  { minggu: "Minggu 3", totalSetoran: 22, totalAyat: 400, rataRata: 90, santriAktif: 42 },
  { minggu: "Minggu 4", totalSetoran: 30, totalAyat: 580, rataRata: 93, santriAktif: 50 },
];

const mockCapaianJuz = [
  { juz: 1, santriSelesai: 45, totalSantri: 50, persentase: 90 },
  { juz: 2, santriSelesai: 38, totalSantri: 50, persentase: 76 },
  { juz: 3, santriSelesai: 30, totalSantri: 50, persentase: 60 },
  { juz: 4, santriSelesai: 22, totalSantri: 50, persentase: 44 },
  { juz: 5, santriSelesai: 15, totalSantri: 50, persentase: 30 },
];

const LaporanHafalan = () => {
  const [filterPeriode, setFilterPeriode] = useState("bulanan");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterBulan, setFilterBulan] = useState("januari");

  const handleExportPDF = () => {
    toast.success("Laporan berhasil diexport ke PDF!");
  };

  const handleExportExcel = () => {
    toast.success("Laporan berhasil diexport ke Excel!");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Laporan Hafalan</h1>
            <p className="text-muted-foreground">Rekap dan analisis capaian hafalan santri</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleExportPDF}>
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">105</p>
                  <p className="text-xs text-muted-foreground">Total Setoran</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-lime" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1,950</p>
                  <p className="text-xs text-muted-foreground">Total Ayat</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">92.5</p>
                  <p className="text-xs text-muted-foreground">Rata-rata Nilai</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">48</p>
                  <p className="text-xs text-muted-foreground">Santri Aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Periode</label>
                <Select value={filterPeriode} onValueChange={setFilterPeriode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="harian">Harian</SelectItem>
                    <SelectItem value="mingguan">Mingguan</SelectItem>
                    <SelectItem value="bulanan">Bulanan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bulan</label>
                <Select value={filterBulan} onValueChange={setFilterBulan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="januari">Januari 2025</SelectItem>
                    <SelectItem value="februari">Februari 2025</SelectItem>
                    <SelectItem value="maret">Maret 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Halaqoh</label>
                <Select value={filterHalaqoh} onValueChange={setFilterHalaqoh}>
                  <SelectTrigger>
                    <SelectValue />
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

        {/* Tabs Content */}
        <Tabs defaultValue="harian" className="space-y-4">
          <TabsList>
            <TabsTrigger value="harian" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Rekap Harian
            </TabsTrigger>
            <TabsTrigger value="mingguan" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Rekap Mingguan
            </TabsTrigger>
            <TabsTrigger value="capaian" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Capaian per Juz
            </TabsTrigger>
          </TabsList>

          {/* Rekap Harian */}
          <TabsContent value="harian">
            <Card>
              <CardHeader>
                <CardTitle>Rekap Setoran Harian</CardTitle>
                <CardDescription>Daftar setoran hafalan harian santri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Santri</TableHead>
                        <TableHead>Juz</TableHead>
                        <TableHead>Halaman</TableHead>
                        <TableHead>Ayat</TableHead>
                        <TableHead>Nilai</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLaporanHarian.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.tanggal}</TableCell>
                          <TableCell className="font-medium">{item.santri}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                              Juz {item.juz}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.halaman}</TableCell>
                          <TableCell>{item.ayat} ayat</TableCell>
                          <TableCell className="font-semibold text-primary">{item.nilai}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500 hover:bg-green-600">{item.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rekap Mingguan */}
          <TabsContent value="mingguan">
            <Card>
              <CardHeader>
                <CardTitle>Rekap Mingguan</CardTitle>
                <CardDescription>Statistik setoran per minggu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Periode</TableHead>
                        <TableHead className="text-center">Total Setoran</TableHead>
                        <TableHead className="text-center">Total Ayat</TableHead>
                        <TableHead className="text-center">Rata-rata Nilai</TableHead>
                        <TableHead className="text-center">Santri Aktif</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLaporanMingguan.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.minggu}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{item.totalSetoran}</Badge>
                          </TableCell>
                          <TableCell className="text-center">{item.totalAyat}</TableCell>
                          <TableCell className="text-center font-semibold text-primary">{item.rataRata}</TableCell>
                          <TableCell className="text-center">{item.santriAktif}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Capaian per Juz */}
          <TabsContent value="capaian">
            <Card>
              <CardHeader>
                <CardTitle>Capaian Hafalan per Juz</CardTitle>
                <CardDescription>Progress penyelesaian hafalan santri per juz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCapaianJuz.map((item) => (
                    <div key={item.juz} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                            Juz {item.juz}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {item.santriSelesai} dari {item.totalSantri} santri
                          </span>
                        </div>
                        <span className="font-semibold text-primary">{item.persentase}%</span>
                      </div>
                      <Progress value={item.persentase} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LaporanHafalan;
