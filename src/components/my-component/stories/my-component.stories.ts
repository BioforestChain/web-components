import { html } from 'lit-html';
import { myComponentKit } from './autogen';

export default {
  title: 'Component/MyComponent',
  argTypes: myComponentKit.argsFactory.toArgTypes(),
};

export const My_Component = myComponentKit.storyFactory(
  () =>
    html`<!-- push some child element -->
      <h1>qaq</h1>`,
  {
    /* init property/attribute */
    last: 'qaq',
  }
);
