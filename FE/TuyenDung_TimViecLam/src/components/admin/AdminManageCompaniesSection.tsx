import React, { useState } from 'react';
import { Table, Input, Tag, Avatar, Space, Typography, Button, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  CheckCircleOutlined, 
  GlobalOutlined, 
  EnvironmentOutlined,
  EyeOutlined,
  VerifiedOutlined
} from '@ant-design/icons';
import { verifyCompanyAdmin, type AdminCompany } from '../../services/adminService';
import type { ColumnsType } from 'antd/es/table';
import { message, Popconfirm } from 'antd';

const { Title, Text } = Typography;

interface AdminManageCompaniesSectionProps {
  companies: AdminCompany[];
  loading: boolean;
  refreshData: () => void;
}

const AdminManageCompaniesSection: React.FC<AdminManageCompaniesSectionProps> = ({ companies, loading, refreshData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleVerify = async (companyId: string) => {
    try {
      setIsUpdating(companyId);
      const res = await verifyCompanyAdmin(companyId);
      if (res.success) {
        message.success(res.message || "Xác minh công ty thành công!");
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

  const filteredCompanies = companies.filter(company => 
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnsType<any> = [
    {
      title: 'Công ty',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text, record) => (
        <Space size={12}>
          <Avatar 
            src={record.logo ? (record.logo.startsWith('http') ? record.logo : `/images/${record.logo}`) : undefined} 
            shape="square" 
            size={48}
            style={{ borderRadius: '12px', border: '1px solid #f1f5f9' }}
          >
            {!record.logo && text.charAt(0)}
          </Avatar>
          <Space orientation="vertical" size={0}>
            <Text strong style={{ fontSize: '15px', color: '#1e293b' }}>{text}</Text>
            {record.isVerified && <Tag color="success" style={{ fontSize: '10px', borderRadius: '4px', margin: 0 }}>VĂN PHÒNG CHÍNH</Tag>}
          </Space>
        </Space>
      ),
    },
    {
      title: 'Website / Kết nối',
      dataIndex: 'website',
      key: 'website',
      render: (text) => (
        text ? (
          <Button type="link" href={text} target="_blank" icon={<GlobalOutlined />} style={{ padding: 0, fontSize: '13px' }}>
            {text.replace(/^https?:\/\//, '')}
          </Button>
        ) : <Text type="secondary">Chưa cập nhật</Text>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text) => (
        <Space size={4}>
          <EnvironmentOutlined style={{ color: '#94a3b8' }} />
          <Text style={{ fontSize: '13px', color: '#475569' }} ellipsis={{ tooltip: text }}>
            {text || 'N/A'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (isVerified) => (
        isVerified ? (
          <Tag icon={<VerifiedOutlined />} color="cyan" style={{ borderRadius: '6px', fontWeight: 600 }}>
            ĐÃ XÁC MINH
          </Tag>
        ) : (
          <Tag color="default" style={{ borderRadius: '6px' }}>CHƯA XÁC MINH</Tag>
        )
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem hồ sơ công ty">
            <Button size="small" icon={<EyeOutlined />} shape="circle" />
          </Tooltip>
          {!record.isVerified && (
            <Popconfirm
              title="Xác minh công ty này?"
              onConfirm={() => handleVerify(record.id)}
              okText="Xác minh"
              cancelText="Hủy"
            >
              <Button 
                type="primary" 
                size="small" 
                loading={isUpdating === record.id}
                style={{ fontSize: '12px', borderRadius: '6px' }}
              >
                Xác minh
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Quản lý Đối tác</Title>
        <Text type="secondary">Danh sách các doanh nghiệp và nhà tuyển dụng tham gia hệ thống.</Text>
      </div>
      
      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #f1f5f9' }}>
        <Space>
          <Input 
            placeholder="Tìm theo tên công ty, địa chỉ..." 
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 350, borderRadius: '8px' }}
            allowClear
          />
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredCompanies} 
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

export default AdminManageCompaniesSection;
