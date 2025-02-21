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
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-blue-500 hover:text-blue-700 underline">
              Learn how to embed this form on your website
            </button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:w-[90vw] max-w-3xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto p-3 sm:p-6">
            <DialogHeader className="mb-2 sm:mb-4">
              <DialogTitle className="text-lg sm:text-2xl">Embedding Instructions</DialogTitle>
              <DialogDescription className="text-xs sm:text-base">
                Follow these steps to add the emoji verification to your website:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-1 sm:mb-2 text-xs sm:text-base">1. Add the required script</h3>
                <pre className="bg-gray-100 p-2 sm:p-4 rounded-md overflow-x-auto text-[10px] sm:text-sm">
                  {`<script src="https://emoji-human-app-jdrciuzl.devinapps.com/embed.js"></script>`}
                </pre>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-sm sm:text-base">2. Add the verification element</h3>
                <pre className="bg-gray-100 p-2 sm:p-4 rounded-md overflow-x-auto text-xs sm:text-sm">
                  {`<div id="emoji-verification"></div>`}
                </pre>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-sm sm:text-base">3. Initialize the verification</h3>
                <pre className="bg-gray-100 p-2 sm:p-4 rounded-md overflow-x-auto text-xs sm:text-sm">
                  {`<script>
  const verification = new EmojiVerification({
    element: '#emoji-verification',
    onVerified: (isHuman) => {
      // Handle verification result
      if (isHuman) {
        // Enable your form submission
      }
    }
  });
</script>`}
                </pre>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 space-y-2">
                <p>The verification will automatically style itself to match your website's theme.</p>
                <p>For more advanced customization options, please contact Versantus.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default App
