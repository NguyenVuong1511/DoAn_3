import React from 'react';
import { Row, Col, Card, Statistic, Button, Spin, Space, Typography, Tag, Avatar, Badge, Progress } from 'antd';
import { 
  AppstoreOutlined, 
  BankOutlined, 
  TeamOutlined, 
  WarningOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  SettingOutlined,
  UserOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import type { AdminUser, AdminCompany } from '../../services/adminService';

const { Title, Text } = Typography;

interface Stats {
  totalJobs: number;
  pendingJobs: number;
  totalCompanies: number;
  totalUsers: number;
  lockedUsers: number;
}

interface AdminOverviewSectionProps {
  stats: Stats;
  loading: boolean;
  onSwitchTab: (tab: string) => void;
  jobs: any[];
  users: AdminUser[];
  companies: AdminCompany[];
}

const AdminOverviewSection: React.FC<AdminOverviewSectionProps> = ({ 
  stats, 
  loading, 
  onSwitchTab,
  jobs,
  users,
  companies
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', color: '#94a3b8' }}>Đang tải dữ liệu quản trị...</div>
      </div>
    );
  }

  const cardStyles = {
    borderRadius: '20px',
    border: 'none',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    height: '100%'
  };

  const iconBoxStyles = (color: string) => ({
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
    color: color,
    marginBottom: '20px'
  });

  // Get recent 5 users
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Get recent 5 jobs
  const recentJobs = [...jobs]
    .sort((a, b) => {
      const dateA = new Date(a.postDate || a.createdAt).getTime();
      const dateB = new Date(b.postDate || b.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="animate-in fade-in duration-700">
      <div style={{ marginBottom: 32 }}>
        <Title level={4} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>Bảng điều khiển tổng quan</Title>
        <Text type="secondary">Chào mừng quay trở lại, đây là những gì đang diễn ra hôm nay.</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable 
            style={cardStyles} 
            className="hover:-translate-y-1"
            styles={{ body: { padding: '24px' } }}
          >
            <div style={iconBoxStyles('#6366f1')}>
              <AppstoreOutlined />
            </div>
            <Statistic
              title={<Text strong style={{ color: '#64748b' }}>Tổng việc làm</Text>}
              value={stats.totalJobs}
              styles={{ content: { fontWeight: 800, fontSize: '32px', letterSpacing: '-1px' } }}
            />
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge status="success" text={<Text type="secondary" style={{ fontSize: '12px' }}>{jobs.filter(j => j.status?.toLowerCase() === 'active' || j.status?.toLowerCase() === 'approved').length} đang hoạt động</Text>} />
            </div>
            <Button 
              type="text" 
              onClick={() => onSwitchTab('jobs')} 
              style={{ padding: 0, marginTop: 16, color: '#6366f1', fontWeight: 700 }}
              icon={<ArrowRightOutlined />}
            >
              Xem tất cả
            </Button>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable 
            style={{ ...cardStyles, background: 'linear-gradient(135deg, #fff 0%, #fff1f2 100%)' }} 
            className="hover:-translate-y-1"
            styles={{ body: { padding: '24px' } }}
          >
            <div style={iconBoxStyles('#f43f5e')}>
              <WarningOutlined />
            </div>
            <Statistic
              title={<Text strong style={{ color: '#e11d48' }}>Cần phê duyệt</Text>}
              value={stats.pendingJobs}
              styles={{ content: { fontWeight: 800, fontSize: '32px', letterSpacing: '-1px', color: '#e11d48' } }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="danger" style={{ fontSize: '12px', fontWeight: 600 }}>Cần xử lý ngay</Text>
            </div>
            <Button 
              type="text" 
              onClick={() => onSwitchTab('jobs')} 
              style={{ padding: 0, marginTop: 16, color: '#f43f5e', fontWeight: 700 }}
              icon={<ArrowRightOutlined />}
            >
              Duyệt ngay
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable 
            style={cardStyles} 
            className="hover:-translate-y-1"
            styles={{ body: { padding: '24px' } }}
          >
            <div style={iconBoxStyles('#8b5cf6')}>
              <BankOutlined />
            </div>
            <Statistic
              title={<Text strong style={{ color: '#64748b' }}>Công ty đối tác</Text>}
              value={stats.totalCompanies}
              styles={{ content: { fontWeight: 800, fontSize: '32px', letterSpacing: '-1px' } }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>{companies.filter(c => c.isVerified).length} đã xác minh</Text>
            </div>
            <Button 
              type="text" 
              onClick={() => onSwitchTab('companies')} 
              style={{ padding: 0, marginTop: 16, color: '#8b5cf6', fontWeight: 700 }}
              icon={<ArrowRightOutlined />}
            >
              Quản lý
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable 
            style={cardStyles} 
            className="hover:-translate-y-1"
            styles={{ body: { padding: '24px' } }}
          >
            <div style={iconBoxStyles('#f59e0b')}>
              <TeamOutlined />
            </div>
            <Statistic
              title={<Text strong style={{ color: '#64748b' }}>Người dùng</Text>}
              value={stats.totalUsers}
              styles={{ content: { fontWeight: 800, fontSize: '32px', letterSpacing: '-1px' } }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>{stats.lockedUsers} tài khoản bị khóa</Text>
            </div>
            <Button 
              type="text" 
              onClick={() => onSwitchTab('users')} 
              style={{ padding: 0, marginTop: 16, color: '#f59e0b', fontWeight: 700 }}
              icon={<ArrowRightOutlined />}
            >
              Chi tiết
            </Button>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Recent Jobs */}
        <Col xs={24} lg={12}>
          <Card 
            title={<Space><AppstoreOutlined style={{ color: '#6366f1' }} /><span>Tin tuyển dụng mới nhất</span></Space>} 
            style={cardStyles}
            extra={<Button type="link" onClick={() => onSwitchTab('jobs')}>Tất cả</Button>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentJobs.length > 0 ? recentJobs.map((job) => (
                <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', overflow: 'hidden' }}>
                    <Avatar 
                      src={job.companyLogo ? (job.companyLogo.startsWith('http') ? job.companyLogo : `/images/${job.companyLogo}`) : undefined} 
                      icon={<BankOutlined />}
                      style={{ backgroundColor: '#f8fafc', color: '#6366f1', flexShrink: 0 }}
                    />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
                      <div style={{ color: '#94a3b8', fontSize: '12px' }}>{job.companyName} • {new Date(job.postDate || job.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <Tag color={job.status?.toLowerCase() === 'pending' ? 'warning' : 'success'} style={{ flexShrink: 0, marginInlineEnd: 0 }}>
                    {job.status?.toLowerCase() === 'pending' ? 'Chờ duyệt' : 'Hoạt động'}
                  </Tag>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>Chưa có tin tuyển dụng nào</div>
              )}
            </div>
          </Card>
        </Col>

        {/* Recent Users */}
        <Col xs={24} lg={12}>
          <Card 
            title={<Space><TeamOutlined style={{ color: '#f59e0b' }} /><span>Người dùng mới gia nhập</span></Space>} 
            style={cardStyles}
            extra={<Button type="link" onClick={() => onSwitchTab('users')}>Tất cả</Button>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentUsers.length > 0 ? recentUsers.map((user) => (
                <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', overflow: 'hidden' }}>
                    <Avatar 
                      src={
                        user.avatar 
                          ? (user.avatar.startsWith('http') ? user.avatar : `/images/avatar/${user.avatar}`)
                          : (user.companyLogo 
                            ? (user.companyLogo.startsWith('http') ? user.companyLogo : `/images/${user.companyLogo}`)
                            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`)
                      }
                      icon={<UserOutlined />} 
                      style={{ 
                        backgroundColor: user.role === 'RECRUITER' ? '#eff6ff' : '#f0fdf4', 
                        color: user.role === 'RECRUITER' ? '#3b82f6' : '#22c55e', 
                        flexShrink: 0 
                      }} 
                    />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.fullName || user.email}</div>
                      <div style={{ color: '#94a3b8', fontSize: '12px' }}>{user.email} • {new Date(user.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <Tag color={user.role === 'ADMIN' ? 'purple' : user.role === 'RECRUITER' ? 'blue' : 'green'} style={{ flexShrink: 0, marginInlineEnd: 0 }}>
                    {user.role}
                  </Tag>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>Chưa có người dùng nào</div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card 
            title={<Space><CloudServerOutlined style={{ color: '#10b981' }} /><span>Trạng thái & Hiệu năng hệ thống</span></Space>} 
            style={cardStyles}
            styles={{ header: { border: 'none', padding: '24px 24px 0' } }}
          >
            <Row gutter={[32, 32]}>
              <Col span={12}>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text strong>API Response Rate</Text>
                    <Text type="secondary">99.8%</Text>
                  </div>
                  <Progress percent={99.8} size="small" strokeColor="#10b981" showInfo={false} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <Space>
                    <Badge status="success" />
                    <Text strong>Auth Service</Text>
                  </Space>
                  <Tag color="success">STABLE</Tag>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text strong>Server CPU Load</Text>
                    <Text type="secondary">24%</Text>
                  </div>
                  <Progress percent={24} size="small" strokeColor="#6366f1" showInfo={false} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <Space>
                    <Badge status="success" />
                    <Text strong>Storage Cluster</Text>
                  </Space>
                  <Tag color="success">HEALTHY</Tag>
                </div>
              </Col>
            </Row>

            <div style={{ marginTop: 24, padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space size={16}>
                <div style={{ padding: 10, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <SafetyCertificateOutlined style={{ color: '#10b981', fontSize: '20px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>Chứng chỉ SSL & Bảo mật</div>
                  <div style={{ color: '#94a3b8', fontSize: '13px' }}>Đã xác thực • Hết hạn sau 284 ngày</div>
                </div>
              </Space>
              <Button size="small" icon={<SettingOutlined />}>Chi tiết</Button>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card 
            title={<Space><CheckCircleOutlined style={{ color: '#f59e0b' }} /><span>Hành động nhanh</span></Space>}
            style={cardStyles}
            styles={{ header: { border: 'none', padding: '24px 24px 0' } }}
          >
             <Space orientation="vertical" style={{ width: '100%' }} size={12}>
               <Button 
                type="primary" 
                block 
                size="large" 
                onClick={() => onSwitchTab('jobs')} 
                style={{ height: '52px', fontWeight: 700, borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none' }}
                icon={<AppstoreOutlined />}
              >
                 Duyệt Tin tuyển dụng
               </Button>
               <Button 
                block 
                size="large" 
                onClick={() => onSwitchTab('users')} 
                style={{ height: '52px', fontWeight: 700, borderRadius: '12px' }}
                icon={<TeamOutlined />}
              >
                 Quản lý Người dùng
               </Button>
               <Button 
                block 
                size="large" 
                icon={<SettingOutlined />} 
                style={{ height: '52px', fontWeight: 700, borderRadius: '12px' }}
              >
                 Cấu hình Hệ thống
               </Button>
               
               <div style={{ marginTop: 12, padding: '16px', borderRadius: '12px', background: '#fffbeb', border: '1px solid #fef3c7' }}>
                 <div style={{ display: 'flex', gap: '12px' }}>
                   <WarningOutlined style={{ color: '#f59e0b', fontSize: '18px', marginTop: '2px' }} />
                   <div>
                     <Text strong style={{ color: '#92400e', fontSize: '13px' }}>Lời nhắc quản trị</Text>
                     <div style={{ color: '#b45309', fontSize: '12px', marginTop: '4px' }}>
                       Có {stats.pendingJobs} tin tuyển dụng đang chờ bạn phê duyệt từ hôm qua.
                     </div>
                   </div>
                 </div>
               </div>
             </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminOverviewSection;
