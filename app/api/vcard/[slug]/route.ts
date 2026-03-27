import { NextRequest, NextResponse } from 'next/server';
import VCard from 'vcard-creator';
import { users } from '@/lib/users';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const user = users.find((u) => u.slug === slug);
    if (!user) return new NextResponse("Not Found", { status: 404 });

    // Initialize the VCard correctly
    const vcard = new VCard()
        .addName(user.lastName, user.firstName)
        .addEmail(user.email)
        .addPhoneNumber(user.phone, 'WORK')
        .addJobtitle(user.title)
        .addCompany(user.organization);

    if (user.website) {
        vcard.addURL(user.website);
    }

    return new NextResponse(vcard.toString(), {
        headers: {
            'Content-Type': 'text/vcard; charset=utf-8',
            'Content-Disposition': `attachment; filename="${user.slug}.vcf"`,
        },
    });
}