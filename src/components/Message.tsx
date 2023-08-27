import React from 'react';
import { Tabs, Tab, Card, CardHeader, CardContent, Link, Typography } from '@mui/material';
import { Book, Link as LinkIcon } from '@mui/icons-material';

type Role = 'user' | 'bot';

interface MessageProps {
    role: Role;
    content: any;
    theme: string;
    botIsTyping?: boolean;
}

const Message: React.FC<MessageProps> = ({ role, content, theme, botIsTyping = false }) => {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    if (role === 'bot' && !botIsTyping && content) {
        return (
            <div className={`message ${role} mb-2 flex flex-col`}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    {content.map((item: any, index: number) => (
                        <Tab key={index} label={`Response ${index + 1}`} />
                    ))}
                </Tabs>
                {content.map((item: any, index: number) => (
                    <div key={index} hidden={selectedTab !== index}>
                        <Card variant="outlined">
                            <CardHeader
                                avatar={<Book />}
                                title={item.book}
                                subheader={
                                    <Link href={item.hyperlink} target="_blank" rel="noopener">
                                        <LinkIcon /> {item.hyperlink}
                                    </Link>
                                }
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {item.context}
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        );
    }
 
    return (
        <div className={`message ${role} mb-2 flex items-center justify-center h-20 ${role === 'user' 
        ? ` ${theme === 'dark' ? 'border-b border-gray-900/50 bg-gray-800 text-white' : 'bg-white text-black'}` 
        : ` ${theme === 'dark' ? 'border-b border-gray-900/50 bg-[#444654] text-white' : 'bg-gray-100 text-black'}`
      } `}>
            <img src={`${role}-icon.png`} alt={`${role} icon`} className="w-8 h-8 mr-2" />
            {botIsTyping ? (
                <div className="flex p-2 rounded text-base w-3/4 ">
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
                </div>
            ) : (
                <p className={`p-2 rounded text-base w-3/4 break-words`}>
                    {content}
                </p>
            )}
        </div>
    );
};

export default Message;
