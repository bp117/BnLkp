import React from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
interface SidebarProps {
    conversations: Array<{ id: number, title: string, messages: Array<{ role: string, content: string }> }>;
    startNewConversation: () => void;
    setCurrentConversationId: React.Dispatch<React.SetStateAction<number | null>>;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, startNewConversation, setCurrentConversationId }) => {
   
    const chats = [
        { id: 1, title: 'Chat 1' },
        { id: 2, title: 'Chat 2' },
    ];

    return (
        <div className="w-1/6 h-full p-4 bg-gradient-to-r from-gray-900 to-gray-600 text-white text-base">

            <Button startIcon={<AddIcon />} variant="contained" color="primary" className="mb-4 justify-center" onClick={startNewConversation}>

                New Lookup
            </Button>

            <List>
                {conversations.map(chat => (
                    <ListItem key={chat.id} className="mb-2 text-sm" button onClick={() => setCurrentConversationId(chat.id)}>
                        <ListItemIcon>
                            <ChatIcon className="text-white" fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText primary={chat.title} className='truncate'/>
                        <IconButton >
                            <EditIcon className="text-white" fontSize='small'/>
                        </IconButton>
                        <IconButton>
                            <DeleteIcon className="text-white" fontSize='small'/>
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default Sidebar;
