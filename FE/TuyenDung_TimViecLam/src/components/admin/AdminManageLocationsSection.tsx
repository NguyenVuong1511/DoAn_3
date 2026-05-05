import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { getAllLocationsAdmin, addLocationAdmin, updateLocationAdmin, deleteLocationAdmin } from '../../services/adminService';

const AdminManageLocationsSection = () => {
    const { message, modal } = App.useApp();
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingLocation, setEditingLocation] = useState<any>(null);
    const [form] = Form.useForm();

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const res = await getAllLocationsAdmin();
            if (res.success) {
                setLocations(res.data);
            }
        } catch (error) {
            message.error("Không thể tải danh sách địa điểm");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const showModal = (location?: any) => {
        if (location) {
            setEditingLocation(location);
            form.setFieldsValue({ name: location.name });
        } else {
            setEditingLocation(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingLocation) {
                const res = await updateLocationAdmin(editingLocation.id, values);
                if (res.success) {
                    message.success("Cập nhật địa điểm thành công");
                    setIsModalVisible(false);
                    fetchLocations();
                }
            } else {
                const res = await addLocationAdmin(values);
                if (res.success) {
                    message.success("Thêm địa điểm thành công");
                    setIsModalVisible(false);
                    fetchLocations();
                }
            }
        } catch (error) {
            console.error("Submit error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await deleteLocationAdmin(id);
            if (res.success) {
                message.success("Xóa địa điểm thành công");
                fetchLocations();
            }
        } catch (error) {
            message.error("Không thể xóa địa điểm");
        }
    };

    const columns = [
        {
            title: 'Tên địa điểm',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
                <Space>
                    <EnvironmentOutlined className="text-indigo-500" />
                    <span className="font-bold">{text}</span>
                </Space>
            )
        },
        {
            title: 'Mã định danh',
            dataIndex: 'id',
            key: 'id',
            render: (id: string) => <span className="text-xs text-gray-400 font-mono">{id}</span>
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button 
                        type="text" 
                        icon={<EditOutlined className="text-blue-500" />} 
                        onClick={() => showModal(record)}
                    />
                    <Button 
                        type="text" 
                        icon={<DeleteOutlined className="text-red-500" />} 
                        onClick={() => {
                            modal.confirm({
                                title: 'Xác nhận xóa',
                                content: 'Bạn có chắc chắn muốn xóa địa điểm này?',
                                okText: 'Có',
                                cancelText: 'Không',
                                okButtonProps: { danger: true },
                                onOk: () => handleDelete(record.id)
                            });
                        }}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Quản lý địa điểm</h2>
                    <p className="text-gray-500 font-medium">Quản lý danh sách các tỉnh thành, khu vực tuyển dụng</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => showModal()}
                    className="h-10 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 border-none font-bold shadow-lg shadow-indigo-600/20"
                >
                    Thêm địa điểm
                </Button>
            </div>

            <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                <Table 
                    columns={columns} 
                    dataSource={locations} 
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingLocation ? "Chỉnh sửa địa điểm" : "Thêm địa điểm mới"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Xác nhận"
                cancelText="Hủy bỏ"
                centered
                destroyOnHidden
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item
                        name="name"
                        label="Tên địa điểm"
                        rules={[{ required: true, message: 'Vui lòng nhập tên địa điểm' }]}
                    >
                        <Input placeholder="Ví dụ: TP. Hồ Chí Minh" className="h-10 rounded-lg" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminManageLocationsSection;
