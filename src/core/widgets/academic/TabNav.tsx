'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'Articles', href: '/online/artical-media' },
  { label: 'Media', href: '/online/artical-media/media' },
];

export default function TabNav() {
  const pathname = usePathname();
  return (
    <div className="flex gap-2 border-b border-border mb-8">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              active
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
