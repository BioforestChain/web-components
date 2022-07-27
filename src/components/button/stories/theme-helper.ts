import { render, html } from "lit-html";

export const insertThemeColorOnMount = (frag: DocumentFragment) => {
  frag.appendChild(
    render(
      html`<style>
        #root {
          background: #aaa;
        }
      </style>`,
      document.createDocumentFragment(),
    ).parentNode,
  );
};
