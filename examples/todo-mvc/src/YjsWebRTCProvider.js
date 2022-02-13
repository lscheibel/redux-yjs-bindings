import { WebrtcProvider } from 'y-webrtc';

export class RTC {
  yDoc;
  connected = false;

  constructor(yDoc) {
    this.yDoc = yDoc;

    const syncEnabled = window.localStorage.getItem('rtcSyncEnabled');
    if (syncEnabled !== 'false') {
      this.connect();
    }
  }

  connect() {
    if (this.provider) {
      this.provider.connect();
    } else {
      // clients connected to the same room-name share document updates
      this.provider = new WebrtcProvider('redux-yjs-bindings', this.yDoc, {
        signaling:
          process.env.NODE_ENV === 'development'
            ? ['ws://localhost:4444']
            : ['wss://signaling.yjs.dev', 'wss://y-webrtc-signaling-eu.herokuapp.com'],
      });
    }

    window.localStorage.setItem('rtcSyncEnabled', 'true');
    this.connected = true;
  }

  disconnect() {
    if (this.provider) {
      this.provider.disconnect();
    }

    window.localStorage.setItem('rtcSyncEnabled', 'false');
    this.connected = false;
  }
}
