import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Halaqoh {
  id: string;
  nama_halaqoh: string;
}

interface Kelas {
  id: string;
  nama_kelas: string;
}

const mockSantri = [
  { id: "1", nis: "S001", nama: "Muhammad Faiz", halaqoh: "Halaqoh Al-Azhary", kelas: "Paket A Kelas 6", wali: "H. Abdullah", tanggalMasuk: "1/1/2024", status: "Aktif" },
  { id: "2", nis: "S002", nama: "Ahmad Rizky", halaqoh: "Halaqoh Al-Azhary", kelas: "Paket A Kelas 6", wali: "Bapak Hasan", tanggalMasuk: "15/1/2024", status: "Aktif" },
  { id: "3", nis: "S003", nama: "Fatimah Zahra", halaqoh: "Halaqoh Al-Furqon", kelas: "KBTK A", wali: "Ibu Fatimah", tanggalMasuk: "1/2/2024", status: "Aktif" },
  { id: "4", nis: "S004", nama: "Ali Akbar", halaqoh: "Halaqoh Al-Furqon", kelas: "Paket B Kelas 8", wali: "Bapak Ali", tanggalMasuk: "10/2/2024", status: "Aktif" },
  { id: "5", nis: "S005", nama: "Aisyah Nur", halaqoh: "Halaqoh Al-Hidayah", kelas: "KBTK B", wali: "Ibu Khadijah", tanggalMasuk: "15/2/2024", status: "Aktif" },
  { id: "6", nis: "S006", nama: "Umar Faruq", halaqoh: "Halaqoh Al-Hidayah", kelas: "Paket B Kelas 9", wali: "Bapak Umar", tanggalMasuk: "1/3/2024", status: "Aktif" },
];

export default function DataSantri() {
  const [search, setSearch] = useState("");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterKelas, setFilterKelas] = useState("all");
  const [halaqohList, setHalaqohList] = useState<Halaqoh[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);

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

  const filteredSantri = mockSantri.filter((santri) => {
    const matchSearch = santri.nama.toLowerCase().includes(search.toLowerCase()) ||
      santri.nis.toLowerCase().includes(search.toLowerCase());
    const matchHalaqoh = filterHalaqoh === "all" || santri.halaqoh === filterHalaqoh;
    const matchKelas = filterKelas === "all" || santri.kelas === filterKelas;
    return matchSearch && matchHalaqoh && matchKelas;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Data Santri</h1>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Santri
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
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
              <SelectTrigger className="w-full sm:w-[180px]">
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
            <Select value={filterKelas} onValueChange={setFilterKelas}>
              <SelectTrigger className="w-full sm:w-[180px]">
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">NIS</TableHead>
                <TableHead className="text-muted-foreground">Nama Santri</TableHead>
                <TableHead className="text-muted-foreground">Halaqoh</TableHead>
                <TableHead className="text-muted-foreground">Kelas</TableHead>
                <TableHead className="text-muted-foreground">Wali Santri</TableHead>
                <TableHead className="text-muted-foreground">Tanggal Masuk</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSantri.map((santri) => (
                <TableRow key={santri.id}>
                  <TableCell className="font-medium">{santri.nis}</TableCell>
                  <TableCell className="text-primary font-medium">{santri.nama}</TableCell>
                  <TableCell className="text-primary">{santri.halaqoh}</TableCell>
                  <TableCell>{santri.kelas}</TableCell>
                  <TableCell>{santri.wali}</TableCell>
                  <TableCell>{santri.tanggalMasuk}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {santri.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
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
    </Layout>
  );
}
