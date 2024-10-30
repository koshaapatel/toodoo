"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export default function BreadcrumbClient() {
  const router = useRouter();
  const pathname = usePathname();

  // Split the pathname into segments
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Build the breadcrumbs array
  const breadcrumbs = [
    { name: "Home", href: "/" },
    ...pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const name =
        decodeURIComponent(segment).replace(/-/g, " ").charAt(0).toUpperCase() +
        decodeURIComponent(segment).replace(/-/g, " ").slice(1);
      return { name, href };
    }),
  ];

  // Check if there's a history to go back to
  const hasHistory = window.history.length > 1;

  return (
    <nav
      className="flex items-center bg-gray-100 p-4 rounded-md"
      aria-label="Breadcrumb"
    >
      <Breadcrumb>
        {breadcrumbs.map((crumb, index) => (
          <BreadcrumbItem key={index}>
            <Link href={crumb.href}>
              <span
                className={`hover:underline text-sm font-medium ${
                  index === breadcrumbs.length - 1
                    ? "text-gray-900"
                    : "text-gray-600"
                }`}
              >
                {crumb.name}
              </span>
            </Link>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </nav>
  );
}
