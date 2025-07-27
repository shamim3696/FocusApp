"use client"

import { useState, useEffect } from "react"
import { Trash2, Plus, Check, Undo2, Target, Sparkles } from "lucide-react"
import Confetti from "react-confetti"
import { Button } from "./components/Button"
import { Input } from "./components/Input"
import { Card } from "./components/Card"

interface Goal {
  id: number
  text: string
  done: boolean
}

function App() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState("")
  const [quote, setQuote] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    updateWindowSize()
    window.addEventListener("resize", updateWindowSize)

    return () => window.removeEventListener("resize", updateWindowSize)
  }, [])

  useEffect(() => {
    const storedGoals = localStorage.getItem("dailyGoals")
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals))
    }

    fetch("https://api.quotable.io/random")
      .then((response) => response.json())
      .then((data) => {
        setQuote(data.content)
        setIsLoading(false)
      })
      .catch(() => {
        setQuote("The way to get started is to quit talking and begin doing.")
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    localStorage.setItem("dailyGoals", JSON.stringify(goals))
    const allGoalsDone = goals.length > 0 && goals.every((goal) => goal.done)

    if (allGoalsDone && !showConfetti) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [goals, showConfetti])

  const handleAddGoal = () => {
    if (newGoal.trim() === "") return
    setGoals([...goals, { id: Date.now(), text: newGoal, done: false }])
    setNewGoal("")
  }

  const handleToggleDone = (id: number) => {
    setGoals(goals.map((goal) => (goal.id === id ? { ...goal, done: !goal.done } : goal)))
  }

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter((goal) => goal.id !== id))
  }

  const handleEditGoal = (id: number, newText: string) => {
    setGoals(goals.map((goal) => (goal.id === id ? { ...goal, text: newText } : goal)))
  }

  const completedGoals = goals.filter((goal) => goal.done).length
  const totalGoals = goals.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Target className="w-8 h-8 text-purple-600" />
              <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Daily Focus
            </h1>
          </div>

          {isLoading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse max-w-md mx-auto"></div>
          ) : (
            <p className="text-gray-600 italic max-w-md mx-auto text-lg leading-relaxed">"{quote}"</p>
          )}

          {totalGoals > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="text-sm text-gray-500">
                Progress: {completedGoals}/{totalGoals}
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out"
                  style={{ width: `${totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          )}
        </header>

        {/* Goal Input */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex gap-3">
              <Input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="What's your main focus today?"
                className="flex-1 border-2 border-gray-200 focus:border-purple-400 transition-colors duration-200"
                onKeyPress={(e) => e.key === "Enter" && handleAddGoal()}
              />
              <Button
                onClick={handleAddGoal}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                disabled={!newGoal.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>
          </div>
        </Card>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.length === 0 ? (
            <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
              <div className="p-8 text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No goals yet. Add your first focus goal above!</p>
              </div>
            </Card>
          ) : (
            goals.map((goal, index) => (
              <Card
                key={goal.id}
                className={`shadow-lg border-0 transition-all duration-300 transform hover:scale-[1.02] animate-slideInUp ${
                  goal.done
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-400"
                    : "bg-white/80 backdrop-blur-sm hover:shadow-xl"
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <Input
                      type="text"
                      value={goal.text}
                      onChange={(e) => handleEditGoal(goal.id, e.target.value)}
                      readOnly={goal.done}
                      className={`flex-1 border-0 bg-transparent text-lg font-medium transition-all duration-200 ${
                        goal.done ? "line-through text-gray-500" : "text-gray-800 focus:bg-white focus:shadow-sm"
                      }`}
                    />

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleToggleDone(goal.id)}
                        variant={goal.done ? "outline" : "default"}
                        size="sm"
                        className={`transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                          goal.done
                            ? "border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
                            : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {goal.done ? (
                          <>
                            <Undo2 className="w-4 h-4 mr-1" />
                            Undo
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Done
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => handleDeleteGoal(goal.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 transform hover:scale-110 active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Celebration Message */}
        {showConfetti && (
          <Card className="mt-8 shadow-xl border-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 text-white animate-bounce">
            <div className="p-6 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2" />
              <h2 className="text-2xl font-bold mb-2">🎉 Congratulations! 🎉</h2>
              <p className="text-lg">You've completed all your goals for today!</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App
