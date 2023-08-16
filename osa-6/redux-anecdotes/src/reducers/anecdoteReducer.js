import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        appendAnecdote(state, action) {
            state.push(action.payload)
        },
        // voteAnecdote(state, action) {
        //     const id = action.payload
        //     const anecdoteToVote = state.find(a => a.id === id)
        //     const voted = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 }
        //     return state.map(a => a.id === id ? voted : a)
        // },
        setAnecdotes(state, action) {
            return action.payload
        }
    }
})

export const { appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const createAnecdote = content => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createNew(content)
        dispatch(appendAnecdote(newAnecdote))
    }
}

export const voteAnecdote = id => {
    return async dispatch => {
        await anecdoteService.vote(id)
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export default anecdoteSlice.reducer