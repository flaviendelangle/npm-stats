import { Route, Routes } from 'react-router-dom';

import { Layout } from '@/components/layout';
import { CustomPackagesPage } from '@/pages/custom-packages';
import { PackageBreakdownPage } from '@/pages/package-breakdown';
import { PresetsDownloadsPage } from '@/pages/presets-downloads';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PresetsDownloadsPage />} />
        <Route path="/package-breakdown" element={<PackageBreakdownPage />} />
        <Route path="/custom-packages" element={<CustomPackagesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
