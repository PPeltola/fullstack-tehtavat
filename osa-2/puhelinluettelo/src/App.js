import { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const hook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(resp => setPersons(resp.data))
  }

  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.map(p => p.name).includes(newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat({ name: newName, number: newNumber }))
      setNewName('')
      setNewNumber('')
    }
    
  }

  const onNameChange = (event) => {
    setNewName(event.target.value)
  }

  const onNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const onFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onFilterChange={onFilterChange} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} onNameChange={onNameChange} newNumber={newNumber} onNumberChange={onNumberChange} />
      <h2>Numbers</h2>
      <Book filter={filter} persons={persons} />
    </div>
  )

}

const Filter = ({ filter, onFilterChange }) => (
  <div>
    filter shown with <input value={filter} onChange={onFilterChange} />
  </div>
)

const PersonForm = ({ addPerson, newName, onNameChange, newNumber, onNumberChange }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Book = ({ filter, persons }) => {
  return (
    <div>
      {persons.filter(p => p.name.toLowerCase().includes(filter)).map((person, i) =>
        <Entry key={i} person={person} />)}
    </div>
  )
}

const Entry = ({ person }) => (
  <div>
    {person.name} {person.number}
  </div>
)

export default App