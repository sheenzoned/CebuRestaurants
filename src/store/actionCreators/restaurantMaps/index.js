import axios from "axios";

export const getAboutPageSet = () => {
  const api_key = "AIzaSyBUcw8F-SDRojtF1o075_uXKYtJsp24FHw";
  const promise = axios.get(`${api_main}/page?slug=about`);
  return (dispatch, getState) => {
    dispatch(setAboutPageIsLoadingTrue());
    promise
      .then((response) => {
        dispatch(getAboutPageRequest(response.data));
        dispatch(setAboutPageIsLoadingFalse());
      })
      .catch((error) => {
        console.log(error);
        // error.response.data ? dispatch(getAboutPageRequestFailed(error.response.data)):console.log('destroy request');
        dispatch(setAboutPageIsLoadingFalse());
      });
  };
};
