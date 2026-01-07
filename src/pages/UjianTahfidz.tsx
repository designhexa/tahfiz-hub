import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const UjianTahfidz = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-purple-500" />
            Ujian Tahfidz
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Ujian tahfidz Al-Qur'an
          </p>
        </div>

        {/* Placeholder Content */}
        <Card>
          <CardHeader>
            <CardTitle>Halaman Ujian Tahfidz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Halaman ini sedang dalam pengembangan.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UjianTahfidz;
