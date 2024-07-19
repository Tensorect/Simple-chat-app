<script lang="ts">
  import * as marked from 'marked';
  import DOMPurify from 'dompurify';
  
  export let message: any;
  export let username: string;
  export let deleteMessage: (id: number) => void;
  
  function formatMessage(content: string) {
      let escapedContent = DOMPurify.sanitize(content);
      let htmlContent = marked.parse(escapedContent, { async: false }) as string;
      return htmlContent;
  }
  </script>
  
  <div class="message {message.username === username ? 'own' : 'other'}">
      <div class="message-content">
          <strong>{message.username}:</strong>
          {@html formatMessage(message.content)}
      </div>
      <div class="message-timestamp">{new Date(message.timestamp).toLocaleTimeString()}</div>
      {#if message.username === username}
          <button class="delete-btn" on:click={() => deleteMessage(message.id)}>Delete</button>
      {/if}
  </div>
  
  <style>
  .message {
      max-width: 70%;
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 20px;
      word-wrap: break-word;
  }
  
  .message.own {
      align-self: flex-start;
      background-color: #4CAF50;
      color: #ffffff;
      margin-right: auto;
  }
  
  .message.other {
    align-self: flex-end;
      background-color: #163e87;
      color: #ffffff;
      margin-left: auto;
  }
  
  .message-content {
      margin-bottom: 5px;
  }
  
  .message-timestamp {
      font-size: 0.8em;
      color: #fcfcfc;
      text-align: right;
  }
  
  .delete-btn {
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 5px 10px;
      font-size: 0.8em;
      cursor: pointer;
      margin-left: 10px;
  }
  
  .delete-btn:hover {
      background-color: #d32f2f;
  }
  </style>
  