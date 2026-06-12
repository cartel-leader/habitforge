"use client"
import { useState } from "react"

interface Habit {
  id: number
  name: string
  emoji: string
  streak: number
  log: boolean[] // last 35 days, true = done
}

const INITIAL_HABITS: Habit[] = [
  { id: 1, name: "Gym Workout", emoji: "💪", streak: 12, log: Array.from({length: 35}, () => Math.random() > 0.3) },
  { id: 2, name: "DSA Practice", emoji: "💻", streak: 8, log: Array.from({length: 35}, () => Math.random() > 0.35) },
  { id: 3, name: "Read 20 mins", emoji: "📚", streak: 5, log: Array.from({length: 35}, () => Math.random() > 0.4) },
]

const COACH_MESSAGES = {
  high: [
    "🔥 12-day streak?! You're not even human anymore. Keep going, beast mode activated.",
    "Look at you go. At this rate you'll have a 100-day streak before finals even start.",
    "This is the kind of consistency that separates toppers from the rest. Don't stop now.",
  ],
  medium: [
    "Decent streak. But 'decent' doesn't get you placed. Push for 2 weeks straight.",
    "You're building momentum. One missed day and it resets — so don't get lazy now.",
    "Solid effort. Imagine where you'd be if you did this for a whole month.",
  ],
  low: [
    "Bro... your streak is basically zero. Today is the day you fix that.",
    "Excuses don't build habits. 10 minutes today is better than 0 minutes for the 5th day straight.",
    "Every long streak starts with day 1. Today can be day 1. Or you can keep scrolling Instagram.",
  ]
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS)
  const [newHabit, setNewHabit] = useState("")
  const [newEmoji, setNewEmoji] = useState("🎯")
  const [coachMsg, setCoachMsg] = useState<string | null>(null)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)

  const EMOJIS = ["🎯", "🏃", "🧘", "🎸", "✍️", "🥗", "💧", "😴", "🎨", "🗣️"]

  function toggleToday(id: number) {
    setHabits(habits.map(h => {
      if (h.id !== id) return h
      const newLog = [...h.log]
      const todayIndex = newLog.length - 1
      newLog[todayIndex] = !newLog[todayIndex]
      const newStreak = newLog[todayIndex] ? h.streak + 1 : Math.max(0, h.streak - 1)
      return { ...h, log: newLog, streak: newStreak }
    }))
  }

  function addHabit() {
    if (!newHabit.trim()) return
    setHabits([...habits, {
      id: Date.now(),
      name: newHabit,
      emoji: newEmoji,
      streak: 0,
      log: Array.from({length: 35}, () => false)
    }])
    setNewHabit("")
  }

  function deleteHabit(id: number) {
    setHabits(habits.filter(h => h.id !== id))
  }

  function getCoachAdvice(habit: Habit) {
    setSelectedHabit(habit)
    let pool
    if (habit.streak >= 10) pool = COACH_MESSAGES.high
    else if (habit.streak >= 4) pool = COACH_MESSAGES.medium
    else pool = COACH_MESSAGES.low
    setCoachMsg(pool[Math.floor(Math.random() * pool.length)])
  }

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0)
  const avgCompletion = habits.length > 0
    ? Math.round(habits.reduce((sum, h) => sum + h.log.filter(Boolean).length, 0) / (habits.length * 35) * 100)
    : 0

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <span className="font-black text-lg bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">HabitForge</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
          AI Coach Active
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-1">🔥</div>
            <div className="text-3xl font-black text-orange-400">{totalStreak}</div>
            <div className="text-xs text-gray-500 mt-1">Combined Streak Days</div>
          </div>
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-1">📊</div>
            <div className="text-3xl font-black text-violet-400">{avgCompletion}%</div>
            <div className="text-xs text-gray-500 mt-1">Avg. Completion Rate</div>
          </div>
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-1">✅</div>
            <div className="text-3xl font-black text-green-400">{habits.length}</div>
            <div className="text-xs text-gray-500 mt-1">Active Habits</div>
          </div>
        </div>

        {/* Add habit */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-8">
          <h3 className="font-bold text-sm text-gray-300 uppercase tracking-wider mb-4">Add New Habit</h3>
          <div className="flex gap-3">
            <div className="flex gap-1 flex-wrap">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setNewEmoji(e)}
                  className={`text-xl w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newEmoji === e ? "bg-orange-500/30 ring-2 ring-orange-400" : "bg-white/5 hover:bg-white/10"}`}>
                  {e}
                </button>
              ))}
            </div>
            <input value={newHabit} onChange={e => setNewHabit(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addHabit()}
              placeholder="e.g. Meditate 10 mins"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-400" />
            <button onClick={addHabit}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-xl font-bold transition-all">
              Add
            </button>
          </div>
        </div>

        {/* Habit list */}
        <div className="flex flex-col gap-4">
          {habits.map(h => (
            <div key={h.id} className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{h.emoji}</span>
                  <div>
                    <h4 className="font-bold text-lg">{h.name}</h4>
                    <p className="text-orange-400 text-sm font-semibold">🔥 {h.streak} day streak</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => getCoachAdvice(h)}
                    className="bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                    🤖 AI Coach
                  </button>
                  <button onClick={() => toggleToday(h.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${h.log[h.log.length-1] ? "bg-green-500 text-white" : "bg-white/10 text-gray-400 hover:bg-white/20"}`}>
                    {h.log[h.log.length-1] ? "✓ Done Today" : "Mark Done"}
                  </button>
                  <button onClick={() => deleteHabit(h.id)}
                    className="text-gray-600 hover:text-red-400 text-xl px-2">×</button>
                </div>
              </div>

              {/* Heatmap */}
              <div className="flex gap-1 flex-wrap">
                {h.log.map((done, i) => (
                  <div key={i}
                    title={`Day ${i+1}`}
                    className={`w-5 h-5 rounded-sm transition-all ${
                      done ? "bg-orange-500" : "bg-white/5"
                    } ${i === h.log.length - 1 ? "ring-2 ring-white/40" : ""}`} />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Last 35 days · darker = today</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Coach Modal */}
      {coachMsg && selectedHabit && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setCoachMsg(null)}>
          <div className="bg-[#15151f] border border-violet-500/30 rounded-2xl p-8 max-w-md" onClick={e => e.stopPropagation()}>
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="font-bold text-lg mb-1">AI Coach — {selectedHabit.name}</h3>
            <p className="text-xs text-gray-500 mb-4">Current streak: {selectedHabit.streak} days</p>
            <p className="text-gray-300 leading-relaxed mb-6">{coachMsg}</p>
            <button onClick={() => setCoachMsg(null)}
              className="bg-violet-600 hover:bg-violet-700 px-6 py-2 rounded-xl font-bold w-full transition-all">
              Got it, let's go 🔥
            </button>
          </div>
        </div>
      )}
    </main>
  )
}