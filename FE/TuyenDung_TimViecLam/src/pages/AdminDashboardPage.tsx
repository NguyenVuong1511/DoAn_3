import { useState, useEffect } from 'react';
import { getUserId, logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import {
  getAllJobsForAdmin,
  getAllCompaniesForAdmin,
  getAllUsersAdmin,
  getAdminStats,
  type AdminUser,
  type AdminCompany
} from '../services/adminService';
import { Layout, Menu, Avatar, Dropdown, Space, ConfigProvider, Breadcrumb, Button, message, App } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  BankOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined
} from '@ant-design/icons';

// Sub-sections
import AdminOverviewSection from '../components/admin/AdminOverviewSection';
import AdminManageJobsSection from '../components/admin/AdminManageJobsSection';
import AdminManageCompaniesSection from '../components/admin/AdminManageCompaniesSection';
import AdminManageUsersSection from '../components/admin/AdminManageUsersSection';
import AdminManageCategoriesSection from '../components/admin/AdminManageCategoriesSection';
import AdminManageLocationsSection from '../components/admin/AdminManageLocationsSection';

const { Header, Content, Sider } = Layout;

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const userId = getUserId();
  const [jobs, setJobs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [realStats, setRealStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);



  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    } else {
      setLoading(false);
      // Optional: navigate('/login');
    }
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats (Graceful handle if 404)
      try {
        const statsRes = await getAdminStats();
        if (statsRes.success) setRealStats(statsRes.data);
      } catch (e) { console.warn("Admin Stats API not found, using fallback calculation."); }

      // Fetch Jobs
      try {
        const jobsRes = await getAllJobsForAdmin(1, 100);
        if (jobsRes.success && jobsRes.data) {
          if (Array.isArray(jobsRes.data)) setJobs(jobsRes.data);
          else if ((jobsRes.data as any).jobs) setJobs((jobsRes.data as any).jobs);
        }
      } catch (e) { console.warn("Admin Jobs API not found."); }

      // Fetch Companies
      try {
        const companiesRes = await getAllCompaniesForAdmin();
        if (companiesRes.success && companiesRes.data) {
          setCompanies(Array.isArray(companiesRes.data) ? companiesRes.data : []);
        }
      } catch (e) { console.warn("Admin Companies API not found."); }

      // Fetch Users
      try {
        const usersRes = await getAllUsersAdmin();
        if (usersRes.success && usersRes.data) {
          setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        }
      } catch (e) { console.warn("Admin Users API not found."); }

    } catch (error) {
      console.error("Admin Dashboard major error:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayStats = {
    totalJobs: realStats?.totalJobs ?? realStats?.jobsCount ?? realStats?.jobPostsCount ?? jobs.length,
    pendingJobs: realStats?.pendingJobs ?? realStats?.pendingJobsCount ?? realStats?.pendingJobPostsCount ?? jobs.filter(j => j.status?.toLowerCase() === 'pending').length,
    totalCompanies: realStats?.totalCompanies ?? realStats?.companiesCount ?? companies.length,
    totalUsers: realStats?.totalUsers ?? realStats?.usersCount ?? realStats?.accountsCount ?? users.length,
    lockedUsers: realStats?.lockedUsers ?? realStats?.lockedUsersCount ?? realStats?.lockedAccountsCount ?? users.filter(u => u.status?.toLowerCase() === 'locked').length
  };

  const menuItems: MenuProps['items'] = [
    { key: 'overview', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: 'jobs', icon: <AppstoreOutlined />, label: 'Việc làm' },
    { key: 'companies', icon: <BankOutlined />, label: 'Công ty' },
    { key: 'users', icon: <TeamOutlined />, label: 'Người dùng' },
    { key: 'categories', icon: <AppstoreOutlined />, label: 'Danh mục' },
    { key: 'locations', icon: <SettingOutlined />, label: 'Địa điểm' },
    { type: 'divider' as const },
    { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt hệ thống' },
  ];

  const userMenuProps: MenuProps = {
    items: [
      {
        key: '1',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
        onClick: () => {
          logout();
          message.success("Đã đăng xuất thành công!");
          navigate('/login');
        }
      },
    ],
  };

  const getBreadcrumbItems = () => {
    const items = [{ title: 'Admin' }];
    if (activeTab === 'overview') items.push({ title: 'Tổng quan' });
    else if (activeTab === 'jobs') items.push({ title: 'Việc làm' });
    else if (activeTab === 'companies') items.push({ title: 'Công ty' });
    else if (activeTab === 'users') items.push({ title: 'Người dùng' });
    else if (activeTab === 'categories') items.push({ title: 'Danh mục' });
    else if (activeTab === 'locations') items.push({ title: 'Địa điểm' });
    else if (activeTab === 'settings') items.push({ title: 'Cài đặt' });
    return items;
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6366f1', // Indigo color
          borderRadius: 12,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
        components: {
          Layout: {
            siderBg: '#1e1b4b', // Very dark indigo
            headerBg: '#ffffff',
          },
          Menu: {
            darkItemBg: '#1e1b4b',
            darkItemSelectedBg: '#4f46e5',
          }
        }
      }}
    >
      <App>
        <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            theme="dark"
            width={260}
            style={{ position: 'sticky', top: 0, left: 0, height: '100vh', overflow: 'auto', boxShadow: '4px 0 24px rgba(0,0,0,0.05)' }}
          >
            <div style={{ height: 64, margin: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', flexShrink: 0 }}>
                A
              </div>
              {!collapsed && <span style={{ color: '#fff', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' }}>ADMIN PANEL</span>}
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[activeTab]}
              items={menuItems}
              onClick={(e) => setActiveTab(e.key)}
              style={{ padding: '0 8px' }}
            />
          </Sider>

          <Layout>
            <Header style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', position: 'sticky', top: 0, zIndex: 10, width: '100%' }}>
              <Space size={16}>
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ fontSize: '16px', width: 40, height: 40 }}
                />
                <Breadcrumb items={getBreadcrumbItems()} />
              </Space>

              <Space size={24}>
                <Button type="text" icon={<BellOutlined />} style={{ fontSize: '18px', color: '#64748b' }} />
                <Dropdown menu={userMenuProps} placement="bottomRight" arrow>
                  <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'all 0.2s' }} className="hover:bg-slate-50">
                    <Avatar src="/images/avatar/admin.png" style={{ border: '2px solid #e2e8f0' }} />
                    {!collapsed && (
                      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>Quản trị viên</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Super Admin</span>
                      </div>
                    )}
                  </Space>
                </Dropdown>
              </Space>
            </Header>

            <Content style={{ margin: '24px 24px', minHeight: 280 }}>
              <div style={{ padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)' }}>
                {activeTab === 'overview' && (
                  <AdminOverviewSection
                    stats={displayStats}
                    loading={loading}
                    onSwitchTab={setActiveTab}
                    jobs={jobs}
                    users={users}
                    companies={companies}
                  />
                )}
                {activeTab === 'jobs' && <AdminManageJobsSection jobs={jobs} loading={loading} refreshData={fetchDashboardData} />}
                {activeTab === 'companies' && <AdminManageCompaniesSection companies={companies} loading={loading} refreshData={fetchDashboardData} />}
                {activeTab === 'users' && <AdminManageUsersSection users={users} loading={loading} refreshData={fetchDashboardData} />}
                {activeTab === 'categories' && <AdminManageCategoriesSection />}
                {activeTab === 'locations' && <AdminManageLocationsSection />}
                {activeTab === 'settings' && (
                  <div style={{ padding: '80px 0', textAlign: 'center' }}>
                    <SettingOutlined style={{ fontSize: '64px', color: '#e2e8f0', marginBottom: '24px' }} />
                    <h2 style={{ color: '#64748b', fontWeight: 700 }}>Cài đặt hệ thống</h2>
                    <p style={{ color: '#94a3b8' }}>Tính năng này đang được phát triển. Vui lòng quay lại sau!</p>
                  </div>
                )}
              </div>
            </Content>

            <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: '12px' }}>
              JobPortal Admin &copy;2026 - Modern Dashboard v2.0
            </div>
          </Layout>
        </Layout>
      </App>
    </ConfigProvider>
  );
};

export default AdminDashboardPage;
