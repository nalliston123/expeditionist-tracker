import type React from "react"
import { Loader2 } from "lucide-react"

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 transition-opacity duration-500">
      <Loader2 className="w-12 h-12 animate-spin text-gray-900" />
    </div>
  )
}

export default SplashScreen

