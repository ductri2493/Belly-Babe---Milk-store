import React, { useState } from 'react';
import Logo from '../../assets/logo/Untitled-1-01.png'
import QRcode from "../../assets/img/QRcodeZalo.jpg";
const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSendMessage = () => {
        if (input.trim()) {
            const newMessage = { text: input, sender: 'user' };
            setMessages([...messages, newMessage]);
            setInput('');
            // Giả sử chat bot trả lời ngay lập tức, bạn có thể thay bằng logic gọi API ở đây
            const botResponses = [
                {
                    text: (
                        <span>
                            Nếu cần chúng tôi tư vấn hãy liên hệ qua zalo của chúng tôi, xin hãy{' '}
                            <a href="https://zalo.me/g/kvvdjf475" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                bấm vào đây!
                            </a>
                        </span>
                    ),
                    sender: 'bot',
                },
                {
                    text: (<span>Hoặc có thể quét mã QR này<br />
                        <img src={QRcode} width={200} alt="" />
                    </span>
                    )
                }
            ];
            setMessages([...messages, newMessage, ...botResponses]);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                className=" text-white border-none rounded-full shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                <img src={Logo} width={60} alt="" />
            </button>
            {isOpen && (
                <div className="flex flex-col w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg mt-4">
                    <div className="flex-1 overflow-y-auto p-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-4 p-2 rounded-lg max-w-xs ${message.sender === 'user' ? 'bg-[#945784] text-white self-end' : 'bg-gray-300 text-black self-start'
                                    }`}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none"
                            placeholder="Nhập tin nhắn..."
                        />
                        <button
                            onClick={handleSendMessage}
                            className="p-2 bg-[#945784] text-white rounded-r-lg hover:bg-[#945784]"
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
