import { format } from 'timeago.js'

const MsgContent = ({ message, own }) => {
    return (
        <>
            <div className=' w-fit mb-6' style={own ? { marginLeft: 'auto' } : {}} >
                <h2 className={`bg-gray-200 p-2 items-center rounded-md`}>{message.text}</h2>
                <span className={`text-[11px] ${own ? 'float-right' : ''}`}>{format(message.createdAt)}</span>
            </div>
        </>
    )
}

export default MsgContent;