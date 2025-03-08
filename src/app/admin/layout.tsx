"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  User, 
  Briefcase, 
  Code, 
  GraduationCap, 
  Award, 
  Certificate, 
  Contact, 
  Home,
  LogOut,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // If not authenticated, show loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }
  
  // If not authenticated, redirect to login (this should be handled by middleware,
  // but we add this as an extra layer of protection)
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }
  
  const navItems = [
    { name: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Dashboard", href: "/admin", icon: <User className="w-5 h-5" /> },
    { name: "Bio", href: "/admin/bio", icon: <User className="w-5 h-5" /> },
    { name: "Projects", href: "/admin/projects", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Skills", href: "/admin/skills", icon: <Code className="w-5 h-5" /> },
    { name: "Experience", href: "/admin/experience", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Education", href: "/admin/education", icon: <GraduationCap className="w-5 h-5" /> },
    { name: "Achievements", href: "/admin/achievements", icon: <Award className="w-5 h-5" /> },
    { name: "Certificates", href: "/admin/certificates", icon: <Certificate className="w-5 h-5" /> },
    { name: "Contact", href: "/admin/contact", icon: <Contact className="w-5 h-5" /> },
  ];
  
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Portfolio Admin</h1>
          {session?.user?.name && (
            <p className="text-sm text-gray-500 mt-1">Welcome, {session.user.name}</p>
          )}
        </div>
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
} 