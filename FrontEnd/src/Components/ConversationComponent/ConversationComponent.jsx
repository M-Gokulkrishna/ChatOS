import axios from 'axios';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import DefaultUserPic from '../../assets/Images/userProfileDefault.png';
import { FaAlignRight, FaArrowLeft, FaPaperclip, FaPaperPlane, FaSearch } from 'react-icons/fa';
// 
function FormatMessageBucket(MessageBucket) {
    return Object.entries(MessageBucket).map((eachMessageBucket) => {
        return {
            MessageBucketDate: eachMessageBucket[0],
            Messages: eachMessageBucket[1]
        }
    });
}
// 
const ConversationComponent = React.memo(({ socketIO, PageWidth, SelectedProfile, setSelectedProfile, setUtilityTool }) => {
    const MessageInputRef = useRef(null);
    const ChattingContainerRef = useRef(null);
    const MessageSelectEventRef = useRef(null);
    const [userConversations, setUserConversations] = useState([]);
    const [deleteMessageFlag, setDeleteMessageFlag] = useState({
        Flag: false,
        Type: "All"
    });
    const userSessionState = useSelector(state => state.userSessionState);
    const [selectedMessageDetails, setSelectedMessageDetails] = useState({});
    // 
    const { mutate: getStoredMessages } = useMutation({
        mutationFn: async () => {
            const data = await axios.post("http://localhost:8080/api/userDetail/storedMessages", { userID: userSessionState.userSessionData.userID, FriendUserID: SelectedProfile._id }, { withCredentials: true });
            return data;
        },
        onSuccess: (storedMessagesResponse) => {
            if (storedMessagesResponse?.data?.RequestStatus === "Stored Message Fetched Successfully!") {
                setUserConversations(FormatMessageBucket(storedMessagesResponse?.data?.StoredMessages?.AllMessages));
            }
        }
    })
    // 
    useEffect(() => {
        if (SelectedProfile.chattingState) {
            getStoredMessages();
        }
    }, [SelectedProfile]);
    // 
    useEffect(() => {
        if (ChattingContainerRef.current) {
            ChattingContainerRef.current.scrollTo({
                top: ChattingContainerRef.current.offsetHeight,
                left: 0
            });
        }
    }, [userConversations]);
    // 
    useEffect(() => {
        socketIO.on("MessageFetchResponse", (MessageFetchResponse) => {
            if (MessageFetchResponse === "Message fetched Successfully!") {
                getStoredMessages();
            }
        });
        socketIO.on("MessageDeleteResponse", (MessageDeleteResponse) => {
            if (MessageDeleteResponse === "Message Deleted Successfully for All!" || MessageDeleteResponse === "Message Deleted Successfully for user!") {
                getStoredMessages();
                setDeleteMessageFlag({
                    Flag: false,
                    Type: "All"
                });
            }
        });
    }, []);
    // 
    function handleSendMessage() {
        const MessageContent = MessageInputRef.current.value;
        if (MessageContent) {
            const DateInstance = new Date();
            const CurrentDate = DateInstance.getDate().toString().padStart(2, 0) + "-" + (DateInstance.getMonth() + 1).toString().padStart(2, 0) + "-" + DateInstance.getFullYear();
            const CurrentTime = (DateInstance.getHours() % 12 || 12).toString().padStart(2, 0) + ":" + DateInstance.getMinutes().toString().padStart(2, 0) + ((DateInstance.getHours() >= 12) ? " PM" : " AM");
            socketIO.emit("sendMessage",
                JSON.stringify(
                    {
                        userID: userSessionState.userSessionData.userID,
                        FriendUserID: SelectedProfile._id,
                        LastSeenDate: CurrentDate,
                        LastSeenTime: CurrentTime,
                        MessagePayload: MessageContent
                    }
                ));
            MessageInputRef.current.value = "";
        }
    }
    // 
    function handleMessageDeleteEventCapture(e, MessageType, MessageDate, MessageSessionBucket) {
        if (e.type === "mousedown" || e.type === "touchstart") {
            MessageSelectEventRef.current = setTimeout(() => {
                setSelectedMessageDetails(
                    {
                        userID: userSessionState.userSessionData.userID,
                        FriendUserID: SelectedProfile._id,
                        MessageDate,
                        MessagePayload: MessageSessionBucket[1] + "--" + MessageSessionBucket[2]
                    }
                );
                if (MessageType === "From-Message") {
                    setDeleteMessageFlag({
                        Flag: true,
                        Type: "user"
                    });
                }
                if (MessageType === "To-Message") {
                    setDeleteMessageFlag({
                        Flag: true,
                        Type: "All"
                    });
                }
            }, 1200);
        }
        else {
            clearTimeout(MessageSelectEventRef.current);
        }
    }
    // 
    function handleMessageDelete(DeleteType) {
        socketIO.emit("deleteMessage", JSON.stringify({ DeleteType, ...selectedMessageDetails }));
    }
    // 
    return (
        <div className='Chatting-Container' style={(SelectedProfile.chattingState && PageWidth <= 700) ? { zIndex: "2" } : { zIndex: "1" }}>
            {
                deleteMessageFlag.Flag &&
                <div className="deleteMessage-ConfirmationBox">
                    <b>Are you sure delete Message?</b>
                    <strong>
                        {
                            deleteMessageFlag.Type === "All" &&
                            <p onClick={() => handleMessageDelete("Delete for all")}>Delete Permanently</p>
                        }
                        <p onClick={() => handleMessageDelete("Delete for user")}>Delete for Me</p>
                        <p onClick={() => setDeleteMessageFlag({ Flag: false, Type: "All" })}>Cancel</p>
                    </strong>
                </div>
            }
            <header>
                <div>
                    <span onClick={() => setSelectedProfile({})}>
                        <FaArrowLeft />
                    </span>
                    {
                        !SelectedProfile.profileImageFile &&
                        <img src={DefaultUserPic} alt="" />
                    }
                    {
                        SelectedProfile.profileImageFile &&
                        <img src={`http://localhost:8080/Uploads/ProfileImages/${SelectedProfile.profileImageFile}`} alt="" />
                    }
                    <b>{SelectedProfile.profileName}</b>
                </div>
                <div>
                    {/* <span className='Like-Btn'> */}
                    {/* <FaRegHeart /> */}
                    {/* <FaHeart /> */}
                    {/* </span> */}
                    <span className='Utility-Btn' onClick={() => setUtilityTool("Enable")}>
                        <FaAlignRight />
                    </span>
                </div>
            </header>
            <main ref={ChattingContainerRef}>
                <strong>Point-to-Point Encrypted</strong>
                {
                    userConversations?.map((eachMessageDateBucket, MessageDateBucketIndex) => (
                        <section key={MessageDateBucketIndex} className='Chatting-Section'>
                            <b className='MessageBucket-Date'>{eachMessageDateBucket.MessageBucketDate}</b>
                            {
                                eachMessageDateBucket?.Messages?.map((eachMessageSession, MessageSessionIndex) => {
                                    const MessageSessionBucket = eachMessageSession.split("--")
                                    return (MessageSessionBucket[0] === "Received") ?
                                        <p className="From-Message" key={MessageSessionIndex} onMouseUp={(e) => handleMessageDeleteEventCapture(e, "From-Message", eachMessageDateBucket.MessageBucketDate, MessageSessionBucket)} onMouseDown={(e) => handleMessageDeleteEventCapture(e, "From-Message", eachMessageDateBucket.MessageBucketDate, MessageSessionBucket)} onTouchStart={(e) => handleMessageDeleteEventCapture(e, "From-Message", eachMessageDateBucket.MessageBucketDate, MessageSessionBucket)} onTouchEnd={(e) => handleMessageDeleteEventCapture(e, "From-Message", eachMessageDateBucket.MessageBucketDate, MessageSessionBucket)}>
                                            <span>{MessageSessionBucket[1]}</span>
                                            <span className='Message-Time'>{MessageSessionBucket[2]}</span>
                                        </p> :
                                        <p className="To-Message" key={MessageSessionIndex} onMouseUp={(e) => handleMessageDeleteEventCapture(e, "To-Message", eachMessageDateBucket.MessageBucketDate, MessageSessionBucket)} onMouseDown={(e) => handleMessageDeleteEventCapture(e, "To-Message", eachMessageDateBucket.MessageBucketDate, MessageSessionBucket)} onTouchStart={(e) => handleMessageDeleteEventCapture(e, "To-Message", eachMessageDateBucket.MessageBucketDate, MessageSessionBucket)} onTouchEnd={(e) => handleMessageDeleteEventCapture(e, "To-Message", eachMessageDateBucket.MessageBucketDate, MessageSessionBucket)}>
                                            <span>{MessageSessionBucket[1]}</span>
                                            <span className='Message-Time'>{MessageSessionBucket[2]}</span>
                                        </p>
                                })
                            }
                        </section>
                    ))
                }
            </main>
            <footer>
                <div>
                    <span style={{ left: "25px" }}>
                        <FaSearch />
                    </span>
                    <textarea name="MessageInput" id="MessageInput" ref={MessageInputRef} placeholder='Message'></textarea>
                    <span style={{ right: "25px", marginTop: "3px" }}>
                        <FaPaperclip />
                    </span>
                </div>
                <button onClick={handleSendMessage}>
                    <FaPaperPlane />
                </button>
            </footer>
        </div>
    )
});
// 
export default ConversationComponent;