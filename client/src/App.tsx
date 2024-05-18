import React, { useState } from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Tabs } from "antd";
import styled from "styled-components";

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

const App: React.FC = () => {
  const [openedTabs, setOpenedTabs] = useState<
    { key: string; label: string; children: React.ReactNode }[]
  >([]);
  const [currentTab, setCurrentTab] = useState<string>("");

  const onClickMenu = (info: unknown) => {
    console.log("click", info);
    if (info) {
      const menuInfo = info as { key: string };
      if (openedTabs.find(tab => tab.key === menuInfo.key)) {
        setCurrentTab(menuInfo.key);
      } else {
        setOpenedTabs(prev => [
          ...prev,
          {
            key: menuInfo.key,
            label: menuInfo.key,
            children: null,
          },
        ]);
        setCurrentTab(menuInfo.key);
      }
    }
  };
  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove",
  ) => {
    if (action === "remove") {
      setOpenedTabs(prev => prev.filter(tab => tab.key !== targetKey));
      setCurrentTab(prev => {
        if (prev === targetKey) {
          return openedTabs[0].key;
        }
        return prev;
      });
    }
  };
  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <Sider trigger={null}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={onClickMenu}
          selectedKeys={[currentTab]}
          items={[
            {
              key: "https://flowin.cn",
              icon: <UserOutlined />,
              label: "FlowIn",
            },

            {
              key: "https://www.eeo.cn",
              icon: <UserOutlined />,
              label: "Classin",
            },
            {
              key: "https://www.electronjs.org",
              icon: <VideoCameraOutlined />,
              label: "Electron",
            },
            {
              key: "https://cn.bing.com",
              icon: <UploadOutlined />,
              label: "Bing",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: "0 24px" }}>
          <TabsContainer>
            <Tabs
              type="editable-card"
              items={openedTabs}
              activeKey={currentTab}
              onChange={key => setCurrentTab(key)}
              onEdit={onEdit}
              hideAdd
            />
            <TabsContent>
              {openedTabs.map(tab => (
                <iframe
                  src={tab.key}
                  key={tab.key}
                  style={{
                    zIndex: currentTab === tab.key ? 1 : 0,
                    visibility: currentTab === tab.key ? "visible" : "hidden",
                  }}
                />
              ))}
            </TabsContent>
          </TabsContainer>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
