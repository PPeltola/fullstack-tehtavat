import { useSelector } from 'react-redux'

const Notification = () => {
    const notification = useSelector(state => state.notification)
    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1
    }

    const notifView = () => (
        <div style={style}>
            {notification}
        </div>
    )

    return (
        <div>
            {notification && notifView()}
        </div>
    )
}

export default Notification