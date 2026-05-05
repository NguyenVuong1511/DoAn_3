import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Card, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagOutlined } from '@ant-design/icons';
import { getAllCategoriesAdmin, addCategoryAdmin, updateCategoryAdmin, deleteCategoryAdmin } from '../../services/adminService';

const AdminManageCategoriesSection = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [form] = Form.useForm();

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await getAllCategoriesAdmin();
            if (res.success) {
                setCategories(res.data);
            }
        } catch (error) {
            message.error("Không thể tải danh sách danh mục");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const showModal = (category?: any) => {
        if (category) {
            setEditingCategory(category);
            form.setFieldsValue({
                name: category.name,
                iconName: category.iconName,
                color: category.color,
                bgColor: category.bgColor
            });
        } else {
            setEditingCategory(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingCategory) {
                const res = await updateCategoryAdmin(editingCategory.id, values);
                if (res.success) {
                    message.success("Cập nhật danh mục thành công");
                    setIsModalVisible(false);
                    fetchCategories();
                }
            } else {
                const res = await addCategoryAdmin(values);
                if (res.success) {
                    message.success("Thêm danh mục thành công");
                    setIsModalVisible(false);
                    fetchCategories();
                }
            }
        } catch (error) {
            console.error("Submit error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await deleteCategoryAdmin(id);
            if (res.success) {
                message.success("Xóa danh mục thành công");
                fetchCategories();
            }
        } catch (error) {
            message.error("Không thể xóa danh mục");
        }
    };

    const columns = [
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <Space>
                    <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: record.bgColor || '#f0f2f5', color: record.color || '#1890ff' }}
                    >
                        <TagOutlined />
                    </div>
                    <span className="font-bold">{text}</span>
                </Space>
            )
        },
        {
            title: 'Icon (Lucide)',
            dataIndex: 'iconName',
            key: 'iconName',
            render: (text: string) => <Tag color="blue">{text || 'N/A'}</Tag>
        },
        {
            title: 'Màu sắc',
            key: 'colors',
            render: (_: any, record: any) => (
                <Space>
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: record.color }}></div>
                    <span className="text-xs text-gray-400">{record.color}</span>
                    <div className="w-4 h-4 rounded-full border ml-2" style={{ backgroundColor: record.bgColor }}></div>
                    <span className="text-xs text-gray-400">{record.bgColor}</span>
                </Space>
            )
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
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa danh mục này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="text" icon={<DeleteOutlined className="text-red-500" />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Quản lý danh mục</h2>
                    <p className="text-gray-500 font-medium">Thêm, sửa hoặc xóa các danh mục nghề nghiệp trên hệ thống</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => showModal()}
                    className="h-10 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 border-none font-bold shadow-lg shadow-indigo-600/20"
                >
                    Thêm danh mục
                </Button>
            </div>

            <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                <Table 
                    columns={columns} 
                    dataSource={categories} 
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Xác nhận"
                cancelText="Hủy bỏ"
                centered
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item
                        name="name"
                        label="Tên danh mục"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
                    >
                        <Input placeholder="Ví dụ: Công nghệ thông tin" className="h-10 rounded-lg" />
                    </Form.Item>
                    <Form.Item
                        name="iconName"
                        label="Tên Icon (Lucide)"
                        tooltip="Nhập tên icon từ thư viện Lucide React"
                    >
                        <Input placeholder="Ví dụ: Code, Briefcase..." className="h-10 rounded-lg" />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="color"
                            label="Màu Text (Hex)"
                        >
                            <Input placeholder="#6366f1" className="h-10 rounded-lg" />
                        </Form.Item>
                        <Form.Item
                            name="bgColor"
                            label="Màu Nền (Hex)"
                        >
                            <Input placeholder="#eef2ff" className="h-10 rounded-lg" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminManageCategoriesSection;
