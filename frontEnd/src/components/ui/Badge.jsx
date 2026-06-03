import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

// Keeping this internal to the file fixes the Fast Refresh warning
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-600 text-white shadow hover:bg-blue-600/80",
        secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80",
        destructive: "border-transparent bg-red-600 text-white shadow hover:bg-red-600/80",
        outline: "text-gray-900 border-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }