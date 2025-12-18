import { useState } from "react";
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

const mockSantri = [
  { id: "1", nis: "S001", nama: "Muhammad Faiz", halaqoh: "Halaqoh Al-Azhary", wali: "H. Abdullah (Wali Muhammad Faiz)", tanggalMasuk: "1/1/2024", status: "Aktif" },
  { id: "2", nis: "S002", nama: "Ahmad Rizky", halaqoh: "Halaqoh Al-Azhary", wali: "Bapak Hasan (Wali Ahmad Rizky)", tanggalMasuk: "15/1/2024", status: "Aktif" },
  { id: "3", nis: "S003", nama: "Fatimah Zahra", halaqoh: "Halaqoh Al-Furqon", wali: "Ibu Fatimah (Wali Fatimah Zahra)", tanggalMasuk: "1/2/2024", status: "Aktif" },
  { id: "4", nis: "S004", nama: "Ali Akbar", halaqoh: "Halaqoh Al-Furqon", wali: "Bapak Ali (Wali Ali Akbar)", tanggalMasuk: "10/2/2024", status: "Aktif" },
  { id: "5", nis: "S005", nama: "Aisyah Nur", halaqoh: "Halaqoh Al-Hidayah", wali: "Ibu Khadijah (Wali Aisyah Nur)", tanggalMasuk: "15/2/2024", status: "Aktif" },
  { id: "6", nis: "S006", nama: "Umar Faruq", halaqoh: "Halaqoh Al-Hidayah", wali: "Bapak Umar (Wali Umar Faruq)", tanggalMasuk: "1/3/2024", status: "Aktif" },
];

const halaqohOptions = ["Semua Halaqoh", "Halaqoh Al-Azhary", "Halaqoh Al-Furqon", "Halaqoh Al-Hidayah"];

export default function DataSantri() {
  const [search, setSearch] = useState("");
  const [filterHalaqoh, setFilterHalaqoh] = useState("Semua Halaqoh");

  const filteredSantri = mockSantri.filter((santri) => {
    const matchSearch = santri.nama.toLowerCase().includes(search.toLowerCase()) ||
      santri.nis.toLowerCase().includes(search.toLowerCase());
    const matchHalaqoh = filterHalaqoh === "Semua Halaqoh" || santri.halaqoh === filterHalaqoh;
    return matchSearch && matchHalaqoh;
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
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">NIS</TableHead>
                <TableHead className="text-muted-foreground">Nama Santri</TableHead>
                <TableHead className="text-muted-foreground">Halaqoh</TableHead>
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
