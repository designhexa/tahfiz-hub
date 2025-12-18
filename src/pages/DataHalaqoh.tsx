import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

const mockHalaqoh = [
  { id: "1", nama: "Halaqoh Al-Azhary", ustadz: "Ustadz Ahmad Fauzi", tingkat: "Pemula", jumlahSantri: 2 },
  { id: "2", nama: "Halaqoh Al-Furqon", ustadz: "Ustadz Budi Santoso", tingkat: "Menengah", jumlahSantri: 2 },
  { id: "3", nama: "Halaqoh Al-Hidayah", ustadz: "Ustadz Muhammad Yusuf", tingkat: "Lanjutan", jumlahSantri: 2 },
];

export default function DataHalaqoh() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Data Halaqoh</h1>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Halaqoh
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">Nama Halaqoh</TableHead>
                <TableHead className="text-muted-foreground">Ustadz Pembimbing</TableHead>
                <TableHead className="text-muted-foreground">Tingkat</TableHead>
                <TableHead className="text-muted-foreground">Jumlah Santri</TableHead>
                <TableHead className="text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHalaqoh.map((halaqoh) => (
                <TableRow key={halaqoh.id}>
                  <TableCell className="font-semibold">{halaqoh.nama}</TableCell>
                  <TableCell>{halaqoh.ustadz}</TableCell>
                  <TableCell>{halaqoh.tingkat}</TableCell>
                  <TableCell>{halaqoh.jumlahSantri} santri</TableCell>
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
