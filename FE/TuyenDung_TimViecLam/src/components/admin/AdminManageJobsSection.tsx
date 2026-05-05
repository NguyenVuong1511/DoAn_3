import React, { useState } from 'react';
import { Table, Tag, Button, Input, Select, Space, App, Typography, Tooltip, Modal, Descriptions, Divider, Avatar } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  SolutionOutlined,
  BankOutlined,
  TeamOutlined
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
  const [previewJob, setPreviewJob] = useState<any>(null);

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
            <Text type="secondary"><Tag color="blue" style={{ margin: 0, fontSize: '10px' }}>{record.jobTypeName}</Tag></Text>
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
              <Button
                size="small"
                icon={<EyeOutlined />}
                shape="circle"
                onClick={() => setPreviewJob(record)}
              />
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

      {/* Job Preview Modal */}
      <Modal
        title={null}
        open={!!previewJob}
        onCancel={() => setPreviewJob(null)}
        footer={[
          <Button key="close" onClick={() => setPreviewJob(null)} style={{ borderRadius: '8px' }}>
            Đóng
          </Button>,
          previewJob?.status?.toLowerCase() === 'pending' && (
            <Button
              key="approve"
              type="primary"
              style={{ background: '#10b981', borderColor: '#10b981', borderRadius: '8px' }}
              onClick={() => {
                handleToggleStatus(previewJob.id, 'approve');
                setPreviewJob(null);
              }}
            >
              Duyệt ngay
            </Button>
          )
        ]}
        width={800}
        centered
        styles={{ body: { paddingTop: 30 } }}
      >
        {previewJob && (
          <div style={{ overflow: 'hidden', borderRadius: '12px' }}>
            {/* Header / Cover Placeholder */}
            <div style={{ height: '160px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '-40px', left: '32px', padding: '4px', background: 'white', borderRadius: '20px' }}>
                <Avatar
                  src={previewJob.companyLogo ? (previewJob.companyLogo.startsWith('http') ? previewJob.companyLogo : `/images/${previewJob.companyLogo}`) : undefined}
                  shape="square"
                  size={120}
                  style={{ borderRadius: '16px', border: '4px solid white', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                  icon={<BankOutlined />}
                />
              </div>
              <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
                <Tag color={previewJob.status?.toLowerCase() === 'active' || previewJob.status?.toLowerCase() === 'approved' ? 'success' : 'warning'} style={{ borderRadius: '20px', padding: '4px 16px', fontWeight: 700, fontSize: '12px' }}>
                  {previewJob.status?.toUpperCase()}
                </Tag>
              </div>
            </div>

            <div style={{ padding: '64px 32px 32px' }}>
              <Space direction="vertical" size={24} style={{ width: '100%' }}>
                <div>
                  <Title level={2} style={{ margin: 0, fontWeight: 900, color: '#1e293b' }}>{previewJob.title}</Title>
                  <Space split={<Divider type="vertical" />} style={{ marginTop: 8 }} wrap>
                    <Text strong style={{ color: '#4f46e5', fontSize: '16px' }}>{previewJob.companyName}</Text>
                    <Text type="secondary"><EnvironmentOutlined /> {previewJob.locationName}</Text>
                    <Text type="secondary"><CalendarOutlined /> Đăng ngày: {new Date(previewJob.postDate).toLocaleDateString('vi-VN')}</Text>
                    <Text type="secondary"><CalendarOutlined /> Hạn: {new Date(previewJob.deadline).toLocaleDateString('vi-VN')}</Text>
                  </Space>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>Mức lương</Text>
                    <Text strong style={{ fontSize: '16px', color: '#10b981' }}>
                      <DollarOutlined /> {previewJob.salaryRange || (previewJob.minSalary && previewJob.maxSalary ? `${previewJob.minSalary.toLocaleString()} - ${previewJob.maxSalary.toLocaleString()} VNĐ` : 'Thỏa thuận')}
                    </Text>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>Hình thức</Text>
                    <Text strong style={{ fontSize: '16px' }}><FieldTimeOutlined /> {previewJob.jobTypeName}</Text>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>Kinh nghiệm</Text>
                    <Text strong style={{ fontSize: '16px' }}><SolutionOutlined /> {previewJob.experienceName || 'Không yêu cầu'}</Text>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>Số lượng tuyển</Text>
                    <Text strong style={{ fontSize: '16px' }}><TeamOutlined /> {previewJob.quantity} người</Text>
                  </div>
                </div>

                <Divider style={{ margin: '8px 0' }} />

                <Descriptions title={<Text strong style={{ fontSize: '18px' }}>Thông tin chi tiết</Text>} column={2}>
                  <Descriptions.Item label="Lĩnh vực">
                    <Tag color="blue">{previewJob.categoryName || 'N/A'}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Cấp bậc">
                    {previewJob.levelName || 'Nhân viên'}
                  </Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 8 }}>
                  <Text strong style={{ fontSize: '18px', display: 'block', marginBottom: 12 }}>Mô tả công việc</Text>
                  <div
                    style={{ color: '#475569', lineHeight: '1.8', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}
                    dangerouslySetInnerHTML={{ __html: previewJob.description || 'Chưa cập nhật mô tả.' }}
                  />
                </div>

                {(previewJob.requirement || previewJob.requirements) && (
                  <div style={{ marginTop: 8 }}>
                    <Text strong style={{ fontSize: '18px', display: 'block', marginBottom: 12 }}>Yêu cầu ứng viên</Text>
                    <div
                      style={{ color: '#475569', lineHeight: '1.8', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}
                      dangerouslySetInnerHTML={{ __html: previewJob.requirement || previewJob.requirements }}
                    />
                  </div>
                )}

                {(previewJob.benefit || previewJob.benefits) && (
                  <div style={{ marginTop: 8 }}>
                    <Text strong style={{ fontSize: '18px', display: 'block', marginBottom: 12 }}>Quyền lợi</Text>
                    <div
                      style={{ color: '#475569', lineHeight: '1.8', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}
                      dangerouslySetInnerHTML={{ __html: previewJob.benefit || previewJob.benefits }}
                    />
                  </div>
                )}
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminManageJobsSection;
