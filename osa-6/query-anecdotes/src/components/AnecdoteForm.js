import { useQueryClient, useMutation } from 'react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from "../NotificationContext"

const AnecdoteForm = () => {
    const queryClient = useQueryClient()
    const notifDispatch = useNotificationDispatch()

    const newNoteMutation = useMutation(createAnecdote, {
        onSuccess: (newAnecdote) => {
            const anecdotes = queryClient.getQueryData('anecdotes')
            queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
        },
        onError: (err) => {
            notifDispatch({ type: 'SET', payload: err.response.data.error })
            setTimeout(() => notifDispatch({ type: 'RESET' }), 5000)
        }
    })

    const onCreate = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        newNoteMutation.mutate({ content, votes: 0 })
        notifDispatch({ type: 'SET', payload: `anecdote '${content}' created` })
        setTimeout(() => notifDispatch({ type: 'RESET' }), 5000)
    }

    return (
        <div>
        <h3>create new</h3>
        <form onSubmit={onCreate}>
            <input name='anecdote' />
            <button type="submit">create</button>
        </form>
        </div>
    )
}

export default AnecdoteForm
