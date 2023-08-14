import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ addBlog }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value)
    }

    const handleAuthorChange = (event) => {
        setNewAuthor(event.target.value)
    }

    const handleUrlChange = (event) => {
        setNewUrl(event.target.value)
    }

    const createBlog = async (event) => {
        event.preventDefault()

        const blogObject = {
            title: newTitle,
            author: newAuthor,
            url: newUrl,
        }

        const creationSuccesful = await addBlog(blogObject)
        if (creationSuccesful) {
            setNewTitle('')
            setNewAuthor('')
            setNewUrl('')
        }
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={createBlog}>
                <div>
                    title:
                    <input
                        id='new-blog-title'
                        value={newTitle}
                        onChange={handleTitleChange}
                        placeholder='title'
                    />
                </div>
                <div>
                    author:
                    <input
                        id='new-blog-author'
                        value={newAuthor}
                        onChange={handleAuthorChange}
                        placeholder='author'
                    />
                </div>
                <div>
                    url:
                    <input
                        id='new-blog-url'
                        value={newUrl}
                        onChange={handleUrlChange}
                        placeholder='url'
                    />
                </div>
                <button id='new-blog-submit' type='submit'>create</button>
            </form>
        </div>
    )
}

BlogForm.propTypes = {
    addBlog: PropTypes.func.isRequired
}

export default BlogForm