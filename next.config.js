/** @type {import('next').NextConfig} */

// ============================================================
//  NEXT.JS KONFIGURATION
//  - transpilePackages: nötig damit three / drei sauber bauen
//  - GLSL Loader: erlaubt import von .glsl/.vert/.frag Dateien
//  - images: hier deine externen Bild-Domains eintragen
// ============================================================

const nextConfig = {
  reactStrictMode: true,

  // Three.js & R3F Pakete müssen transpiliert werden (ESM)
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],

  images: {
    // Falls du Bilder von externen CDNs (z.B. Cloudinary) lädst,
    // hier die Domain ergänzen:
    remotePatterns: [
      // { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  webpack: (config) => {
    // GLSL Shader Dateien als raw String importierbar machen
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    });
    return config;
  },
};

module.exports = nextConfig;
