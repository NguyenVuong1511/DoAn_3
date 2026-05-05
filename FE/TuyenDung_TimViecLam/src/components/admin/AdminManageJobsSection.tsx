import React, { useState } from 'react';
import { Table, Tag, Button, Input, Select, Space, App, Typography, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  CheckCircleOutlined, 
  StopOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { toggleJobStatusAdmin } from '../../services/adminService';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface AdminManageJobsSectionProps {
  jobs: any[];
  loading: boolean;
  refreshData: () => void;
}

const AdminManageJobsSection: React.FC<AdminManageJobsSectionProps> = ({ jobs, loading, refreshData }) => {
  const { message, modal } = App.useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleToggleStatus = async (jobId: string, action: string) => {
    try {
      setIsUpdating(jobId);
      const res = await toggleJobStatusAdmin(jobId, action);
      if (res.success) {
        message.success(res.message || "Cập nhật trạng thái thành công!");
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

  const filteredJobs = jobs.filter(job => {
    const title = job.title || '';
    const company = job.companyName || '';
    const status = job.status?.toLowerCase() || '';
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          company.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter !== 'All') {
      const filter = statusFilter.toLowerCase();
      if (filter === 'inactive') {
        // Group inactive, expired, and rejected
        matchesStatus = ['inactive', 'expired', 'rejected'].includes(status);
      } else {
        matchesStatus = status === filter;
      }
    }
    
    return matchesSearch && matchesStatus;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => 
    new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
  );

  const columns: ColumnsType<any> = [
    {
      title: 'Thông tin công việc',
      dataIndex: 'title',
      key: 'title',
      width: '35%',
      render: (text, record) => (
        <Space orientation="vertical" size={0}>
          <Text strong style={{ fontSize: '15px', color: '#1e293b' }}>{text}</Text>
          <Space separator={<Text type="secondary">·</Text>} style={{ fontSize: '12px' }}>
            <Text type="secondary"><Tag color="blue" variant="filled" style={{ margin: 0, fontSize: '10px' }}>{record.jobTypeName}</Tag></Text>
            <Text type="secondary"><EnvironmentOutlined /> {record.locationName}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Công ty',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text) => <Text strong style={{ color: '#475569' }}>{text || 'N/A'}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const s = status?.toLowerCase();
        let color = 'default';
        let icon = <InfoCircleOutlined />;
        if (s === 'active' || s === 'approved') { color = 'success'; icon = <CheckCircleOutlined />; }
        else if (s === 'pending') { color = 'warning'; icon = <CalendarOutlined />; }
        else if (s === 'inactive' || s === 'expired') { color = 'error'; icon = <StopOutlined />; }
        
        return (
          <Tag icon={icon} color={color} style={{ borderRadius: '6px', fontWeight: 600, padding: '2px 8px' }}>
            {status?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Hạn cuối',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 150,
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
        const s = record.status?.toLowerCase();
        const isPending = s === 'pending';
        const isActive = s === 'active' || s === 'approved';
        const isInactive = s === 'inactive';
        const isRejected = s === 'rejected';

        return (
          <Space>
            <Tooltip title="Xem chi tiết">
              <Button size="small" icon={<EyeOutlined />} shape="circle" />
            </Tooltip>
            
            {isPending && (
              <Space>
                <Button 
                    type="primary" 
                    size="small" 
                    icon={<CheckCircleOutlined />}
                    loading={isUpdating === record.id}
                    style={{ borderRadius: '6px', fontSize: '12px', fontWeight: 600, background: '#10b981', borderColor: '#10b981' }}
                    onClick={() => {
                        modal.confirm({
                            title: 'Duyệt bài đăng',
                            content: 'Bạn có chắc chắn muốn duyệt bài đăng tuyển dụng này?',
                            okText: 'Duyệt bài',
                            cancelText: 'Hủy',
                            onOk: () => handleToggleStatus(record.id, 'approve')
                        });
                    }}
                >
                    Duyệt
                </Button>
                <Button 
                    danger
                    size="small" 
                    icon={<StopOutlined />}
                    loading={isUpdating === record.id}
                    style={{ borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}
                    onClick={() => {
                        modal.confirm({
                            title: 'Từ chối bài đăng',
                            content: 'Bạn có chắc chắn muốn từ chối bài đăng tuyển dụng này?',
                            okText: 'Từ chối',
                            cancelText: 'Hủy',
                            okButtonProps: { danger: true },
                            onOk: () => handleToggleStatus(record.id, 'reject')
                        });
                    }}
                >
                    Từ chối
                </Button>
              </Space>
            )}

            {(isActive || isInactive) && (
                <Button 
                  danger 
                  size="small" 
                  icon={<StopOutlined />}
                  loading={isUpdating === record.id}
                  style={{ borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}
                  onClick={() => {
                      modal.confirm({
                          title: 'Khóa bài đăng',
                          content: 'Bạn có chắc chắn muốn khóa bài đăng này?',
                          okText: 'Khóa ngay',
                          cancelText: 'Hủy',
                          okButtonProps: { danger: true },
                          onOk: () => handleToggleStatus(record.id, 'reject')
                      });
                  }}
                >
                  Khóa
                </Button>
            )}

            {isRejected && (
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<CheckCircleOutlined />}
                  loading={isUpdating === record.id}
                  style={{ borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}
                  onClick={() => {
                      modal.confirm({
                          title: 'Duyệt lại bài đăng',
                          content: 'Bạn có chắc chắn muốn duyệt lại bài đăng này?',
                          okText: 'Duyệt lại',
                          cancelText: 'Hủy',
                          onOk: () => handleToggleStatus(record.id, 'approve')
                      });
                  }}
                >
                  Duyệt lại
                </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Quản lý Tin tuyển dụng</Title>
        <Text type="secondary">Phê duyệt hoặc tạm dừng các bài đăng tuyển dụng từ nhà tuyển dụng.</Text>
      </div>
      
      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #f1f5f9' }}>
        <Space wrap size={16}>
          <Input 
            placeholder="Tìm theo tiêu đề, công ty..." 
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300, borderRadius: '8px' }}
            allowClear
          />
          <Select 
            value={statusFilter} 
            onChange={setStatusFilter} 
            style={{ width: 180 }}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="All">Tất cả trạng thái</Option>
            <Option value="Active">Đang hoạt động</Option>
            <Option value="Pending">Chờ phê duyệt</Option>
            <Option value="Rejected">Bị từ chối</Option>
            <Option value="Inactive">Đã ẩn / Hết hạn</Option>
          </Select>
          <Text type="secondary" style={{ fontSize: '13px' }}>Hiển thị {sortedJobs.length} kết quả</Text>
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={sortedJobs} 
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

export default AdminManageJobsSection;
