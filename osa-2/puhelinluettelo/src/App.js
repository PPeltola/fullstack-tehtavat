import { useEffect, useState } from 'react'
import entryService from './services/entries'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notif, setNotif] = useState(null)
  const [error, setError] = useState(null)

  const refresh = () => {
    entryService
      .getAll()
      .then(init => setPersons(init))
  }

  useEffect(refresh, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.map(p => p.name).includes(newName) 
        && window.confirm(`${newName} is already added to the phonebook, replace old number with a new one?`)) {
      updatePerson(persons.find(p => p.name === newName).id, newName, newNumber)
    } else {
      entryService
        .addEntry({ name: newName, number: newNumber })
        .then(person => setPersons(persons.concat(person)))
      setNewName('')
      setNewNumber('')
      setNotif(`Added ${newName}`)
      setTimeout(() => setNotif(null), 3000)
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      entryService
        .deleteEntry(id)
        .then(setPersons(persons.filter(p => p.name !== name)))
        .catch(error => {
          setError(`Information of ${name} has already been removed from the server`)
          setPersons(persons.filter(p => p.name !== name))
          setTimeout(() => setError(null), 3000)
        })
        setNotif(`Deleted ${name}`)
        setTimeout(() => setNotif(null), 3000)
    }
  }
  const updatePerson = (id, name, number) => {
    entryService
      .updateEntry(id, { name, number })
      .then(ret => setPersons(persons.map(p => p.id === id ? ret : p)))
      .catch(error => {
        setError(`Information of ${name} has already been removed from the server`)
        setPersons(persons.filter(p => p.name !== name))
        setTimeout(() => setError(null), 3000)
      })
      setNotif(`Changed the number of ${name} to ${number}`)
      setTimeout(() => setNotif(null), 3000)
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
      <Error message={error} />
      <Notification message={notif} />
      <Filter filter={filter} onFilterChange={onFilterChange} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} onNameChange={onNameChange} newNumber={newNumber} onNumberChange={onNumberChange} />
      <h2>Numbers</h2>
      <Book filter={filter} persons={persons} delHandler={deletePerson} />
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

const Book = ({ filter, persons, delHandler }) => {
  return (
    <div>
      {persons.filter(p => p.name.toLowerCase().includes(filter)).map((person, i) =>
        <Entry key={i} person={person} delHandler={delHandler} />)}
    </div>
  )
}

const Entry = ({ person, delHandler }) => (
  <div>
    {person.name} {person.number} <button onClick={() => delHandler(person.id, person.name)}>delete</button>
  </div>
)

const Notification = ({ message }) => {
  const style = {
    color: 'green',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5, 
    fontSize: 24,
    marginBottom: 10,
    padding: 10
  }
  
  if (message === null) {
    return null
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  const style = {
    color: 'red',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5, 
    fontSize: 24,
    marginBottom: 10,
    padding: 10
  }
  
  if (message === null) {
    return null
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default App