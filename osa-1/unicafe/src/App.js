import { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addFeedback = (value, setter) => {
    setter(value + 1)
  }

  return (
    <div>
      <Header text="give feedback" />
      <Button handler={() => addFeedback(good, setGood)} text="good" />
      <Button handler={() => addFeedback(neutral, setNeutral)} text="neutral" />
      <Button handler={() => addFeedback(bad, setBad)} text="bad" />
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

const Button = ({ handler, text }) => (
  <button onClick={handler}>
    {text}
  </button>
)

const Header = ({ text }) => (
  <h1>
    {text}
  </h1>
)

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Percentage = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value} %</td>
  </tr>
)

const Statistics = ({ good, neutral, bad }) => {
  if (good + neutral + bad === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={bad + neutral + good} />
        <Percentage text="positive" value={100 * good / (bad + neutral + good)} />
      </tbody>
    </table>
  )
}

export default App