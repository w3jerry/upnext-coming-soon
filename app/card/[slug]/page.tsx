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
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Avatar */}
        <div style={styles.avatar}>
          {user.firstName[0]}
        </div>

        {/* Name & Title */}
        <h1 style={styles.name}>{user.name}</h1>
        <p style={styles.title}>
          {user.title}
          <span style={styles.org}> @ {user.organization}</span>
        </p>

        {/* Divider */}
        <div style={styles.divider} />

        {/* QR Code */}
        <div style={styles.qrWrap}>
          <QRCode
            value={vcardUrl}
            size={180}
            bgColor="#f7f6f9"
            fgColor="#0f0c14"
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            viewBox="0 0 256 256"
          />
        </div>

        {/* Save Contact */}
        <a href={`/api/vcard/${user.slug}`} style={styles.btn}>
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
      <div style={styles.footer}>
        <span style={styles.footerText}>© 2025 Upnext</span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f7f6f9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    fontFamily: 'var(--font-outfit), sans-serif',
    cursor: 'auto',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2.5rem 2rem',
    borderRadius: 24,
    border: '1px solid rgba(0,0,0,0.07)',
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 8px 40px rgba(124,77,170,0.06)',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 18,
    background: 'linear-gradient(135deg, #7c4daa, #a16ed4)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    fontWeight: 900,
    marginBottom: 20,
    letterSpacing: '-0.02em',
  },
  name: {
    fontSize: 24,
    fontWeight: 900,
    color: '#0f0c14',
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
    textAlign: 'center' as const,
    margin: 0,
  },
  title: {
    fontSize: 13,
    fontWeight: 400,
    color: 'rgba(15,12,20,0.5)',
    letterSpacing: '0.02em',
    marginTop: 6,
    textAlign: 'center' as const,
  },
  org: {
    color: '#7c4daa',
    fontWeight: 600,
  },
  divider: {
    width: 48,
    height: 1,
    background: 'linear-gradient(90deg, transparent, #7c4daa, transparent)',
    margin: '1.8rem 0',
  },
  qrWrap: {
    background: '#f7f6f9',
    padding: 16,
    borderRadius: 16,
    border: '1px solid rgba(0,0,0,0.05)',
    marginBottom: 24,
    width: '100%',
    maxWidth: 220,
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'transparent',
    color: '#0f0c14',
    fontFamily: 'var(--font-outfit), sans-serif',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textDecoration: 'none',
    padding: '0.75rem 1.6rem',
    borderRadius: 6,
    border: '1px solid rgba(15,12,20,0.22)',
  },
  footer: {
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(15,12,20,0.42)',
    letterSpacing: '0.05em',
  },
};
