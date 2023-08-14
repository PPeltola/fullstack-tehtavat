import React from 'react'
import '@testing-library/jest-dom/'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('creation is submitted correctly', async () => {
    const createBlog = jest.fn()

    render(<BlogForm addBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const sendButton = screen.getByText('create')

    await userEvent.type(titleInput, 'hondan takapenkillä')
    await userEvent.type(authorInput, 'kimmo')
    await userEvent.type(urlInput, 'www.honda.fi')
    await userEvent.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('hondan takapenkillä')
    expect(createBlog.mock.calls[0][0].author).toBe('kimmo')
    expect(createBlog.mock.calls[0][0].url).toBe('www.honda.fi')
})