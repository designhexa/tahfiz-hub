import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Clock,
  Users,
  BookOpen,
  Target,
  Calendar
} from "lucide-react";

const UjianTasmi = () => {
  const features = [
    {
      icon: Target,
      title: "Ujian Per Juz",
      description: "Ujian tasmi' lengkap per juz setelah menyelesaikan semua tahapan drill"
    },
    {
      icon: Users,
      title: "Jadwal Ujian",
      description: "Penjadwalan ujian tasmi' dengan penguji yang ditentukan"
    },
    {
      icon: BookOpen,
      title: "Penilaian Komprehensif",
      description: "Evaluasi kelancaran, tajwid, makharijul huruf, dan fashahah"
    },
    {
      icon: Calendar,
      title: "Riwayat Ujian",
      description: "Rekap semua hasil ujian tasmi' santri"
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Ujian Tasmi'</h1>
          <p className="text-muted-foreground">
            Ujian hafalan 1 juz penuh setelah menyelesaikan semua tahapan drill
          </p>
        </div>

        {/* Coming Soon Banner */}
        <Card className="border-2 border-dashed border-amber-500/50 bg-amber-500/5">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-amber-500 animate-pulse" />
              <Badge variant="outline" className="text-amber-600 border-amber-500">
                Coming Soon
              </Badge>
            </div>
            <h2 className="text-xl font-semibold mb-2">Fitur Sedang Dikembangkan</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Halaman Ujian Tasmi' sedang dalam tahap pengembangan. 
              Fitur ini akan tersedia setelah sistem drill hafalan berjalan dengan baik.
            </p>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Fitur yang Akan Tersedia:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-2">
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
            <h4 className="font-semibold mb-2">ℹ️ Alur Ujian Tasmi'</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Santri harus menyelesaikan semua tahapan drill untuk 1 juz</li>
              <li>• Setelah semua drill terpenuhi, santri dapat didaftarkan untuk ujian tasmi'</li>
              <li>• Ujian dilakukan di hadapan penguji yang ditunjuk</li>
              <li>• Hasil ujian akan dicatat dan menjadi bagian dari rapor semester</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UjianTasmi;
