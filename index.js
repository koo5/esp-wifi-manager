/* Add JavaScript code here! */
console.log('Hello World! You did it! Welcome to Snowpack :D');
import App from "./src/App.svelte";

let app = new App({

  target: document.body,

});

export default app;
