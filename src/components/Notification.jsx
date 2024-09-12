const Notification = ({message, error}) => {
    return (
        <div className={ ! error ? "notification" : "error"}>
            {message}
        </div>
    )
}

export default Notification