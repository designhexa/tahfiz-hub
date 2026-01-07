import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SetoranHafalan from "./pages/SetoranHafalan";
import AbsensiSetoran from "./pages/AbsensiSetoran";
import LaporanHafalan from "./pages/LaporanHafalan";
import DrillHafalan from "./pages/DrillHafalan";
import UjianTasmi from "./pages/UjianTasmi";
import UjianTahfidz from "./pages/UjianTahfidz";
import RaporSemester from "./pages/RaporSemester";
import DataSantri from "./pages/DataSantri";
import DataHalaqoh from "./pages/DataHalaqoh";
import DataUstadz from "./pages/DataUstadz";
import DataUsers from "./pages/DataUsers";
import Pengumuman from "./pages/Pengumuman";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/absensi" element={<AbsensiSetoran />} />
            <Route path="/setoran" element={<SetoranHafalan />} />
            <Route path="/laporan" element={<LaporanHafalan />} />
            <Route path="/drill" element={<DrillHafalan />} />
            <Route path="/ujian-tasmi" element={<UjianTasmi />} />
            <Route path="/ujian-tahfidz" element={<UjianTahfidz />} />
            <Route path="/rapor" element={<RaporSemester />} />
            <Route path="/santri" element={<DataSantri />} />
            <Route path="/halaqoh" element={<DataHalaqoh />} />
            <Route path="/ustadz" element={<DataUstadz />} />
            <Route path="/users" element={<DataUsers />} />
            <Route path="/pengumuman" element={<Pengumuman />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
