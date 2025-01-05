declare global {
  interface Window {
    umami: {
      track: () => void;
    };
  }
}

export const trackPage = () => {
  try {
    window.umami.track();
  } catch (e) {
    console.error(e);
  }
};
