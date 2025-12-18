import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Building, Users } from "lucide-react";

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
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Ustadz</h1>
          <p className="text-muted-foreground">Daftar asatidz pembimbing tahfidz</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockUstadz.map((ustadz) => (
            <Card key={ustadz.id} className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-lime p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{ustadz.nama}</h3>
                    <p className="text-white/80 text-sm">{ustadz.email}</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    {ustadz.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-destructive" />
                  <span>{ustadz.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{ustadz.halaqohCount} Halaqoh</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{ustadz.santriCount} Santri</span>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-2">Halaqoh Binaan:</p>
                  <div className="flex flex-wrap gap-2">
                    {ustadz.halaqohBinaan.map((halaqoh) => (
                      <Badge key={halaqoh} variant="outline">
                        {halaqoh}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
