<script lang="ts">
  import Message from './Message.svelte';
  import { onMount, afterUpdate } from 'svelte';
  
  export let messages: any[];
  export let username: string;
  export let deleteMessage: (id: number) => void;
  
  let messageContainer: HTMLElement;
  let autoScroll = true;
  
  // onMount(() => {
  //     scrollToBottom();
  // });
  
  // afterUpdate(() => {
  //     if (autoScroll) {
  //         scrollToBottom();
  //     }
  // });
  
  // function scrollToBottom() {
  //     if (messageContainer) {
  //         messageContainer.scrollTop = messageContainer.scrollHeight;
  //     }
  // }
  
  function handleScroll() {
      const { scrollTop, scrollHeight, clientHeight } = messageContainer;
      autoScroll = scrollTop + clientHeight >= scrollHeight - 20;
  }
  </script>
  
  <div class="messages-wrapper">
      <div class="messages" 
           id="message-container" 
           bind:this={messageContainer} 
           on:scroll={handleScroll}>
          {#if messages.length === 0}
              <div class="welcome-message">
                  <h2>Welcome to Chat-App-XYZ</h2>
                  <p>Start chatting to see your messages appear here!</p>
              </div>
          {:else}
              <div class="message-list">
                  {#each messages as message}
                      <Message {message} {username} {deleteMessage} />
                  {/each}
              </div>
          {/if}
      </div>
  </div>
  
  <style>
  .messages-wrapper {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
  }
  
  .messages {
      flex-grow: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column-reverse;
  }
  
  .message-list {
      display: flex;
      flex-direction: column;
  }
  
  .welcome-message {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      text-align: center;
      color: #888;
  }
  
  .welcome-message h2 {
      font-size: 24px;
      margin-bottom: 10px;
  }
  
  .welcome-message p {
      font-size: 16px;
  }
  </style>