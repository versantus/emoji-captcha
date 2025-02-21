import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Sentiment from 'sentiment'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    verification: ''
  })
  const [mood, setMood] = useState('neutral')
  const [isHuman, setIsHuman] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const emojis = {
    neutral: "😐",
    happy: "😊",
    sad: "😢",
    angry: "😠"
  }

  const sentimentAnalyzer = new Sentiment()

  const analyzeSentiment = (text: string) => {
    if (!text.trim()) {
      setMood('neutral')
      setIsHuman(false)
      return
    }

    const result = sentimentAnalyzer.analyze(text)
    
    if (result.score > 2) {
      setMood('happy')
      setIsHuman(true)
    } else if (result.score < 0) {
      setMood('angry')
      setIsHuman(false)
    } else {
      setMood('neutral')
      setIsHuman(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <p className="text-gray-600 text-lg font-medium">Contact form with emoji verification</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Please verify you're human:</p>
            <div className="flex items-center gap-4">
              <Input
                value={formData.verification}
                onChange={(e) => {
                  setFormData({...formData, verification: e.target.value})
                  analyzeSentiment(e.target.value)
                }}
                placeholder="Type something nice to make the emoji smile..."
                className="w-full"
              />
              <div className="text-4xl">{emojis[mood as keyof typeof emojis]}</div>
            </div>
          </div>

          <div className="space-y-2">
            <textarea
              placeholder="Your message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!isHuman}
          >
            Send message
          </Button>

          {submitted && isHuman && (
            <p className="text-green-600 text-center">Message sent successfully! Thank you for being human! 🎉</p>
          )}
          {submitted && !isHuman && (
            <p className="text-red-600 text-center">Please say something nice to verify you're human first!</p>
          )}
        </form>
      </Card>
      <div className="fixed bottom-4 text-center w-full text-gray-500 text-sm space-y-2">
        <div>
          Made with ❤️ by <a href="https://www.versantus.co.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">Versantus</a>
        </div>
        <a 
          href="https://github.com/versantus/emoji-captcha#quick-start" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Learn how to embed this form on your website
        </a>
      </div>
    </div>
  )
}

export default App
