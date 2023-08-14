import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const handlePassowordChange = (event) => {
        setPassword(event.target.value)
    }

    const submitLogin = async (event) => {
        event.preventDefault()

        const loginSuccessful = await handleLogin({ username, password })
        if (loginSuccessful) {
            setUsername('')
            setPassword('')
        }
    }

    return (
        <div>
            <h2>log in to application</h2>
            <form onSubmit={submitLogin}>
                <div>
                    username
                    <input
                        id='username'
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    password
                    <input
                        id='password'
                        type='password'
                        value={password}
                        onChange={handlePassowordChange}
                    />
                </div>
                <button id='login-button' type='submit'>login</button>
            </form>
        </div>
    )
}

LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired
}

export default LoginForm