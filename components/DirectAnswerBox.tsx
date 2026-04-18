interface DirectAnswerBoxProps {
  question: string
  answer: string
  fact?: string
}

export default function DirectAnswerBox({ question, answer, fact }: DirectAnswerBoxProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-8">
      <strong className="text-gray-100">{question}</strong>
      <p className="text-gray-300 mt-2">{answer}</p>
      {fact && <p className="text-gray-400 text-sm mt-1">{fact}</p>}
    </div>
  )
}
