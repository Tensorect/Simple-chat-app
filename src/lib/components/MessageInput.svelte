<script lang="ts">
    export let username: string;
    export let ws: WebSocket;
    export let users: string[];
    export let addMessage: (messageData: any) => void;
    
    let currentMessage = "";
    let isLiveMode = false;
    let liveMessageId: number | null = null;
    
    function sendMessage() {
      if (currentMessage.trim()) {
        const messageData = {
          type: 'message',
          id: liveMessageId || Date.now(),
          username,
          content: currentMessage,
          timestamp: new Date().toISOString()
        };
        ws.send(JSON.stringify(messageData));
        addMessage(messageData);  // Add this line
        currentMessage = "";
        liveMessageId = null;
        isLiveMode = false;
      }
    }
    
    function handleInput() {
      if (isLiveMode) {
        if (!liveMessageId) {
          liveMessageId = Date.now();
        }
        const messageData = {
          type: 'live',
          id: liveMessageId,
          username,
          content: currentMessage,
          timestamp: new Date().toISOString()
        };
        ws.send(JSON.stringify(messageData));
        addMessage(messageData);  // Add this line
      }
    }
    
    function toggleLiveMode() {
      isLiveMode = !isLiveMode;
      if (!isLiveMode && liveMessageId) {
        sendMessage();
      }
    }
    
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      } else if (event.key === '@') {
        alert(`Available users: ${users.join(', ')}`);
      }
    }
  </script>
  
  <div class="input-area">
    <input
      bind:value={currentMessage}
      on:input={handleInput}
      on:keydown={handleKeydown}
      placeholder="Type your message here"
    />
    <button on:click={sendMessage} disabled={isLiveMode}>Send</button>
    <button on:click={toggleLiveMode} class:active={isLiveMode}>
      {isLiveMode ? 'Stop Live' : 'Start Live'}
    </button>
  </div>
  
  <style>
    /* ... (styles remain the same) ... */
    .input-area {
    display: flex;
    padding: 20px;
    background-color: #f0f0f0;
  }
  
  input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 20px;
    margin-right: 10px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  button.active {
    background-color: #f44336;
  }
  
  button.active:hover {
    background-color: #da190b;
  }
  </style>