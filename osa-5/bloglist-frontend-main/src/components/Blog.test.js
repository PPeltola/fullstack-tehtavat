import React from 'react'
import '@testing-library/jest-dom/'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author by default', () => {
    const blog = {
        title: 'hondan takapenkillä',
        author: 'kimmo',
        url: 'www.testi.fi',
        likes: 4
    }

    render(<Blog blog={blog} />)

    screen.getByText('hondan takapenkillä', { exact: false })
    screen.getByText('kimmo', { exact: false })
})

test('doesn\'t render url or likes by default', () => {
    const blog = {
        title: 'hondan takapenkillä',
        author: 'kimmo',
        url: 'www.testi.fi',
        likes: 4
    }

    render(<Blog blog={blog} />)

    expect(screen.queryByText('www.testi.fi', { exact: false })).toBeNull()
    expect(screen.queryByText('likes 4', { exact: false })).toBeNull()
})

test('all fields are rendered in full view', async () => {
    const blog = {
        title: 'hondan takapenkillä',
        author: 'kimmo',
        url: 'www.testi.fi',
        likes: 4,
        user: {
            name: 'jarmo'
        }
    }

    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    screen.getByText('www.testi.fi', { exact: false })
    screen.getByText('likes 4', { exact: false })
    screen.getByText('jarmo', { exact: false })
})

test('like handler is called correctly', async () => {
    const blog = {
        title: 'hondan takapenkillä',
        author: 'kimmo',
        url: 'www.testi.fi',
        likes: 4,
        user: {
            name: 'jarmo'
        }
    }

    const mockHandler = jest.fn()

    render(<Blog blog={blog} handleUpdate={mockHandler} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(1)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
})