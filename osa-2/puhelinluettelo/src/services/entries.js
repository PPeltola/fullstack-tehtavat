import axios from 'axios'

const baseUrl = "http://localhost:3001/persons"

const getAll = () => {
    const req = axios.get(baseUrl)
    return req.then(resp => resp.data)
}

const addEntry = (newEntry) => {
    const req = axios.post(baseUrl, newEntry)
    return req.then(resp => resp.data)
}

const deleteEntry = (id) => {
    const req = axios.delete(`${baseUrl}/${id}`)
    return req.then(resp => resp.data)
}

const updateEntry = (id, newEntry) => {
    const req = axios.put(`${baseUrl}/${id}`, newEntry)
    return req.then(resp => resp.data)
}

export default { getAll, addEntry, deleteEntry, updateEntry }