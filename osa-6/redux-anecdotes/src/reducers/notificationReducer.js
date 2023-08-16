import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setNotificationMessage(state, action) {
            return action.payload
        }
    }
})

export const { setNotificationMessage } = notificationSlice.actions

export const setNotification = (message, seconds) => {
    return async dispatch => {
        dispatch(setNotificationMessage(message))
        setTimeout(() => dispatch(setNotificationMessage(null)), 1000 * seconds)
    }
}

export default notificationSlice.reducer