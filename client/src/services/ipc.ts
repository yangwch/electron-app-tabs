export const openTabPage = (
  url: string,
  layout: { left: number; top: number; width: number; height: number },
) => {
  console.log("openTabPage", url, layout);
  window.openTabPage(url, layout);
};
