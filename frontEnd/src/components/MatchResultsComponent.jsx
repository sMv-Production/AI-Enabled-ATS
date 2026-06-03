import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Zap, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function MatchResultsComponent({ data }) {
  const matchData = {
    overallMatch: data?.match_score || 0,
    summary: data?.summary || "",
    missingSkills: data?.missing_criteria ? [...data.missing_criteria] : [],
    strongPoints: data?.strengths ? [...data.strengths] : [],
    suggestedImprovements: data?.suggested_resume_improvements ? [...data.suggested_resume_improvements] : []
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">ResuMatch AI</span>
          </div>
          <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center">
            <ChevronLeft className="mr-1" />
            Back to Matcher
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center mb-8">Your Resume Match Results</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Overall Match</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200 stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    ></circle>
                    <motion.circle
                      className="text-blue-600 progress-ring__circle stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      initial={{ strokeDasharray: "251.2 251.2", strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * matchData.overallMatch) / 100 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    ></motion.circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">{matchData.overallMatch}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{matchData.summary}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Missing Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {matchData.missingSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Strong Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {matchData.strongPoints.map((skill, index) => (
                    <Badge key={index} variant="default">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Suggested Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {matchData.suggestedImprovements.map((suggestion, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {suggestion}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <footer className="bg-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">
          <p>&copy; 2026 ResuMatch AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}