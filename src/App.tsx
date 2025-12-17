import { Route, Routes } from 'react-router-dom';

import { Layout } from '@/components/layout';
import { PackageBreakdownPage } from '@/pages/package-breakdown';
import { PresetsDownloadsPage } from '@/pages/presets-downloads';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PresetsDownloadsPage />} />
        <Route path="/package-breakdown" element={<PackageBreakdownPage />} />
      </Route>
    </Routes>
  );
}

export default App;
