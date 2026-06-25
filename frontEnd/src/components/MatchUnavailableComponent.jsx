import { motion } from 'framer-motion'
import Button from "./common/Button"
import { Card, CardContent, CardHeader, CardTitle } from "./common/Card"
import { AlertCircle, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MatchUnavailableComponent() {
  return (
    <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 flex-grow flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="max-w-xl mx-auto bg-gradient-to-b from-slate-900/80 to-slate-950/80 border-white/10 shadow-2xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl flex items-center justify-center text-white gap-2">
              <AlertCircle className="h-6 w-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
              Match Data Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-slate-300 mb-8 max-w-sm mx-auto leading-relaxed text-sm">
              We couldn't retrieve your match data. This could be due to an uncompleted matching process or session expiration.
            </p>
            <div className="flex justify-center">
              <Button variant="outline" asChild className="border-white/10 hover:bg-white/10 text-white rounded-xl">
                <Link to="/" className="flex items-center justify-center">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Return to Matcher
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}