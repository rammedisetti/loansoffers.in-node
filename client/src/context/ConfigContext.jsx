import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api.js';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState({ gtmId: '', blogAuthorName: 'loansoffers.in Team', blogAuthorAvatar: '' });
  const [loanTypes, setLoanTypes] = useState([]);

  useEffect(() => {
    api.get('/config').then(setConfig).catch(() => {});
    api.get('/loan-types').then(setLoanTypes).catch(() => {});
  }, []);

  // Inject Google Tag Manager once we know the container id.
  useEffect(() => {
    if (!config.gtmId || document.getElementById('gtm-script')) return;
    const s = document.createElement('script');
    s.id = 'gtm-script';
    s.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${config.gtmId}');`;
    document.head.appendChild(s);
  }, [config.gtmId]);

  const aprBySlug = Object.fromEntries(loanTypes.map((t) => [t.slug, t.apr]));

  return (
    <ConfigContext.Provider value={{ config, loanTypes, aprBySlug }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
  return ctx;
}
