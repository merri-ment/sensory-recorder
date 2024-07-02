import env from "@/config/env";

// export const PATHS = {
//   LOADING: 'loading',
//   HOME: 'home',
// }

export const HOME_STATE = {
  UNSET: "HOME_STATE:UNSET",
  LANDING: "HOME_STATE:LANDING",
  ASSIGN_LABEL: "HOME_STATE:ASSIGN_LABEL",
  RECORDING: "HOME_STATE:RECORDING",
};

export const PAGES = {
  HOME: "index",
  RECORDINGS: "recordings",
  SESSION: "session-slug",
  ABOUT: "about",
};

export const MODAL_STATES = {
  NONE: "NONE",
  MENU: "MODAL_STATE:MENU",
  LOADING: "MODAL_STATE:LOADING",
  DOWNLOADING: "MODAL_STATE:DOWNLOADING",
};

export const EVENTS = {
  STAGE: {
    TRANSITION: "STAGE:TRANSITION",
    RENDER: "STAGE:RENDER",
  },
};

export const COLORS = {
  PINK: "#ff62b7",
  BLUE: "#62d9ff",
};

export const UI_TYPE = {
  SCREEN: "UI_TYPE:SCREEN",
  VOICE: "UI_TYPE:VOICE",
  WATCH: "UI_TYPE:WATCH",
};

export const LABELS = ["Walking", "Running", "Zig Zag", "Sitting", "Skipping"];
