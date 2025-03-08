import { Mail } from "lucide-react";

function ContactInfo() {
  return (
    <div className="space-y-4">
    <h2 className="text-xl font-semibold">Let's Connect</h2>
    <div className="flex flex-col space-y-3">
      <a href="mailto:tony@example.com" className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors">
        <Mail className="w-5 h-5" /> tony@example.com
      </a>
      <a href="tel:+1234567890" className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors">
        <span className="w-5 h-5 flex items-center justify-center">📞</span> +1 (234) 567-890
      </a>
    </div>
  </div>
  )
}

export default ContactInfo