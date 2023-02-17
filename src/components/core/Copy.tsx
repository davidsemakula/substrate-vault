import React, { useEffect, useState, useRef, ReactElement } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { SxProps } from '@mui/material';

type Props = {
  text: string;
  children: ReactElement;
  message?: string;
  sx?: SxProps;
};

export default function Copy({ text, children, message = 'Copied', sx }: Props): React.ReactElement {
  const [copied, setCopied] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const handleCopy = () => {
    setCopied(true);
  };

  useEffect(() => {
    const clearTimer = (id?: NodeJS.Timeout) => {
      id && clearTimeout(id);
    };
    if (copied) {
      clearTimer(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
    return () => {
      clearTimer(timerRef.current);
    };
  }, [copied]);

  return (
    <Tooltip open={copied} title={message} placement="bottom" arrow>
      <Box sx={sx}>
        <CopyToClipboard text={text} onCopy={handleCopy}>
          <Box>{children}</Box>
        </CopyToClipboard>
      </Box>
    </Tooltip>
  );
}
