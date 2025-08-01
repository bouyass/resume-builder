/// <reference types="vite/client" />

declare module '*.hbs?raw' {
  const content: string;
  export default content;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module 'handlebars' {
  const Handlebars: any;
  export default Handlebars;
}
