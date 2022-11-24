const Header = ({ course }) => {
  return (
    <h1>
      {course}
    </h1>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} name={part.name} exercises={part.exercises} />)}
    </div>
  )
}

const Part = ({ name, exercises }) => {
  return (
    <div>
      {name} {exercises}
    </div>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Total = ({ parts }) => {
  return (
    <b>
      total of {parts.reduce(
        (total, part) => total + part.exercises
        , 0
        )} exercises
    </b>
  )
}

export default Course