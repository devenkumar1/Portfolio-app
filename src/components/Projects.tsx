import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";



function Projects() {
    const projects = [
        {
          id: 1,
          title: "E-Commerce Redesign",
          category: "UX/UI Design",
          image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop",
        },
        {
          id: 2,
          title: "Finance Dashboard",
          category: "Web Application",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        },
        {
          id: 3,
          title: "Travel App",
          category: "Mobile Design",
          image: "https://images.unsplash.com/photo-1551503766-ac63dfa6401c?q=80&w=2070&auto=format&fit=crop",
        },
      ]
  return (
    <section id="projects" className="space-y-8">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-mono font-bold">Featured Projects</h2>
      <Button variant="ghost" className="group">
        View All
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {projects.map((project:any) => (
        <div key={project.id} className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <p className="text-blue-400 text-sm font-medium">{project.category}</p>
            <h3 className="text-xl font-bold mt-1">{project.title}</h3>
            <Button variant="ghost" size="sm" className="w-fit mt-3 p-0 hover:bg-transparent">
              View Project <ExternalLink className="ml-2 w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </section>
  )
}

export default Projects