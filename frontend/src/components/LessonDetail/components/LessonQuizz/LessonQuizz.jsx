import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { selectAuth } from '@/store/auth/auth.slice'
import { useAppSelector } from '@/store/hooks'
import { Lesson } from '@/types/lesson.type'
import { FC, useEffect, useState } from 'react'

interface LessonQuizzProp {
  lesson: Lesson
}

type LocalData = Record<
  string,
  {
    submitted: boolean
    answers: Record<number, string>
    score: number
    count: number
  }
>

const quizzLocalKey = 'quizz-local'

const LessonQuizz: FC<LessonQuizzProp> = ({ lesson }) => {
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [score, setScore] = useState(0)
  const [localData, setLocalData] = useState<LocalData>({})
  const [count, setCount] = useState(0)
  const auth = useAppSelector(selectAuth)

  useEffect(() => {
    const initLocaldataStr =
      localStorage.getItem(quizzLocalKey + auth.user._id) || '{}'
    const initLocaldata: LocalData = JSON.parse(initLocaldataStr)
    setLocalData(initLocaldata)
    const currentQuizz = initLocaldata[lesson._id]
    if (currentQuizz) {
      setSubmitted(currentQuizz.submitted)
      setAnswers(currentQuizz.answers)
      setScore(currentQuizz.score)
      setCount(currentQuizz.count ?? 0)
    }
  }, [lesson, auth])

  const handleOptionChange = (questionIndex: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }))
  }

  const handleSubmit = () => {
    let newScore = 0
    lesson.questions?.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        newScore++
      }
    })
    setScore(newScore)
    setSubmitted(true)
    const newCount = count + 1
    setCount(newCount)

    const newLocalData = { ...localData }
    newLocalData[lesson._id] = {
      answers: answers,
      score: newScore,
      submitted: !submitted,
      count: newCount,
    }

    localStorage.setItem(
      quizzLocalKey + auth.user._id,
      JSON.stringify(newLocalData)
    )
  }

  const handleReset = () => {
    setAnswers({})
    setScore(0)
    setSubmitted(false)
  }

  return (
    <>
      <div className="space-y-6 max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-center">
          {lesson.title} - Trắc nghiệm (Tổng số lần làm: {count})
        </h1>
        {submitted && (
          <div className="flex gap-4 justify-center items-center">
            <div className="text-center text-xl font-semibold">
              ✅ Bạn đúng {score}/{lesson.questions?.length}
            </div>
            <div>
              <Button onClick={handleReset} variant={'outline'}>
                Làm lại
              </Button>
            </div>
          </div>
        )}

        {lesson.questions?.map((question, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 py-6">
              <p className="font-semibold">
                Câu {index + 1}: {question.question}
              </p>
              <RadioGroup
                onValueChange={(value) => handleOptionChange(index, value)}
                value={answers[index] ?? ''}
              >
                {Object.entries(question.options).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={key}
                      id={`${index}-${key}`}
                      disabled={submitted}
                    />
                    <Label htmlFor={`${index}-${key}`}>{value}</Label>
                  </div>
                ))}
              </RadioGroup>

              {submitted && (
                <p
                  className={`text-sm ${
                    answers[index] === question.correctAnswer
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  Đáp án đúng: {question.options[question.correctAnswer]}
                </p>
              )}
            </CardContent>
          </Card>
        ))}

        {!submitted && (
          <Button className="w-full" onClick={handleSubmit}>
            Nộp bài
          </Button>
        )}
      </div>
    </>
  )
}

export default LessonQuizz
