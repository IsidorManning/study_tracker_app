import React from 'react';
import { IconChevronDown, IconInfoCircle } from '@tabler/icons-react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';

const InsightCard = ({ title, description, icon: Icon, children, dataExplanation }) => (
  <div className="!bg-black g-2 p-6 rounded-lg border border-text-white">
    <div className="flex items-start gap-4 mb-4">
      <div className="p-2 bg-text-white/10 rounded-lg">
        <Icon className="text-white" size={24} />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-white mt-1">{description}</p>
      </div>
    </div>
    <div className="relative">
      {children}
      {dataExplanation && (
        <div>
          <Accordion className="!bg-transparent !shadow-none !border-0">
            <AccordionSummary
              expandIcon={<IconChevronDown className="text-white transition-transform duration-200" />}
              className="!min-h-0 !p-0 hover:!bg-transparent"
              sx={{
                color: "black",
                '& .MuiAccordionSummary-expandIconWrapper': {
                  transform: 'rotate(0deg)',
                },
                '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                  transform: 'rotate(180deg)',
                },
              }}
            >
              <div className="flex items-center gap-2">
                <IconInfoCircle className="text-white" size={20} />
                <Typography className="text-white">Data Details</Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails className="!p-0 !mt-2">
              <div className="prose prose-invert max-w-none bg-black p-4 rounded-lg border border-text-white">
                {dataExplanation}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </div>
  </div>
);

export default InsightCard; 