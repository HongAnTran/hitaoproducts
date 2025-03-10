// import { mount } from 'svelte';
// import App from './App.svelte';

// mount(App, {
//   target: document.getElementById('hitaoproducts') 
// });

import { mount } from 'svelte'
import App from './App.svelte'
import './app.css'
const app = mount(App, {
  target: document.getElementById('hitaoproducts'),
})

export default app