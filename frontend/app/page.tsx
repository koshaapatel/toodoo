import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import logo from '@/public/assets/logo.svg'
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src={logo}
              alt="TODO App Logo"
              width={150}
              height={150}
              className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
            />
          </div>

          {/* App Name */}
          <h1 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl mb-8">
            TODO App
          </h1>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <Link href="/shared" className="w-full sm:w-1/2">
              <Button
                variant="default"
                size="lg"
                className="w-full bg-gray-700 hover:bg-gray-600"
              >
                Access Existing TODO List
              </Button>
            </Link>
            <Link href="/new" className="w-full sm:w-1/2">
              <Button
                variant="secondary"
                size="lg"
                className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Create New TODO List
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
