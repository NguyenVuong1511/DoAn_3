import { useState, useEffect, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card, Select, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import * as LucideIcons from 'lucide-react';
import { getAllCategoriesAdmin, addCategoryAdmin, updateCategoryAdmin, deleteCategoryAdmin } from '../../services/adminService';

const { Option } = Select;

// Dynamically get all icons from lucide-react
const ALL_LUCIDE_ICONS = Object.keys(LucideIcons).filter(
    key => {
        const item = (LucideIcons as any)[key];
        return (typeof item === 'function' || (typeof item === 'object' && item !== null)) &&
            /^[A-Z]/.test(key) &&
            key !== 'createLucideIcon' &&
            key !== 'Lucide';
    }
);

// Available Tailwind-compatible colors
const AVAILABLE_COLORS = [
    { name: 'slate', hex: '#64748b', label: 'Slate' },
    { name: 'gray', hex: '#6b7280', label: 'Gray' },
    { name: 'zinc', hex: '#71717a', label: 'Zinc' },
    { name: 'neutral', hex: '#737373', label: 'Neutral' },
    { name: 'stone', hex: '#78716c', label: 'Stone' },
    { name: 'red', hex: '#ef4444', label: 'Red' },
    { name: 'orange', hex: '#f97316', label: 'Orange' },
    { name: 'amber', hex: '#f59e0b', label: 'Amber' },
    { name: 'yellow', hex: '#eab308', label: 'Yellow' },
    { name: 'lime', hex: '#84cc16', label: 'Lime' },
    { name: 'green', hex: '#22c55e', label: 'Green' },
    { name: 'emerald', hex: '#10b981', label: 'Emerald' },
    { name: 'teal', hex: '#14b8a6', label: 'Teal' },
    { name: 'cyan', hex: '#06b6d4', label: 'Cyan' },
    { name: 'sky', hex: '#0ea5e9', label: 'Sky' },
    { name: 'blue', hex: '#3b82f6', label: 'Blue' },
    { name: 'indigo', hex: '#6366f1', label: 'Indigo' },
    { name: 'violet', hex: '#8b5cf6', label: 'Violet' },
    { name: 'purple', hex: '#a855f7', label: 'Purple' },
    { name: 'fuchsia', hex: '#d946ef', label: 'Fuchsia' },
    { name: 'pink', hex: '#ec4899', label: 'Pink' },
    { name: 'rose', hex: '#f43f5e', label: 'Rose' },
];

const AdminManageCategoriesSection = () => {
    const { message, modal } = App.useApp();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [form] = Form.useForm();

    // Icon Picker States
    const [iconSearchTerm, setIconSearchTerm] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Briefcase');

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
        setEditingCategory(category || null);
        setIsModalVisible(true);
    };

    useEffect(() => {
        if (isModalVisible) {
            if (editingCategory) {
                const icon = editingCategory.iconName || 'Briefcase';
                setSelectedIcon(icon);
                form.setFieldsValue({
                    name: editingCategory.name,
                    iconName: icon,
                    color: editingCategory.color || 'blue'
                });
            } else {
                setSelectedIcon('Briefcase');
                form.resetFields();
            }
        }
    }, [isModalVisible, editingCategory, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const colorObj = AVAILABLE_COLORS.find(c => c.name === values.color);
            const payload = {
                ...values,
                bgColor: colorObj ? `${colorObj.hex}15` : '#f0f2f5'
            };

            if (editingCategory) {
                const res = await updateCategoryAdmin(editingCategory.id, payload);
                if (res.success) {
                    message.success("Cập nhật danh mục thành công");
                    setIsModalVisible(false);
                    fetchCategories();
                }
            } else {
                const res = await addCategoryAdmin(payload);
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

    const renderLucideIcon = (name: string, size = 18, color?: string) => {
        const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
        return <Icon size={size} strokeWidth={2.5} color={color || 'currentColor'} />;
    };

    const filteredIcons = useMemo(() => {
        const search = iconSearchTerm.trim().toLowerCase();
        return ALL_LUCIDE_ICONS.filter(name =>
            name.toLowerCase().includes(search)
        ).slice(0, 120);
    }, [iconSearchTerm]);

    const columns = [
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => {
                const colorObj = AVAILABLE_COLORS.find(c => c.name === record.color) || AVAILABLE_COLORS[0];
                return (
                    <Space>
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
                            style={{ backgroundColor: `${colorObj.hex}15`, color: colorObj.hex }}
                        >
                            {renderLucideIcon(record.iconName || 'Briefcase', 20, colorObj.hex)}
                        </div>
                        <span className="font-black text-gray-800">{text}</span>
                    </Space>
                );
            }
        },
        {
            title: 'Icon & Màu',
            key: 'metadata',
            render: (_: any, record: any) => {
                const colorObj = AVAILABLE_COLORS.find(c => c.name === record.color) || AVAILABLE_COLORS[0];
                return (
                    <Space>
                        <span className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {record.iconName || 'N/A'}
                        </span>
                        <span
                            className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                            style={{ backgroundColor: colorObj.hex, color: '#fff' }}
                        >
                            {record.color}
                        </span>
                    </Space>
                );
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined className="text-blue-500" />}
                        onClick={() => showModal(record)}
                        className="hover:bg-blue-50"
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined className="text-red-500" />}
                        className="hover:bg-red-50"
                        onClick={() => {
                            modal.confirm({
                                title: 'Xác nhận xóa',
                                content: 'Bạn có chắc chắn muốn xóa danh mục này?',
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
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                        Quản lý danh mục
                    </h2>
                    <p className="text-gray-500 font-medium ml-4">Phân loại ngành nghề và tùy chỉnh bộ nhận diện trực quan</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                    className="h-11 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 border-none font-bold shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
                >
                    Thêm danh mục
                </Button>
            </div>

            <Card className="rounded-[32px] border-none shadow-[0_8px_40px_rgb(0,0,0,0.04)] overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={categories}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 8 }}
                    className="admin-table"
                />
            </Card>

            <Modal
                title={
                    <div className="flex items-center gap-3 py-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            {editingCategory ? <EditOutlined /> : <PlusOutlined />}
                        </div>
                        <span className="text-xl font-black">{editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</span>
                    </div>
                }
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Xác nhận"
                cancelText="Hủy bỏ"
                centered
                destroyOnHidden
                forceRender
                width={800}
                okButtonProps={{ className: 'h-10 px-6 rounded-lg bg-indigo-600' }}
                cancelButtonProps={{ className: 'h-10 px-6 rounded-lg' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-6"
                    initialValues={{ iconName: 'Briefcase', color: 'blue' }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <Form.Item
                                name="name"
                                label={<span className="font-bold text-gray-700">Tên danh mục</span>}
                                rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
                            >
                                <Input placeholder="Ví dụ: Công nghệ thông tin" className="h-12 rounded-xl border-slate-200" />
                            </Form.Item>

                            <Form.Item
                                name="color"
                                label={<span className="font-bold text-gray-700">Màu sắc chủ đạo</span>}
                            >
                                <Select
                                    className="h-12 w-full"
                                    placeholder="Chọn màu sắc"
                                    popupMatchSelectWidth={false}
                                    optionFilterProp="label"
                                >
                                    {AVAILABLE_COLORS.map(color => (
                                        <Option key={color.name} value={color.name} label={color.label}>
                                            <div className="flex items-center gap-3 py-1">
                                                <div
                                                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                                    style={{ backgroundColor: color.hex }}
                                                />
                                                <span className="font-medium text-gray-600 capitalize">{color.label}</span>
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Xem trước hiển thị</p>
                                <Form.Item shouldUpdate>
                                    {() => {
                                        const name = form.getFieldValue('name') || 'Tên danh mục';
                                        const icon = form.getFieldValue('iconName') || 'Briefcase';
                                        const colorName = form.getFieldValue('color') || 'blue';
                                        const colorObj = AVAILABLE_COLORS.find(c => c.name === colorName) || AVAILABLE_COLORS[0];

                                        return (
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                                                    style={{ backgroundColor: colorObj.hex, color: '#fff' }}
                                                >
                                                    {renderLucideIcon(icon, 32, '#fff')}
                                                </div>
                                                <div>
                                                    <p className="text-xl font-black text-gray-900">{name}</p>
                                                    <p className="text-xs font-bold text-gray-400 uppercase">Trạng thái: Đang hoạt động</p>
                                                </div>
                                            </div>
                                        );
                                    }}
                                </Form.Item>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <label className="font-bold text-gray-700">Chọn biểu tượng (Lucide)</label>
                            <Input
                                prefix={<SearchOutlined className="text-gray-400" />}
                                placeholder="Tìm kiếm icon..."
                                className="h-11 rounded-xl"
                                value={iconSearchTerm}
                                onChange={(e) => setIconSearchTerm(e.target.value)}
                            />

                            <Form.Item name="iconName" hidden rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <div className="bg-slate-50 rounded-[24px] p-4 border border-slate-100 min-h-[300px]">
                                <div className="grid grid-cols-5 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredIcons.map(icon => (
                                        <div
                                            key={icon}
                                            onClick={() => {
                                                setSelectedIcon(icon);
                                                form.setFieldsValue({ iconName: icon });
                                            }}
                                            className={`aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all border-2 ${selectedIcon === icon
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105'
                                                    : 'bg-white border-white text-slate-500 hover:border-indigo-100 hover:bg-indigo-50'
                                                }`}
                                        >
                                            {renderLucideIcon(icon, 24, selectedIcon === icon ? '#fff' : undefined)}
                                        </div>
                                    ))}
                                    {filteredIcons.length === 0 && (
                                        <div className="col-span-5 py-12 text-center text-gray-400">
                                            Không tìm thấy icon nào
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>

            <style>{`
                .admin-table .ant-table-thead > tr > th {
                    background: #f8fafc;
                    font-weight: 900;
                    text-transform: uppercase;
                    font-size: 10px;
                    letter-spacing: 0.05em;
                    color: #94a3b8;
                    border-bottom: 1px solid #f1f5f9;
                }
                .admin-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #f8fafc;
                }
                .ant-select-selector {
                    border-radius: 12px !important;
                    border-color: #e2e8f0 !important;
                }
                .ant-select-focused .ant-select-selector {
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
};
export default AdminManageCategoriesSection;
