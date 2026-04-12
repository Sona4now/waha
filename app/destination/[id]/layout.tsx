import type { Metadata } from "next";
import { DESTINATIONS } from "@/data/siteData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const dest = DESTINATIONS.find((d) => d.id === id);

  if (!dest) {
    return {
      title: "وجهة غير موجودة — واحة",
    };
  }

  return {
    title: `${dest.name} — السياحة الاستشفائية | واحة`,
    description: dest.description,
    openGraph: {
      title: `${dest.name} — واحة`,
      description: dest.description,
      images: [dest.image],
    },
  };
}

export default function DestinationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
