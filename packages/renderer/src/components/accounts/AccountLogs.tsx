import React from 'react';
import { type Log } from '../../types';

type AccountLogsProps = {
    logs: Log[]
}

export default function AccountLogs({ logs }: AccountLogsProps) {
  return (
        <div>
            {logs.map((log, index) => <p key={index}>{log.message}</p>)}
        </div>
  );
}