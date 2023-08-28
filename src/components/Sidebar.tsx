import React, { useState } from 'react';
import { Button, List, ListItem, ListItemText, IconButton, ListItemIcon, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';

interface SidebarProps {
    conversations: Array<{ id: number, title: string, messages: Array<{ role: string, content: string }> }>;
    startNewConversation: () => void;
    setCurrentConversationId: React.Dispatch<React.SetStateAction<number | null>>;
    setConversations: React.Dispatch<React.SetStateAction<any[]>>;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, startNewConversation, setCurrentConversationId, setConversations }) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedTitle, setEditedTitle] = useState('');

    const handleEdit = (id: number, title: string) => {
        setEditingId(id);
        setEditedTitle(title);
    };

    const handleSave = (id: number) => {
        setConversations(prev => prev.map(conv => conv.id === id ? { ...conv, title: editedTitle } : conv));
        setEditingId(null);
    };

    const handleDelete = (id: number) => {
        setConversations(prev => prev.filter(conv => conv.id !== id));
    };

    return (
        <div className="w-1/6 h-full p-4 bg-gradient-to-r from-gray-900 to-gray-600 text-white text-base">
            <Button startIcon={<AddIcon />} variant="contained" color="primary" className="mb-4 justify-center" onClick={startNewConversation}>
                New Lookup
            </Button>

            <List>
                {conversations.map(chat => (
                    <ListItem key={chat.id} className="mb-2 text-sm" button onClick={() => setCurrentConversationId(chat.id)}>
                        <ListItemIcon>
                            <ChatIcon className="text-white" fontSize='small' />
                        </ListItemIcon>
                        {editingId === chat.id ? (
                            <TextField
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <ListItemText primary={chat.title} className='truncate' />
                        )}
                        {editingId === chat.id ? (
                            <>
                                <IconButton onClick={() => handleSave(chat.id)}>
                                    <CheckIcon className="text-white" fontSize='small' />
                                </IconButton>
                                <IconButton onClick={() => setEditingId(null)}>
                                    <CloseIcon className="text-white" fontSize='small' />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <IconButton onClick={() => handleEdit(chat.id, chat.title)}>
                                    <EditIcon className="text-white" fontSize='small' />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(chat.id)}>
                                    <DeleteIcon className="text-white" fontSize='small' />
                                </IconButton>
                            </>
                        )}
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default Sidebar;
