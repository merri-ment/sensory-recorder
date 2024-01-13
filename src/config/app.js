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
  ABOUT: "about",
  CONTACT: "contact",
  HOME: "index",
  PROJECTS: "projects",
  PROJECT: "project-slug",
  PROJECT_DAZED: "dazed-lens",
  PROJECT_VASOLINE: "vasoline-lens",
  PROJECT_GHOST: "ghost-lens",
  PROJECT_SLIT: "slit-lens",
  PROJECT_DITHER: "pixl-pact",
  PROJECT_SCRAPPYCHEF: "scrappy-chef",
};

export const MODAL_STATES = {
  NONE: "NONE",
  MENU: "MODAL_STATE:MENU",
  LOADING: "MODAL_STATE:LOADING",
  BATTERY: "MODAL_STATE:BATTERY",
};
