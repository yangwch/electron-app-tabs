import React, { useEffect, useMemo, useState } from "react";
import {
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Tabs, Tree } from "antd";
import styled from "styled-components";
import {
  activateTabPage,
  closeTabPage,
  openTabPage,
  resizeTabPage,
} from "./services/ipc";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import { throttle } from "lodash";

const { Sider, Content } = Layout;

const TabsContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .ant-tabs {
    flex-shrink: 0;
  }
  iframe {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const TabsContent = styled.div`
  flex: 1;
  flex-shrink: 1;
  position: relative;
`;

const TabsHeader = styled.div`
  height: 45px;
  overflow: hidden;
  flex-shrink: 0;
`;

interface LinkMenu extends MenuItemType {
  url: string;
  group: string;
  label: string;
  children?: LinkMenu[];
}

const menus: LinkMenu[] = [
  {
    key: "https://www.eeo.cn",
    icon: <UserOutlined />,
    label: "翼鸥官网",
    group: "eeo",
    url: "https://www.eeo.cn",
    children: [
      {
        key: "https://www.eeo.cn/cn/classin",
        url: "https://www.eeo.cn/cn/classin",
        label: "ClassIn",
        group: "eeo",
      },
      {
        key: "https://www.eeo.cn/cn/colleges-universities",
        url: "https://www.eeo.cn/cn/colleges-universities",
        group: "eeo",
        label: "高校",
      },
    ],
  },
  {
    key: "https://flowin.cn",
    icon: <UserOutlined />,
    label: "FlowIn",
    url: "https://flowin.cn",
    group: "flowin",
  },

  {
    key: "https://www.camin.cn",
    icon: <VideoCameraOutlined />,
    label: "CamIn",
    url: "https://www.camin.cn",
    group: "CamIn",
  },
  // {
  //   key: "https://cn.bing.com",
  //   icon: <UploadOutlined />,
  //   label: "Bing",
  //   url: "https://cn.bing.com",
  //   group: "bing",
  // },
];

const App: React.FC = () => {
  const [openedTabs, setOpenedTabs] = useState<
    { key: string; label: string; menuKey: string; children: React.ReactNode }[]
  >([]);
  const [currentTab, setCurrentTab] = useState<string>("");

  const contentRef = React.useRef<HTMLDivElement>(null);

  const onClickMenu = (_: React.MouseEvent, info: LinkMenu) => {
    console.log("click", info);
    if (info) {
      const currentNode = info;
      const group = currentNode.group;
      if (openedTabs.find(tab => tab.key === group)) {
        setCurrentTab(group);
        setOpenedTabs(prev =>
          prev.map(tab => {
            if (tab.key === group) {
              return {
                ...tab,
                label: currentNode.label,
                menuKey: String(currentNode.key),
                children: null,
              };
            }
            return tab;
          }),
        );
      } else {
        setOpenedTabs(prev => [
          ...prev,
          {
            key: group,
            label: currentNode.label,
            menuKey: String(currentNode.key),
            children: null,
          },
        ]);
        setCurrentTab(group);
      }
      if (contentRef.current) {
        const bounce = contentRef.current.getBoundingClientRect();
        openTabPage(
          currentNode.url,
          {
            left: bounce.left,
            top: bounce.top,
            width: bounce.width,
            height: bounce.height,
          },
          currentNode.group,
        );
      }
    }
  };
  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove",
  ) => {
    if (action === "remove") {
      setOpenedTabs(prev => prev.filter(tab => tab.key !== targetKey));

      closeTabPage(targetKey as string);
      const newCurrent =
        openedTabs.find(tab => tab.key !== targetKey)?.key || "";
      setCurrentTab(newCurrent);
      if (newCurrent) {
        activateTabPage(newCurrent);
      }
    }
  };

  const onChange = (key: string) => {
    setCurrentTab(key);
    activateTabPage(key);
  };

  useEffect(() => {
    if (contentRef.current) {
      const throttledResize = throttle(() => {
        if (contentRef.current) {
          const bounce = contentRef.current.getBoundingClientRect();
          const { left, top, width, height } = bounce;
          resizeTabPage({
            left,
            top,
            width,
            height,
          });
        }
      }, 100);
      const resizeObserve = new ResizeObserver(() => {
        throttledResize();
      });
      resizeObserve.observe(contentRef.current);
      return () => {
        resizeObserve.disconnect();
        throttledResize.cancel();
      };
    }
  }, []);

  const activeMenuKey = useMemo(() => {
    return openedTabs.find(tab => tab.key === currentTab)?.menuKey || ""
  }, [openedTabs, currentTab])
  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <Sider trigger={null} style={{ backgroundColor: "#fff", padding: 20 }}>
        <div className="demo-logo-vertical" />
        <Tree
          treeData={menus}
          onClick={onClickMenu}
          titleRender={node => node.label}
          selectedKeys={[activeMenuKey]}
          blockNode
        />
      </Sider>
      <Layout>
        <Content style={{ padding: "0 24px" }}>
          <TabsContainer>
            <TabsHeader>
              <Tabs
                type="editable-card"
                items={openedTabs}
                activeKey={currentTab}
                onChange={onChange}
                onEdit={onEdit}
                hideAdd
              />
            </TabsHeader>
            <TabsContent ref={contentRef}>
              {/* {openedTabs.map(tab => (
                <iframe
                  src={tab.key}
                  key={tab.key}
                  style={{
                    zIndex: currentTab === tab.key ? 1 : 0,
                    visibility: currentTab === tab.key ? "visible" : "hidden",
                  }}
                />
              ))} */}
            </TabsContent>
          </TabsContainer>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
