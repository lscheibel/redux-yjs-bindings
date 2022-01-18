import React, { useState } from 'react';
import { rtc } from '../index';

const buttonStyle = {
  position: 'absolute',
  padding: '0.5rem 1rem',
  transform: 'translateX(calc(-100% - 1rem))',
  background: '#fff',
  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '3px',
  fontWeight: 500,
};

const SyncSwitch = () => {
  const [connected, setConnected] = useState(rtc.connected);

  return (
    <button
      style={buttonStyle}
      onClick={() => {
        connected ? rtc.disconnect() : rtc.connect();
        setConnected(!connected);
      }}
    >
      {connected ? 'Disable Sync' : 'Enable Sync'}
    </button>
  );
};

export default SyncSwitch;
