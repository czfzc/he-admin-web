import React from 'react';
import {message, Table, Input, Button, Icon} from 'antd';
import axios from "../../../common/axios";
import "../../../config"
import Highlighter from 'react-highlight-words'
import ExpressTable from "../../../components/ExpressTable";
import ProductTable from "../../../components/ProductTable";

export class Preorder extends React.Component {

    state = {
        loading: false,
        session_key : global.data.session_key,
        pagination : global.data.pagination,
        searchValue:''
    }

    constructor(props) {
        super(props)
        this.handleChange=this.handleChange.bind(this)
    }

    componentDidMount() {
        this.getData()
    }


    getData() {
        this.setState({loading: true})
        axios(global.data.host+'/admin/get_preorder', {
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
        this.setState({loading: true})
        if(this.state.searchValue!=='')
            this.searchData()
        else this.getData();
        this.setState({loading: false})
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


    searchData(){
        this.setState({loading:true})
        if(this.state.dataIndex==='id'){
            axios(global.data.host+'/admin/search_preorder_by_id', {
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
            axios(global.data.host+'/admin/search_preorder_by_user_id', {
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

    subRender=(record, index, indent, expanded)=>{
        if(record.serviceId == 1)
            return <ExpressTable listData={record.express}/>
        else if(record.serviceId == 2)
            return <ProductTable listData={record.userProduct}/>
    }


    render() {
        const columns = [{
            title: '预付单号',
            dataIndex: 'id',
            width:100,
            key: '1',
            ...this.getColumnSearchProps('id')
        },{
            title: '用户手机号',
            dataIndex: 'userId',
            width:100,
            key: '2',
            ...this.getColumnSearchProps('userId')
        }, {
            title: '预付单总价',
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
            title: '业务种类',
            dataIndex: 'abled',
            width:100,
            key: '7',
            render: (text, record) => {
                return global.data.getValueById("serviceId",record.serviceId)

            }
        }]
        return (
            <Table columns={columns}
                   dataSource={this.state.listData}
                   pagination={this.state.pagination}
                   loading={this.state.loading}
                   onChange={this.handleChange}
                   rowKey={record => record.id}
                   scroll={{ x: 700 }}
                   bordered
                   expandedRowRender={this.subRender}/>
        )
    }

}
