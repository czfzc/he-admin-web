import React from 'react';
import {message, Table, Popconfirm, Input, Button, Icon, Menu} from 'antd';
import axios from "../../../common/axios";
import "../../../config"
import Highlighter from 'react-highlight-words'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


export class Express extends React.Component {

    state = {
        loading: false,
        dataIndex: '',
        searchValue: '',
        listData: [],
        ExpressPointNavCurrent: 'all',
        session_key: global.data.session_key,
        pagination: global.data.pagination,
        expressPoint: global.data.expressPoint,
        expressSize: global.data.expressSize
    }

    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.withdraw = this.withdraw.bind(this)
        this.sended = this.sended.bind(this)

    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        this.setState({loading: true})

        if (this.state.ExpressPointNavCurrent === 'all') {
            //获取快递
            axios(global.data.host + '/admin/get_express', {
                session_key: this.state.session_key,
                page: this.state.pagination.current - 1,
                size: this.state.pagination.pageSize
            }).then((res) => {
                if (res.data.status !== false) {
                    this.setState({
                        listData: res.data.content,
                        pagination: {
                            total: res.data.totalElements,
                            current: this.state.pagination.current,
                            pageSize: this.state.pagination.pageSize
                        }
                    })
                } else {
                    message.error('加载失败')
                }
            }).catch((error) => {
                message.error('网络错误')
            })


        } else {
            //获取快递
            axios(global.data.host + '/admin/get_express_by_point', {
                session_key: this.state.session_key,
                page: this.state.pagination.current - 1,
                size: this.state.pagination.pageSize,
                express_point_id: this.state.ExpressPointNavCurrent
            }).then((res) => {
                if (res.data.status !== false) {
                    this.setState({
                        listData: res.data.content,
                        pagination: {
                            total: res.data.totalElements,
                            current: this.state.pagination.current,
                            pageSize: this.state.pagination.pageSize
                        }
                    })
                } else {
                    message.error('加载失败')
                }
            }).catch((error) => {
                message.error('网络错误')
            })
        }

