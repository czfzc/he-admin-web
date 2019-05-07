import React from 'react';
import {message, Table, Popconfirm, Input, Button, Icon} from 'antd';
import axios from "../../../common/axios";
import "../../../config"
import Highlighter from 'react-highlight-words'

export default class Express extends React.Component {

    state = {
        loading: false,
        dataIndex:'',
        searchValue:''
    }

    constructor(props) {
        super(props)

        this.state.session_key = props.session_key;
        this.state.pagination = props.pagination;

        this.handleChange=this.handleChange.bind(this)
        this.withdraw=this.withdraw.bind(this)
        this.sended=this.sended.bind(this)

        this.getData()

    }

    getData() {
        this.setState({loading: true})
        axios(global.data.host+'/admin/get_express', {
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
        if(this.state.searchValue!='')
            this.searchData()
        else this.getData();
        this.setState({loading: false})
    }

    withdraw(id){
        axios(global.data.host+'/admin/set_status_to_withdraw', {
            session_key: this.state.session_key,
            express_id:id
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

    sended(id){
        axios(global.data.host+'/admin/set_status_to_sended', {
            session_key: this.state.session_key,
            express_id:id
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
                searchWords={[dataIndex==this.state.dataIndex?this.state.searchValue:'']}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    })


    searchData(){
        this.setState({loading:true})
        if(this.state.dataIndex=='expressId'){
            axios(global.data.host+'/admin/search_express_by_express_id', {
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
        }else if(this.state.dataIndex=='userId'){
            axios(global.data.host+'/admin/search_express_by_user_id', {
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


    render() {
        const columns = [{
            title: '快递代取号',
            dataIndex: 'expressId',
            key: '1',
            ...this.getColumnSearchProps('expressId')
        },{
            title: '用户手机号',
            dataIndex: 'userId',
            key: '2',
            ...this.getColumnSearchProps('userId')
        }, {
            title: '快递姓名',
            dataIndex: 'name',
            key: '3'
        }, {
            title: '快递手机号',
            dataIndex: 'time',
            key: '4'
        }, {
            title: '单价',
            dataIndex: 'totalFee',
            key: '5'
        },{
            title: '短信内容',
            dataIndex: 'smsContent',
            key: '6'
        },{
            title:'收货码',
            dataIndex:'receiveCode',
            key: '7'
        },{
            title: '送达情况',
            dataIndex: 'status',
            key: '8',
            render:(text,record)=>{
                if(record.status==0)
                    return '未领取'
                else if(record.status==1)
                    return '已领取'
                else if(record.status==2)
                    return '已送达'
                else return '未知'
            }
        },{
            title:'下单时间',
            dataIndex:'time',
            key: '9'
        },{
            title: '状态',
            dataIndex: 'abled',
            key: '10',
            render: (text, record) => {
                return record.abled ? '正常' : '被冻结'
            }
        },{
            title:'操作',
            dataIndex: '',
            key:'11',
            render: (text,record)=>{
                return (
                    <div>
                        {this.getAction(record)}
                    </div>
                )
            }
        }]
        return (
            <Table columns={columns}
                   dataSource={this.state.listData}
                   pagination={this.state.pagination}
                   loading={this.state.loading}
                   onChange={this.handleChange}/>
        )
    }

    getAction = (record)=>{
        if(record.status===0)
            return (
                <Popconfirm title="确定取到货了?"
                            onConfirm={this.withdraw.bind(this,record.expressId)} okText="Yes" cancelText="No">
                    <a>设置已取货</a></Popconfirm>
            )
        else if(record.status===1)
            return (
                <Popconfirm title="确定送到手了?"
                            onConfirm={this.sended.bind(this,record.expressId)} okText="Yes" cancelText="No">
                    <a>设置已送达</a></Popconfirm>
            )
    }

}
