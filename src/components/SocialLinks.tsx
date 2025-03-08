import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Github } from "lucide-react";
import Link from "next/link";

function SocialLinks() {
  return (
    <div className="space-y-4">
    <h2 className="text-xl font-semibold">Socials</h2>
    <div className="flex gap-4">
      <Button variant="outline" size="icon" className="rounded-full border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 transition-all">
        <Link href="#" aria-label="Twitter">
          <Twitter className="w-5 h-5" />
        </Link>
      </Button>
      <Button variant="outline" size="icon" className="rounded-full border-gray-700 hover:border-blue-600 hover:bg-blue-600/10 transition-all">
        <Link href="#" aria-label="LinkedIn">
          <Linkedin className="w-5 h-5" />
        </Link>
      </Button>
      <Button variant="outline" size="icon" className="rounded-full border-gray-700 hover:border-gray-400 hover:bg-gray-700/50 transition-all">
        <Link href="#" aria-label="GitHub">
          <Github className="w-5 h-5" />
        </Link>
      </Button>
    </div>
  </div>
  )
}

export default SocialLinks