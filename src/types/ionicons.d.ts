declare namespace JSX {
  interface IntrinsicElements {
    "ion-icon": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      name?: string;
      src?: string;
      icon?: string;
      ios?: string;
      md?: string;
      size?: string;
      color?: string;
      "aria-label"?: string;
      "aria-hidden"?: string | boolean;
    };
  }
}