        this.setState({loading: false})

    }

    getExpressPointNameByExpressPointId(expressPointId) {
        let point = this.state.expressPoint;
        for (let i = 0; i < point.length; i++) {
            if (point[i].expressPointId === expressPointId)
                return point[i].name;
        }
        return '未知'
    }

    getExpressSizeNameBySizeId(sizeId) {
        let size = this.state.expressSize;
        for (let i = 0; i < size.length; i++) {
            if (size[i].sizeId === sizeId)
                return size[i].sizeName;
        }
        return '未知'
    }

    handleChange = (pagination, filters, sorter) => {
        this.state.pagination = pagination;
        this.setState({loading: true})
        if (this.state.searchValue !== '')
            this.searchData()
        else this.getData()
        this.setState({loading: false})
    }

    withdraw(id) {
        axios(global.data.host + '/admin/set_status_to_withdraw', {
            session_key: this.state.session_key,
            express_id: id
        }).then((res) => {
            if (res.data.status) {
                message.success('成功')
                this.getData()
            } else {
                message.error('失败')
            }
            console.log(this.state.pagination)
        }).catch((error) => {
            message.error('网络错误')
        })
    }

    sended(id) {
        axios(global.data.host + '/admin/set_status_to_sended', {
            session_key: this.state.session_key,
            express_id: id
        }).then((res) => {
            if (res.data.status) {
                message.success('成功')
                this.getData()
            } else {
                message.error('失败')
            }
            console.log(this.state.pagination)
        }).catch((error) => {
            message.error('网络错误')
        })
    }

    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
                             setSelectedKeys, selectedKeys, confirm, clearFilters,
                         }) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`搜索 ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, dataIndex)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, dataIndex)}
                    icon="搜索"
                    size="small"
                    style={{width: 90, marginRight: 8}}
                >
                    搜索
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size="small"
                    style={{width: 90}}
                >
                    重置
                </Button>
            </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}}/>,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            <Highlighter
                style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                searchWords={[dataIndex === this.state.dataIndex ? this.state.searchValue : '']}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    })

    searchData() {
        this.setState({loading: true})
        if (this.state.dataIndex === 'expressId') {
            axios(global.data.host + '/admin/search_express_by_express_id', {
                session_key: this.state.session_key,
                value: this.state.searchValue,
                page: this.state.pagination.current - 1,
                size: this.state.pagination.pageSize
            }).then((res) => {
                this.setState({
                    listData: res.data.content,
                    pagination: {
                        total: res.data.totalElements,
                        current: this.state.pagination.current,
                        pageSize: this.state.pagination.pageSize
                    }
                })
            }).catch((error) => {
                message.error('网络错误')
            })
        } else if (this.state.dataIndex === 'userId') {
            axios(global.data.host + '/admin/search_express_by_user_id', {
                session_key: this.state.session_key,
                value: this.state.searchValue,
                page: this.state.pagination.current - 1,
                size: this.state.pagination.pageSize
            }).then((res) => {
                this.setState({
                    listData: res.data.content,
                    pagination: {
                        total: res.data.totalElements,
                        current: this.state.pagination.current,
                        pageSize: this.state.pagination.pageSize
                    }
                })
            }).catch((error) => {
                message.error('网络错误')
            })
        }
        this.setState({loading: false})
    }

    handleSearch = (selectedKeys, dataIndex) => {
        this.state.searchValue = selectedKeys[0]
        this.state.dataIndex = dataIndex
        this.searchData();
        this.setState({
            searchValue: selectedKeys[0],
            dataIndex: dataIndex,
        });
    }

    handleReset = (clearFilters) => {
        clearFilters();
        this.getData()
        this.setState({
            searchValue: '',
            dataIndex: ''
        });
    }

    handleExpressPointNavClick = (e) => {
        if (e.key !== this.state.ExpressPointNavCurrent) {
            this.state.ExpressPointNavCurrent = e.key;
            this.state.pagination.current = 1;
            this.getData()
            //重新渲染页数为1
            this.setState({
                pagination: {
                    total: this.state.pagination.total,
                    current: this.state.pagination.current,
                    pageSize: this.state.pagination.pageSize
                }
            })
        }
    }

    rendExpressPointNav() {
        return (
            <Menu
                onClick={this.handleExpressPointNavClick}
                selectedKeys={[this.state.ExpressPointNavCurrent]}
                mode="horizontal"
            >
                <Menu.Item key="all">
                    <Icon type="mail"/>所有
                </Menu.Item>
                {
                    this.state.expressPoint.map((item, index) => {
                        return <Menu.Item key={item.expressPointId}>
                            <Icon type="mail"/>{item.name}
                        </Menu.Item>
                    })
                }
            </Menu>
        )
    }

    getAction = (record) => {
        if (record.status === 0)
            return (
                <Popconfirm title="确定取到货了?"
                            onConfirm={this.withdraw.bind(this, record.express_id)} okText="确定" cancelText="取消">
                    <a>设置已取货</a></Popconfirm>
            )
        else if (record.status === 1)
            return (
                <Popconfirm title="确定送到手了?"
                            onConfirm={this.sended.bind(this, record.express_id)} okText="确定" cancelText="取消">
                    <a>设置已送达</a></Popconfirm>
            )
    }

    render() {
        const columns = [{
            title: '快递代取号',
            dataIndex: 'express_id',
            width:100,
            key: '1',
            ...this.getColumnSearchProps('expressId')
        }, {
            title: '用户手机号',
            dataIndex: 'user_id',
            width:100,
            key: '2',
            ...this.getColumnSearchProps('userId')
        }, {
            title: '快递姓名',
            dataIndex: 'name',
            width:100,
            key: '3'
        }, {
            title: '快递手机号',
            dataIndex: 'phone_num',
            width:100,
            key: '4'
        }, {
            title: '目的地址',
            dataIndex: 'address',
            width:100,
            key: '5',
        },{
            title: '快递点',
            dataIndex: 'express_point',
            width:100,
            key: '6',
        }, {
            title: '快递大小',
            dataIndex: 'size_name',
            width:100,
            key: '7',
        }, {
            title: '送货方式',
            dataIndex: 'send_method',
            width:100,
            key: '8',
        },{
            title: '单价',
            dataIndex: 'total_fee',
            width:100,
            key: '9'
        }, {
            title: '短信内容',
            dataIndex: 'sms_content',
            width:100,
            key: '10'
        }, {
            title: '收货码',
            dataIndex: 'receive_code',
            width:100,
            key: '11'
        }, {
            title: '送达情况',
            dataIndex: 'status',
            width:100,
            key: '12',
            render: (text, record) => {
                if (record.status === 0)
                    return '未领取'
                else if (record.status === 1)
                    return '已领取'
                else if (record.status === 2)
                    return '已送达'
                else return '未知'
            }
        }, {
            title: '下单时间',
            dataIndex: 'time',
            width:100,
            key: '13'
        }, {
            title: '状态',
            dataIndex: 'abled',
            width:100,
            key: '14',
            render: (text, record) => {
                return record.abled ? '正常' : '被冻结'
            }
        }, {
            title: '操作',
            dataIndex: '',
            width:100,
            key: '15',
            render: (text, record) => {
                return (
                    <div>
                        {this.getAction(record)}
                    </div>
                )
            }
        }]

        return (
            <div>
                {
                    this.rendExpressPointNav()
                }
                <Table columns={columns}
                       dataSource={this.state.listData}
                       pagination={this.state.pagination}
                       loading={this.state.loading}
                       onChange={this.handleChange}
                       bordered
                       size="middle"
                       scroll={{ x: 1400 }}
                       rowKey={record => record.express_id}/>
            </div>
        )
    }


}
