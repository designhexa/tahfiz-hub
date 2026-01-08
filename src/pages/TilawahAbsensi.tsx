import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { useState } from "react";

export default function TilawahAbsensi() {
  const [search, setSearch] = useState("");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterKelas, setFilterKelas] = useState("all");

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Absensi & Setoran Tilawah</h1>
            <p className="text-muted-foreground text-sm mt-1">Kelola absensi dan setoran tilawah santri</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Setoran
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Absensi & Setoran</CardTitle>
          </CardHeader>
          <CardContent>
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
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Pilih Halaqoh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Halaqoh</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterKelas} onValueChange={setFilterKelas}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Santri</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Halaqoh</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Materi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Nilai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Belum ada data absensi tilawah
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
