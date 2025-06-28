
/** @type {import('next').NextConfig} */
export default {
  output: 'export',
  // disabilita tutte le funzioni server
  experimental: { 
    appDir: false,
    serverComponents: false,
  },
};
