<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    
    let text: string = "";
    let previousText: string = "";
    let from: string = "";
    let ws: WebSocket;
    let websocketLink: string = "";
    
    function generateRandomString(length: number) {
      return Math.random().toString(36).substring(2, length + 2);
    }
    
    function createWebsocketLink() {
      const randomPath = generateRandomString(20);
      websocketLink = `${window.location.origin}/websockets/${randomPath}`;
    }
    
    function connectWebSocket() {
      const url = new URL(websocketLink);
      ws = new WebSocket(`ws://localhost:3000${url.pathname}`);
      
      ws.onopen = () => {
        console.log("WebSocket connection opened");
        ws.send(JSON.stringify({ type: 'meta', from }));
      };
      
      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
    }
    
    function handleInput(event: Event) {
      const input = event.target as HTMLInputElement;
      const currentText = input.value;
      
      const difference = currentText.length - previousText.length;
      
      if (difference < 0) {
        const deletedCount = Math.abs(difference);
        if (deletedCount === 1) {
          ws.send(JSON.stringify({ type: 'delete', count: 1 }));
        } else if (deletedCount > 10) {
          ws.send(JSON.stringify({ type: 'delete', count: deletedCount }));
        } else {
          for (let i = 0; i < deletedCount; i++) {
            ws.send(JSON.stringify({ type: 'delete', count: 1 }));
          }
        }
      } else if (difference > 0) {
        const addedText = currentText.slice(previousText.length);
        ws.send(JSON.stringify({ type: 'add', text: addedText }));
      }
      
      previousText = currentText;
    }
    
    function goToWebsocketLink() {
      if (websocketLink) {
        goto(websocketLink);
      }
    }
    
    onMount(() => {
      return () => {
        if (ws) {
          ws.close();
        }
      };
    });
    </script>
    
    <h1>Input Page</h1>
    <input placeholder="Your name" bind:value={from}>
    <button on:click={createWebsocketLink}>Create WebSocket Link</button>
    {#if websocketLink}
      <p>WebSocket Link: <a href={websocketLink} on:click|preventDefault={goToWebsocketLink}>{websocketLink}</a></p>
      <input bind:value={text} on:input={handleInput} placeholder="Type your message here" disabled={!ws}>
      <button on:click={connectWebSocket} disabled={!websocketLink}>Connect</button>
    {/if}
    <p>Type here to send updates to all connected WebSocket viewers. Delete to remove characters.</p>