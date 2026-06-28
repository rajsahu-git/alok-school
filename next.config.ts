import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/fee-structure',
        destination: '/admission/fee-structure',
        permanent: true,
      },
      {
        source: '/directors-pen',
        destination: '/about-us/directors-pen',
        permanent: true,
      },
      {
        source: '/result',
        destination: '/result/classX',
        permanent: true,
      },
      {
        source: '/our-administrator',
        destination: '/about-us/administrator',
        permanent: true,
      },
      {
        source: '/origin-history',
        destination: '/about-us/origin',
        permanent: true,
      },
      {
        source: '/school-uniform',
        destination: '/online/uniform',
        permanent: true,
      },
      {
        source: '/teacher_category/prt',
        destination: '/academic/team/staff',
        permanent: true,
      },
      {
        source: '/examination-announcement',
        destination: '/academic/examination',
        permanent: true,
      },
      {
        source: '/teacher_category/pet',
        destination: '/academic/team/teachers',
        permanent: true,
      },
      {
        source: '/our-teacher',
        destination: '/academic/team/teachers',
        permanent: true,
      },
      {
        source: '/principals-pen',
        destination: '/about-us/principals-pen',
        permanent: true,
      },
      
    ];
  },
  images: {
    localPatterns: [
      { pathname: "/api/drive-image", search: "**" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },
    ],
  },
};

export default nextConfig;
