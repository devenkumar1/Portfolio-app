"use client";

import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-center">
      <div className="container mx-auto px-6 py-12 text-center">
        <WifiOff className="w-16 h-16 mx-auto mb-6 text-gray-400" />
        <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          It seems you're not connected to the internet. Some features may not be available until you reconnect.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Page
          </Button>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 