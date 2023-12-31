import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import { TextField, IconButton, InputAdornment, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { ChevronDownIcon, DocumentPlusIcon } from '@heroicons/react/24/solid';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

interface ChatInterfaceProps {
    theme: string;
    currentConversationId: number | null;
    setCurrentConversationId: React.Dispatch<React.SetStateAction<number | null>>;
    conversations: Array<{ id: number, title: string, messages: Array<{ role: string, content: string }> }>;
    setConversations: React.Dispatch<React.SetStateAction<Array<{ id: number, title: string, messages: Array<{ role: string, content: string }> }>>>;

}
interface SummaryResponse {
    duration: string;
    result: {
        context: string;
        book: string;
        section_title: string;
        hyperlink: string;
        generated_resp: string;
    };
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ theme, currentConversationId, setCurrentConversationId, conversations, setConversations }) => {

    const [inputValue, setInputValue] = useState('');
    const currentMessages = conversations.find(conv => conv.id === currentConversationId)?.messages || [];
    const [botIsTyping, setBotIsTyping] = useState(false);
    const [selectedOption, setSelectedOption] = useState('CSSB Procedures for contact center');
    const [isFirstMessageSent, setIsFirstMessageSent] = useState(false);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSummarized, setIsSummarized] = useState(false);
    const [isEnhanced, setIsEnhanced] = useState(false);
    const [summaryResponse, setSummaryResponse] = useState<SummaryResponse | null>(null);
    const [selectedTabContext, setSelectedTabContext] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedOption(event.target.value as string);
    };

    const selectStyles = {
        backgroundColor: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#333',

    };
    const labelStyles = {
        color: theme === 'dark' ? '#fff' : '#333',
        // ... any other styles
    };
    const uploadIconStyles = {
        color: theme === 'dark' ? '#000' : '#333',
        // ... any other styles
    };

    const fetchBotResponse = async (endpoint: string, payload: any) => {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            return data.response.result;
        } catch (error) {
            console.error("Error fetching bot response:", error);
            return [];
        }
    }
    const handleFileUpload = async () => {
        setIsLoading(true);
        try {
            // Assuming you're using axios for the API call
            const response = await axios.post('YOUR_UPLOAD_ENDPOINT', selectedFile);
            const requestId = response.data.requestId;
    
            // Polling logic
            let uploadCompleted = false;
            while (!uploadCompleted) {
                const statusResponse = await axios.get('YOUR_STATUS_CHECK_ENDPOINT' + requestId);
                if (statusResponse.data.status === 'completed') {
                    uploadCompleted = true;
                } else {
                    // Wait for a few seconds before polling again
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsLoading(false);
            setOpenUploadDialog(false);
        }
    }
    

    const handleSendMessage = async () => {
        setIsFirstMessageSent(true);
        setBotIsTyping(true);
        if (inputValue.trim()) {
            const newMessage = { role: 'user', content: inputValue.trim() };
            let currentId: number;
            let endpoint = isFirstMessageSent ? 'http://localhost:3001/generate' : 'http://localhost:3001/chat';
            let payload = isFirstMessageSent
                ? {
                    prompt: inputValue.trim(),
                    context: `${selectedTabContext}${summaryResponse ? summaryResponse.result.generated_resp : ""}${isEnhanced ? "Enhance content here" : ""}`
                }
                : {
                    query: inputValue.trim(),
                    corpus_name: "YourCorpusName"  // Replace with actual corpus name if needed
                };
            if (currentConversationId === null) {
                const newConversation = {
                    id: Date.now(),
                    title: inputValue.trim().split(' ').slice(0, 20).join(' ') + '...',
                    messages: [newMessage]
                };
                setConversations(prevConversations => [...prevConversations, newConversation]);
                currentId = newConversation.id;
                setCurrentConversationId(newConversation.id);
            } else {
                setConversations(prevConversations =>
                    prevConversations.map(conv =>
                        conv.id === currentConversationId ? { ...conv, messages: [...conv.messages, newMessage] } : conv
                    )
                );
                currentId = currentConversationId;
            }

            setInputValue('');

            const botResponses = await fetchBotResponse(endpoint, payload);

            setBotIsTyping(false);
            // Update the isFirstMessageSent state
            if (!isFirstMessageSent) {
                setIsFirstMessageSent(true);
            }
            setConversations(prevConversations => {
                const updatedConversations = prevConversations.map(conv =>
                    conv.id === currentId ? { ...conv, messages: [...conv.messages, { role: 'bot', content: botResponses }] } : conv
                );
                return updatedConversations;
            });
        }
    }
    useEffect(() => {
        setIsFirstMessageSent(false);
    }, [currentConversationId]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // Scroll to the bottom after a slight delay to ensure the DOM has updated
        const timer = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100); // 100ms delay 

        // Cleanup the timer when the effect runs again or the component unmounts
        return () => clearTimeout(timer);
    }, [currentMessages]);

    return (
        <div className={`flex-1 p-4 ${theme === 'dark' ? 'bg-gradient-to-b from-black to-gray-700 text-white' : ''}`}>

            {/* Top controls section */}
            <div className="flex justify-end items-center mb-4 space-x-4">
                {/* Disabled Label */}
                <div className="bg-gray-500 text-gray-500 px-3 py-1 rounded-md" style={labelStyles}>
                    CSBBT
                </div>

                {/* Dropdown using MUI Select */}
                <FormControl variant="outlined" size="small" style={{ width: '150px' }}>
                    <InputLabel id="demo-simple-select-outlined-label" style={labelStyles}>Collection</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={selectedOption}
                        style={selectStyles}
                        label="Collection"
                    >
                        <MenuItem value="CSSB Procedures for contact center">
                            <em>CSSB Procedures for contact center</em>
                        </MenuItem>
                    </Select>
                </FormControl>

                {/* Upload Icon */}
                <button className="bg-gray-300 p-2 rounded-md hover:bg-gray-400" style={uploadIconStyles} onClick={() => setOpenUploadDialog(true)}>
                    <DocumentPlusIcon className="h-6 w-6" />
                </button>

            </div>
            {/* Chat Messages Section */}
            <div className="chat-messages mb-4 flex flex-col items-center overflow-y-hidden hide-sidebar" style={{ maxHeight: 'calc(100% - 80px)' }} > {/* Adjust the 80px based on the height of your chat input section */}
                <div className="w-4/5">
                    {!isFirstMessageSent && (
                        <div className="text-xl font-bold text-center my-10">
                            One stop shop for Procedure needs
                        </div>
                    )}


                    {currentMessages.map((message, index) => (
                        <Message key={index} role={message.role} content={message.content} theme={theme} isSummarized={isSummarized} setIsSummarized={setIsSummarized} isEnhanced={isEnhanced} setIsEnhanced={setIsEnhanced} selectedTabContext={selectedTabContext} setSelectedTabContext={setSelectedTabContext} summaryResponse={summaryResponse} setSummaryResponse={setSummaryResponse} />
                    ))}
                    {botIsTyping && (
                        <Message
                            role="bot"
                            content=""
                            theme={theme}
                            botIsTyping={true}
                            isSummarized={isSummarized} setIsSummarized={setIsSummarized} isEnhanced={isEnhanced} setIsEnhanced={setIsEnhanced} selectedTabContext={selectedTabContext} setSelectedTabContext={setSelectedTabContext} summaryResponse={summaryResponse} setSummaryResponse={setSummaryResponse}
                        />
                    )}
                    <div ref={messagesEndRef}></div> {/* This will be our marker to scroll to */}

                </div>
            </div>

            {/* Text Input and Send Button */}
            <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2 md:pl-2 md:w-[calc(100%-.5rem)]"> {/* Added a background and shadow for visibility */}

                <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
                    <div className="relative flex h-full flex-1 items-stretch md:flex-col">
                        <div className="flex w-full items-center" style={{ marginLeft: '8em' }}>
                            <div className={`flex flex-col w-full py-[10px] flex-grow md:py-4 md:pl-4 relative rounded-xl  ${theme === 'dark' ? 'border-gray-900/50 text-white bg-gray-700 shadow-xs' : 'border border-black/10 bg-white'} `}>

                                <TextField
                                    className="custom-textfield m-0 w-full resize-none  dark:bg-transparent md:pr-12 pl-3 md:pl-0" style={{ maxHeight: '600px', height: '48px', overflowY: 'hidden' }}
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    InputProps={{
                                        style: { border: 'none' },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleSendMessage}>
                                                    <SendIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                            </div></div></div></form>
            </div>
            <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
                <DialogTitle>Upload File</DialogTitle>
                <DialogContent>
                    <label htmlFor="file" className="upload-label bg-gray-500">
                        Choose a file
                    </label>
                    <input type="file" id="file" className="file-input  bg-gray-500" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />

                    {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUploadDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleFileUpload} color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

        </div>

    );

}

export default ChatInterface;
