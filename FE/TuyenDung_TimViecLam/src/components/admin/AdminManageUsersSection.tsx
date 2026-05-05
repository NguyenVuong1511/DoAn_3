import React, { useState } from 'react';
import { Table, Input, Tag, Select, Space, Button, Popconfirm, message, Avatar, Typography, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  UserOutlined, 
  LockOutlined, 
  UnlockOutlined, 
  CrownOutlined,
  MailOutlined,
  MoreOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { toggleUserStatusAdmin, type AdminUser } from '../../services/adminService';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface AdminManageUsersSectionProps {
  users: AdminUser[];
  loading: boolean;
  refreshData: () => void;
}

const AdminManageUsersSection: React.FC<AdminManageUsersSectionProps> = ({ users, loading, refreshData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleToggleStatus = async (userId: string) => {
    try {
      setIsUpdating(userId);
      const res = await toggleUserStatusAdmin(userId);
      if (res.success) {
        message.success(res.message || "Cập nhật trạng thái người dùng thành công!");
        refreshData();
      } else {
        message.error(res.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      message.error("Lỗi hệ thống");
      console.error(error);
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchString = `${user.email} ${user.fullName || ''} ${user.companyName || ''}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns: ColumnsType<AdminUser> = [
    {
      title: 'Thông tin tài khoản',
      key: 'user',
      width: '35%',
      render: (_, record) => (
        <Space size={12}>
          <Avatar 
            src={
              record.avatar 
                ? (record.avatar.startsWith('http') ? record.avatar : `/images/avatar/${record.avatar}`)
                : (record.companyLogo 
                  ? (record.companyLogo.startsWith('http') ? record.companyLogo : `/images/${record.companyLogo}`)
                  : `https://api.dicebear.com/7.x/avataaars/svg?seed=${record.email}`)
            }
            size={44}
            style={{ 
              backgroundColor: record.role === 'ADMIN' ? '#e9d5ff' : '#dbeafe',
              color: record.role === 'ADMIN' ? '#7e22ce' : '#2563eb',
              border: '2px solid #fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
            icon={record.role === 'ADMIN' ? <CrownOutlined /> : <UserOutlined />}
          />
          <Space orientation="vertical" size={0}>
            <Text strong style={{ fontSize: '15px', color: '#1e293b' }}>
              {record.fullName || record.companyName || 'Người dùng ẩn danh'}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}><MailOutlined /> {record.email}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Phân quyền',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = 'default';
        let icon = <UserOutlined />;
        if (role === 'ADMIN') { color = 'purple'; icon = <CrownOutlined />; }
        if (role === 'RECRUITER') { color = 'blue'; }
        if (role === 'CANDIDATE') { color = 'cyan'; }
        return (
          <Tag icon={icon} color={color} style={{ borderRadius: '6px', fontWeight: 600, padding: '2px 10px' }}>
            {role}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={status === 'ACTIVE' ? 'success' : 'error'} 
          style={{ borderRadius: '20px', padding: '0 12px', fontWeight: 600 }}
        >
          {status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => (
        <Space size={8}>
          <CalendarOutlined style={{ color: '#94a3b8' }} />
          <Text style={{ fontSize: '13px' }}>{new Date(text).toLocaleDateString('vi-VN')}</Text>
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right',
      render: (_, record) => {
        if (record.role === 'ADMIN') return null;
        return (
          <Space>
            <Popconfirm
              title={`Bạn có chắc muốn ${record.status === 'ACTIVE' ? 'khóa' : 'mở khóa'} người dùng này?`}
              onConfirm={() => handleToggleStatus(record.id)}
              okText="Xác nhận"
              cancelText="Hủy"
              okButtonProps={{ danger: record.status === 'ACTIVE' }}
            >
              {record.status === 'ACTIVE' ? (
                <Button 
                  danger 
                  size="small" 
                  icon={<LockOutlined />}
                  loading={isUpdating === record.id}
                  style={{ borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}
                >
                  Khóa
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<UnlockOutlined />}
                  loading={isUpdating === record.id}
                  style={{ borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}
                >
                  Mở khóa
                </Button>
              )}
            </Popconfirm>
            <Button type="text" icon={<MoreOutlined />} shape="circle" />
          </Space>
        );
      },
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Quản lý Tài khoản</Title>
        <Text type="secondary">Quản lý quyền truy cập và trạng thái hoạt động của thành viên hệ thống.</Text>
      </div>
      
      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #f1f5f9' }}>
        <Space wrap size={16}>
          <Input 
            placeholder="Tìm theo email, tên, công ty..." 
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300, borderRadius: '8px' }}
            allowClear
          />
          <Select 
            value={roleFilter} 
            onChange={setRoleFilter} 
            style={{ width: 180 }}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="All">Tất cả vai trò</Option>
            <Option value="CANDIDATE">Ứng viên</Option>
            <Option value="RECRUITER">Nhà tuyển dụng</Option>
            <Option value="ADMIN">Quản trị viên</Option>
          </Select>
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredUsers} 
        rowKey="id" 
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          style: { marginTop: '24px' }
        }}
        scroll={{ x: 800 }}
        style={{ borderRadius: '12px', overflow: 'hidden' }}
      />
    </div>
  );
};

export default AdminManageUsersSection;
