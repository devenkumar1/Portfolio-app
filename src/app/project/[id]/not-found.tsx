import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex items-center mb-8">
          <Link href="/all-projects">
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Project Not Found</h1>
        </div>
        
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/all-projects">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
              Back to All Projects
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
