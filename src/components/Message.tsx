import React, {
  useState
} from 'react';
import {Button, Tabs, Tab, Card, CardHeader, CardContent, Link, Typography, Accordion, AccordionSummary, AccordionDetails, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Book, Link as LinkIcon, ExpandMore } from '@mui/icons-material';
import { ClipboardIcon as CopyIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline'; // Importing heroicons

type Role = 'user' | 'bot';

interface MessageProps {
  role: string;
  content: any;
  theme: string;
  botIsTyping?: boolean;
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

const Message: React.FC<MessageProps> = ({ role, content, theme, botIsTyping = false }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
  const [isSummarized, setIsSummarized] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [summaryResponse, setSummaryResponse] = useState<SummaryResponse | null>(null);
  const [selectedTabContext, setSelectedTabContext] = useState<string | null>(null);


  const handleSummarize = async (context:any) => {
      try {
          const response = await fetch('http://localhost:3001/summarize', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ text: context })
          });
          const data = await response.json();
          setSummaryResponse(data.response);
      } catch (error) {
          console.error("Error summarizing:", error);
      }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setSelectedTabContext(content[newValue].context);
  };

  const handleAccordionToggle = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const handleButtonsChange = (event: React.SyntheticEvent, newButtons: string[]) => {
    setSelectedButtons(newButtons);
  };
  return (
    <div className={`message ${role} mb-2 flex items-center justify-center min-h-20 ${role === 'user'
      ? ` ${theme === 'dark' ? 'border-b border-gray-900/50 bg-gray-800 text-white' : 'bg-white text-black'}`
      : ` ${theme === 'dark' ? 'border-b border-gray-900/50 bg-[#444654] text-white' : 'bg-gray-100 text-black'}`
      } `}>
      <img src={`${role}-icon.png`} alt={`${role} icon`} className="w-8 h-8 mr-2" />
      {role === 'bot' && !botIsTyping && content ? (
        
        <div className='w-4/5 p-6 flex flex-col'>
        <div className="flex justify-between items-start">
        <div></div> {/* This empty div will push the icons to the right */}
        <Stack direction="row" spacing={1} >
        <CopyIcon className="h-4 w-4" />
        <HandThumbUpIcon className="h-4 w4" />
        <HandThumbDownIcon className="h-4 w-4" />
      </Stack>
      </div>
        <Accordion expanded={expanded} onChange={handleAccordionToggle} >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Bot Responses</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col w-full">
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
                    <Stack spacing={2} direction="row">
                      <div>
                        <Button
                          variant={isSummarized ? "contained" : "outlined"}
                          color="primary"
                          onClick={() => {
                            setIsSummarized(!isSummarized);
                            handleSummarize(selectedTabContext);
                        }}  
                          style={{ marginRight: '10px' }}
                        >
                          Summarize
                        </Button>
                        <Button
                          variant={isEnhanced ? "contained" : "outlined"}
                          color="primary"
                          onClick={() => setIsEnhanced(!isEnhanced)}
                        >
                          Enhance
                        </Button>
                      </div>
                    </Stack>
                  </Card>
                </div>
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
        {summaryResponse && (
          <Accordion>
              <AccordionSummary>
                  Summary
              </AccordionSummary>
              <AccordionDetails>
                  {summaryResponse.result.generated_resp}
              </AccordionDetails>
              <div style={{textAlign: 'right', paddingRight: '10px'}}>
                  {summaryResponse.duration}
              </div>
          </Accordion>
      )}
      </div>
      ) : botIsTyping ? (
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
