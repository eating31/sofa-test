import { Space, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

let searchedColumn = ''
let searchText = ''

// 列表搜尋
export const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
            <Input
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    搜尋
                </Button>
                <Button onClick={() => handleReset(selectedKeys, confirm, clearFilters)} size="small" style={{ width: 90 }}>
                    重置
                </Button>
            </Space>
        </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
});

const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    searchText = selectedKeys[0];
    searchedColumn = dataIndex;
};

const handleReset = (selectedKeys, confirm, clearFilters) => {
    clearFilters();
    searchText = '';
    // 清除後會自動搜尋更新
    handleSearch(selectedKeys, confirm, searchText)
};