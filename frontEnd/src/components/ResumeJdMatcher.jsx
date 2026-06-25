import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Button,
  Input,
  Textarea,
  Card, CardContent, CardHeader, CardTitle
} from "./common/index"

import { Upload, FileText, Zap, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from "../hooks/use-toast"

export default function ResumeJdMatcher({ setData }) {
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
      toast({
        title: 'Missing information',
        description: 'Please upload a resume and provide a job description.',
        variant: "destructive"
      });
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
    <main className="flex-grow p-4 sm:p-8 max-w-5xl mx-auto w-full flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full py-4"
      >
        <h1 className="text-4xl font-extrabold text-center mb-3 tracking-tight text-white drop-shadow-sm">AI Resume Matcher</h1>
        <p className="text-lg text-center mb-12 text-slate-400 max-w-xl mx-auto leading-relaxed">
          Upload your resume and enter a job description to see how well they match!
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 border-blue-500/10 text-slate-100 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:border-blue-500/20 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-white text-xl font-bold tracking-tight">Upload Resume</CardTitle>
                <FileText className="h-5 w-5 text-blue-400 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-white/5 border-dashed rounded-xl cursor-pointer bg-slate-950/50 hover:bg-slate-900/30 hover:border-blue-500/30 transition-all group shadow-inner"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                      <div className="p-4 rounded-full bg-blue-500/5 group-hover:bg-blue-500/10 mb-4 transition-colors">
                        <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <p className="mb-2 text-sm text-slate-400">
                        <span className="font-semibold text-blue-400 group-hover:text-blue-300">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">PDF, DOCX (MAX. 5MB)</p>
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
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm text-slate-200 flex items-center bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 backdrop-blur-md shadow-sm"
                  >
                    <FileText className="mr-2 text-blue-400 shrink-0" size={18} />
                    <span className="truncate font-medium">{file.name}</span>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 border-cyan-500/10 text-slate-100 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:border-cyan-500/20 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-white text-xl font-bold tracking-tight">Job Description</CardTitle>
                <Sparkles className="h-5 w-5 text-cyan-400 opacity-80" />
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description details here..."
                  className="w-full h-64 resize-none bg-slate-950/50 border-white/5 rounded-xl text-slate-100 p-4 placeholder:text-slate-600 focus-visible:ring-cyan-500/40 focus-visible:border-cyan-500/30 transition-all shadow-inner leading-relaxed"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              size="lg"
              disabled={!file || !jobDescription || isLoading}
              className="w-full sm:w-auto min-w-[220px] shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-6 text-base tracking-wide rounded-xl border-none"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2.5"
                >
                  <Zap className="h-5 w-5" />
                </motion.div>
              ) : (
                <Zap className="mr-2.5 h-5 w-5" />
              )}
              {isLoading ? "Analyzing..." : "Match Resume"}
            </Button>
          </div>
        </form>
      </motion.div>
    </main>
  )
} 