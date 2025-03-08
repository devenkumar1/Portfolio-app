import Image from "next/image";


function ProfileHeader() {
  return (
    <div className="flex items-center gap-5">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-md opacity-70"></div>
      <Image
        src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop"
        alt="Tony B."
        width={80}
        height={80}
        className="rounded-full relative border-2 border-white/20 object-cover"
      />
    </div>
    <div>
      <h1 className="text-3xl font-mono font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        TONY B.
      </h1>
      <p className="text-gray-400 font-medium tracking-wider">PRODUCT DESIGNER</p>
    </div>
  </div>    
  )
}

export default ProfileHeader
