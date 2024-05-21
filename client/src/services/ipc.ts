export const openTabPage = (
  url: string,
  layout: { left: number; top: number; width: number; height: number },
  group: string
) => {
  console.log("openTabPage", url, layout, group);
  try {
    window.api.openTabPage(url, layout, group);
  } catch (e) {
    console.log(e);
  }
};


export const closeTabPage = (group: string) => {
  console.log("closeTabPage", group);
  try {
    window.api.closeTabPage(group);
  } catch (e) {
    console.log(e);
  }
};

export const activateTabPage = (group: string) => {
  console.log("activateTabPage", group);
  try {
    window.api.activeTabPage(group);
  } catch (e) {
    console.log(e);
  }
};

export const resizeTabPage = (layout: { left: number; top: number; width: number; height: number }) => {
  console.log("resizeTabPage", layout);
  try {
    window.api.resizeTabPage(layout);
  } catch (e) {
    console.log(e);
  }
}