import { users } from '@/lib/users';
import { notFound } from 'next/navigation';
import QRCode from 'react-qr-code';

export default async function BusinessCard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const user = users.find((u) => u.slug === slug);
  if (!user) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const vcardUrl = `${baseUrl}/api/vcard/${user.slug}`;

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 py-10 bg-[#f7f6f9] cursor-auto">
      <div className="w-full max-w-sm flex flex-col items-center px-6 pt-8 pb-6 rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-sm">
        {/* Avatar */}
        <div className="size-14 rounded-xl bg-gradient-to-br from-[#7c4daa] to-[#a16ed4] text-white flex items-center justify-center text-xl font-black mb-4">
          {user.firstName[0]}
        </div>

        {/* Name & Title */}
        <h1 className="text-xl font-black text-[#0f0c14] tracking-tighter leading-tight text-center">
          {user.name}
        </h1>
        <p className="text-xs text-[#0f0c14]/50 tracking-wide mt-1 text-center">
          {user.title}
          <span className="text-[#7c4daa] font-semibold"> @ {user.organization}</span>
        </p>

        {/* Divider */}
        <div className="w-10 h-px my-5 bg-gradient-to-r from-transparent via-[#7c4daa] to-transparent" />

        {/* QR Code */}
        <div className="w-40 p-3 rounded-xl border border-black/5 bg-[#f7f6f9] mb-5">
          <QRCode
            value={vcardUrl}
            size={136}
            bgColor="#f7f6f9"
            fgColor="#0f0c14"
            className="h-auto w-full"
            viewBox="0 0 256 256"
          />
        </div>

        {/* Save Contact */}
        <a
          href={`/api/vcard/${user.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f0c14] tracking-wide no-underline py-2.5 px-5 rounded-lg border border-[#0f0c14]/20 transition-colors hover:border-[#7c4daa] hover:text-[#7c4daa] hover:bg-[#7c4daa]/5"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save to Contacts
        </a>
      </div>

      {/* Footer */}
      <span className="mt-5 text-xs text-[#0f0c14]/40 tracking-widest">
        © 2025 Upnext
      </span>
    </div>
  );
}
