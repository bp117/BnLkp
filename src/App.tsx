import React, { useState, useEffect } from 'react';
import AppBar from './components/AppBar';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';

function App() {
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Array<{ id: number, title: string, messages: Array<{ role: string, content: string }> }>>([]);
 

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const startNewConversation = () => {
    setCurrentConversationId(null);
};
useEffect(() => {
  const savedConversations = localStorage.getItem('conversations');
  if (savedConversations && conversations.length === 0) {
      console.log("Loading from local storage:", JSON.parse(savedConversations));
      setConversations(JSON.parse(savedConversations));
  } else {
      console.log("Not loading from local storage. Current conversations:", conversations);
  }
}, []);



useEffect(() => {
  if (conversations.length > 0) {
    console.log("Saving conversations to local storage:", conversations);
    localStorage.setItem('conversations', JSON.stringify(conversations));
  } else {
    console.log("Not saving empty conversations array to local storage.");
  }
}, [conversations]);



  useEffect(() => {
    if (currentConversationId !== null) {
      localStorage.setItem('currentConversationId', currentConversationId.toString());
    }
  }, [currentConversationId]);
  


  return (
    <div>
      <AppBar toggleTheme={toggleTheme} theme={theme} />
      <div className="relative flex h-screen">
      {sidebarOpen && <Sidebar conversations={conversations} startNewConversation={startNewConversation} setCurrentConversationId={setCurrentConversationId} />}
        <span className={sidebarOpen ? "data-state-open" : "data-state-closed"}>
          <a
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`flex px-3 min-h-[44px] py-1 gap-3 transition-colors duration-200 text-black cursor-pointer bg-gray-400 text-sm rounded-md border border-white/20 hover:bg-gray-300 h-11 w-11 flex-shrink-0 items-center justify-center absolute top-2 ${sidebarOpen ? 'left-1/5' : 'left-2.5'}`}
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
            <span className="absolute border-0 w-1 h-1 p-0 m-[-1px] overflow-hidden clip-[rect(0px,0px,0px,0px)] whitespace-nowrap overflow-wrap:normal">
              {sidebarOpen ? "Close sidebar" : "Open sidebar"}
            </span>
          </a>
        </span>
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
          <ChatInterface theme={theme} currentConversationId={currentConversationId}
                        setCurrentConversationId={setCurrentConversationId}
                        conversations={conversations}
                        setConversations={setConversations}/>
        </ThemeProvider>
      </div>
    </div>
  );
}

export default App;
