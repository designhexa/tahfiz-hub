import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search, Phone, Mail, Users } from "lucide-react";
import { toast } from "sonner";

const mockUstadz = [
  {
    id: "1",
    nama: "Ustadz Ahmad Fauzi",
    email: "ahmad@tahfidz.com",
    phone: "081234567891",
    halaqohCount: 1,
    santriCount: 2,
    halaqohBinaan: ["Halaqoh Al-Azhary"],
    status: "Aktif",
  },
  {
    id: "2",
    nama: "Ustadz Budi Santoso",
    email: "budi@tahfidz.com",
    phone: "081234567892",
    halaqohCount: 1,
    santriCount: 2,
    halaqohBinaan: ["Halaqoh Al-Furqon"],
    status: "Aktif",
  },
  {
    id: "3",
    nama: "Ustadz Muhammad Yusuf",
    email: "yusuf@tahfidz.com",
    phone: "081234567893",
    halaqohCount: 1,
    santriCount: 2,
    halaqohBinaan: ["Halaqoh Al-Hidayah"],
    status: "Aktif",
  },
];

export default function DataUstadz() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const filteredUstadz = mockUstadz.filter((u) =>
    u.nama.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    if (!nama.trim()) {
      toast.error("Nama ustadz harus diisi");
      return;
    }
    toast.success("Ustadz/Ustadzah berhasil ditambahkan");
    setIsDialogOpen(false);
    setNama("");
    setEmail("");
    setPhone("");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Data Ustadz</h1>
            <p className="text-muted-foreground text-sm mt-1">Daftar asatidz pembimbing tahfidz</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Ustadz/Ustadzah
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Ustadz/Ustadzah Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap *</Label>
                  <Input
                    placeholder="Nama lengkap ustadz/ustadzah"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>No. HP</Label>
                  <Input
                    placeholder="Nomor telepon"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSubmit}>Tambah Ustadz</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari ustadz..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">No</TableHead>
                <TableHead className="text-muted-foreground">Nama</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">No. HP</TableHead>
                <TableHead className="text-muted-foreground">Halaqoh Binaan</TableHead>
                <TableHead className="text-muted-foreground">Jumlah Santri</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUstadz.map((ustadz, index) => (
                <TableRow key={ustadz.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium text-primary">{ustadz.nama}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {ustadz.email}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {ustadz.phone}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {ustadz.halaqohBinaan.map((h) => (
                        <Badge key={h} variant="outline" className="text-xs">
                          {h}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {ustadz.santriCount} santri
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {ustadz.status}
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
