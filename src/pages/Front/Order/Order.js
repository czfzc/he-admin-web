import React from 'react';
import {message, Table, Popconfirm, Input, Button, Icon} from 'antd';
import Highlighter from 'react-highlight-words';
import axios from "../../../common/axios";
import "../../../config"
import PreorderTable from "../../../components/PreorderTable"

export class Order extends React.Component {

    state = {
        loading: false,
        searchValue: '',
        dataIndex: '',
        session_key : global.data.session_key,
        pagination : global.data.pagination
    }

    constructor(props) {
        super(props)

        this.handleChange=this.handleChange.bind(this)
        this.refund=this.refund.bind(this)
        this.disable=this.disable.bind(this)
        this.enable=this.enable.bind(this)

    }

    componentDidMount() {
        this.getData()
    }


    getData() {
        this.setState({loading: true})
        axios(global.data.host+'/admin/get_order', {
            session_key: this.state.session_key,
            page: this.state.pagination.current - 1,
            size: this.state.pagination.pageSize
        }).then((res) => {
            if (res.data.status !== false) {
                this.setState({
                    listData: res.data.content,
                    pagination: {
                        total: res.data.totalElements,
                        current:this.state.pagination.current,
                        pageSize:this.state.pagination.pageSize
                    }
                })
            } else {
                message.error('加载失败')
            }
        }).catch((error) => {
            message.error('网络错误')
        })
        this.setState({loading: false})
    }

    handleChange=(pagination, filters, sorter) => {
        this.state.pagination=pagination;
        if(this.state.searchValue!=='')
            this.searchData()
        else this.getData();
    }

    refund(orderId){
        axios(global.data.host+'/admin/refund_order', {
            session_key: this.state.session_key,
            order_id:orderId
        }).then((res) => {
            if (res.data.status) {
                message.success('成功')
                this.getData()
            } else {
                message.error('失败')
            }
        }).catch((error) => {
            message.error('网络错误')
        })
    }

    disable(orderId){
        axios(global.data.host+'/admin/set_order_to_disabled', {
            session_key: this.state.session_key,
            order_id:orderId
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

    enable(orderId){
        axios(global.data.host+'/admin/set_order_to_abled', {
            session_key: this.state.session_key,
            order_id:orderId
        }).then((res) => {
            if (res.data.status) {
                message.success('成功')
                this.getData()
            } else {
                message.error('失败')
            }
        }).catch((error) => {
            message.error('网络错误')
        })
    }

    searchData(){
        this.setState({loading:true})
        if(this.state.dataIndex==='orderId'){
            axios(global.data.host+'/admin/search_order_by_order_id', {
                session_key: this.state.session_key,
                value:this.state.searchValue,
                page: this.state.pagination.current - 1,
                size: this.state.pagination.pageSize
            }).then((res) => {
                this.setState({
                    listData:res.data.content,
                    pagination: {
                        total: res.data.totalElements,
                        current:this.state.pagination.current,
                        pageSize:this.state.pagination.pageSize
                    }
                })
            }).catch((error) => {
                message.error('网络错误')
            })
        }else if(this.state.dataIndex==='userId'){
            axios(global.data.host+'/admin/search_order_by_user_id', {
                session_key: this.state.session_key,
                value:this.state.searchValue,
                page: this.state.pagination.current - 1,
                size: this.state.pagination.pageSize
            }).then((res) => {
                this.setState({
                    listData:res.data.content,
                    pagination: {
                        total: res.data.totalElements,
                        current:this.state.pagination.current,
                        pageSize:this.state.pagination.pageSize
                    }
                })
            }).catch((error) => {
                message.error('网络错误')
            })
        }
        this.setState({loading:false})
    }


    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
                             setSelectedKeys, selectedKeys, confirm, clearFilters,
                         }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => { this.searchInput = node; }}
                    placeholder={`搜索 ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys,dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys,dataIndex)}
                    icon="搜索"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    搜索
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    重置
                </Button>
            </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[dataIndex===this.state.dataIndex?this.state.searchValue:'']}
                style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    })



    handleSearch = (selectedKeys,dataIndex) => {
        this.state.searchValue=selectedKeys[0]
        this.state.dataIndex=dataIndex
        this.searchData();
        this.setState({
            searchValue: selectedKeys[0],
            dataIndex:dataIndex,
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

    preorderRender = (record, index, indent, expanded) => {
        return <PreorderTable listData={record.preorder}/>
    }

    render() {

        const columns = [{
            title: '订单号',
            dataIndex: 'orderId',
            width:100,
            key: '1',
            ...this.getColumnSearchProps('orderId')
        },{
            title: '用户手机号',
            dataIndex: 'userId',
            width:100,
            key: '2',
            ...this.getColumnSearchProps('userId')
        }, {
            title: '总价',
            dataIndex: 'totalFee',
            width:100,
            key: '3'
        }, {
            title: '下单时间',
            dataIndex: 'time',
            width:100,
            key: '4'
        }, {
            title: '付款情况',
            dataIndex: 'payed',
            width:100,
            key: '5',
            render: (text, record) => {
                if (record.payed === 0)
                    return '未付款'
                if (record.payed === 1)
                    return '已付款'
                if (record.payed === 2)
                    return '已退款'
                if (record.payed === 3)
                    return '已申请退款'
                if (record.payed === 3)
                    return '已被拒绝退款'
            }
        }, {
            title: '状态',
            dataIndex: 'abled',
            width:100,
            key: '6',
            render: (text, record) => {
                return record.abled ? '正常' : '被冻结'
            }
        },{
            title: '操作',
            dataIndex: '',
            width:100,
            key: '7',
            render: (text, record) => {
                return (
                    <div>
                        {record.payed===1?<Popconfirm title="确定退款？"
                                    onConfirm={this.refund.bind(this,record.orderId)} okText="Yes" cancelText="No">
                            <a>退款</a>/
                        </Popconfirm>:null}
                        {record.abled?
                            <Popconfirm title="确定冻结?"
                                        onConfirm={this.disable.bind(this,record.orderId)} okText="Yes" cancelText="No">
                            <a>冻结</a></Popconfirm>:
                            <Popconfirm title="确定解冻?"
                                        onConfirm={this.enable.bind(this,record.orderId)} okText="Yes" cancelText="No">
                            <a>解冻</a></Popconfirm>
                        }

                    </div>
                )
            }
        }]
        return (
            <Table columns={columns}
                   dataSource={this.state.listData}
                   pagination={this.state.pagination}
                   loading={this.state.loading}
                   onChange={this.handleChange}
                   rowKey={record => record.orderId}
                   scroll={{ x: 700 }}
                   bordered
                   expandedRowRender={this.preorderRender}/>
        )
    }

}
