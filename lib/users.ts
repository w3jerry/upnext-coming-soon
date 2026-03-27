export interface UserProfile {
    slug: string;
    name: string;
    lastName: string;
    firstName: string;
    title: string;
    email: string;
    phone: string;
    organization: string;
    website?: string;
}

export const users: UserProfile[] = [
    {
        slug: "jaroslav-krajca",
        firstName: "Jaroslav",
        lastName: "Krajča",
        name: "Jaroslav Krajča",
        title: "Jednatel / Product Designer",
        organization: "UPNEXT",
        email: "jaroslav@splx.cz",
        phone: "+420777007042",
        website: "https://upnext.cz"
    },
    {
        slug: "dima-kohut",
        firstName: "Dima",
        lastName: "Kohut",
        name: "Dima Kohut",
        title: "Projektový manažer",
        organization: "UPNEXT",
        email: "dima.kohut@splx.cz",
        phone: "+420 774 101 608",
        website: "https://upnext.cz"
    }
];