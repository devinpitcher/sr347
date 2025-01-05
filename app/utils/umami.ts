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

export const UMAMI_DOMAIN = "https://cloud.umami.is";
export const UMAMI_ENDPOINT = "/api/send";
