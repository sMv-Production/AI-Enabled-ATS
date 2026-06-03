import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Upload, FileText, Zap } from 'lucide-react' // 🔑 Removed Github from here
import { useNavigate } from 'react-router-dom'
import { useToast } from "../hooks/use-toast"

export function ResumeJdMatcher({ setData }) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!file || !jobDescription) {
      setIsLoading(false);
      alert('Please upload a resume and provide a job description.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/match`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error processing the file');
      }

      const result = await response.json();
      setData(result);
      if (result) {
        navigate('/match', { replace: true })
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your request.';
      toast({
        title: 'An error occurred while processing your request.',
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">ResuMatch AI</span>
          </div>   
        </div>
      </motion.header>

      <main className="flex-grow p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center mb-2">AI Resume Matcher</h1>
          <p className="text-xl text-center mb-8 text-gray-600">
            Upload your resume and enter a job description to see how well they match!
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOCX (MAX. 5MB)</p>
                      </div>
                      <Input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.docx"
                      />
                    </label>
                  </div>
                  {file && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 text-sm text-gray-500 flex items-center"
                    >
                      <FileText className="mr-2" size={16} />
                      {file.name}
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste the job description here..."
                    className="w-full h-64 resize-none"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={!file || !jobDescription || isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Zap className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Analyzing..." : "Match Resume"}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>

      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-100 mt-auto"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">ResuMatch AI</h2>
              <p className="text-gray-600">Empowering your job search with AI</p>
            </div>
            <div className="flex space-x-6">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                {/* 🔑 Safe inline custom GitHub SVG implementation below */}
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <p className="text-base text-gray-400 md:order-1">
              &copy; 2026 ResuMatch AI. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}