import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  TrendingUp, 
  BookOpen, 
  CheckCircle, 
  Calendar,
  Download,
  Clock
} from "lucide-react";

const RaporSemester = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Statistik Hafalan per Semester",
      description: "Ringkasan total hafalan, progress per juz, dan pencapaian target semester"
    },
    {
      icon: BookOpen,
      title: "Progress Drill Hafalan",
      description: "Visualisasi progress melalui tahapan drill (Drill 1 & 2, ½ Juz, 1 Juz)"
    },
    {
      icon: CheckCircle,
      title: "Gabungan Data Penilaian",
      description: "Integrasi data setoran harian dan drill hafalan dalam satu rapor"
    },
    {
      icon: FileText,
      title: "Analisis Tajwid & Fashahah",
      description: "Evaluasi kualitas bacaan berdasarkan tajwid, makharijul huruf, dan kelancaran"
    },
    {
      icon: Calendar,
      title: "Rekap Kehadiran & Prestasi",
      description: "Statistik absensi dan pencapaian prestasi selama semester"
    },
    {
      icon: Download,
      title: "Export ke PDF",
      description: "Generate rapor dalam format PDF untuk dicetak atau dibagikan"
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-lime-500 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Rapor Semester</h1>
          <p className="text-muted-foreground">
            Laporan komprehensif perkembangan hafalan santri per semester
          </p>
        </div>

        {/* Coming Soon Banner */}
        <Card className="border-2 border-dashed border-primary/50 bg-primary/5">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-primary animate-pulse" />
              <Badge variant="outline" className="text-primary border-primary">
                Coming Soon
              </Badge>
            </div>
            <h2 className="text-xl font-semibold mb-2">Fitur Sedang Dikembangkan</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Halaman Rapor Semester sedang dalam tahap pengembangan. 
              Fitur ini akan tersedia dalam waktu dekat dengan berbagai kemampuan pelaporan yang komprehensif.
            </p>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Fitur yang Akan Tersedia:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-lime-500 flex items-center justify-center mb-2">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-2">ℹ️ Informasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Rapor akan menggabungkan seluruh data hafalan selama 1 semester</li>
              <li>• Sistem checkpoint manzil memastikan santri tidak dapat lanjut jika belum lulus tahap sebelumnya</li>
              <li>• Admin dan Asatidz dapat mengelola rapor untuk semua santri</li>
              <li>• Wali Santri dapat melihat rapor anak mereka di menu "Rapor Saya"</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RaporSemester;
