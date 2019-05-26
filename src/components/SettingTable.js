import React from 'react'
import {
    Table, Input, InputNumber, Popconfirm, Form, message, Select, Icon, Divider, Button
} from 'antd'
import axios from "../common/axios";
import "../config"

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Option = Select.Option;

class SelectList extends React.Component {

    state={
    }

    constructor(props){
        super(props)
        this.state={
            initDataPostFunction:this.props.initDataPostFunction,
            addNewDataPostFunction:this.props.addNewDataPostFunction,
            editDataPostFunction:this.props.editDataPostFunction,
            getDataByIdFunction:this.props.getDataByIdFunction,
            column:this.props.column
        }
    }

    listData(){
        const id=this.props.id
        return global.data.building.map((item)=>{
            return <Option key={item.id} value={item.id}>{item.name}</Option>
        })
    }



    render() {

        let value=global.data.getValueById(this.props.id,this.props.value)

        return (
            <Select
                defaultValue={value}
                style={{ width: 120 }}
                notFoundContent="请选择"
                onChange={this.props.onChange}
                dropdownRender={menu => (
                    <div>
                        {menu}
                    </div>
                )}
            >
                {this.listData()}
            </Select>
        )
    }

}
class EditableCell extends React.Component {

    getInput = () => {
        if (this.props.dataIndex === 'destBuildingId') {
            return <SelectList/>;
        }else if (this.props.dataIndex === 'expressPointId') {
            return <SelectList/>;
        }else if (this.props.dataIndex === 'price') {
            return <InputNumber/>;
        }else if (this.props.dataIndex === 'sizeId') {
            return <SelectList/>;
        }else if (this.props.dataIndex === 'sendMethodId') {
            return <SelectList/>;
        }else return <Input/>;
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const {getFieldDecorator} = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{margin: 0}}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: true,
                                            message: `请输入 ${title}!`,
                                        }],
                                        initialValue: record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}


class EditableTable extends React.Component {
    state = {
        editingKey: '',
        listData: [],
        pagination : global.data.pagination,
        loading: false
    }

    constructor(props) {
        super(props);
        this.handleChange=this.handleChange.bind(this)
        this.handleAdd=this.handleAdd.bind(this)
        this.columns = [
            {
                title: '目的地',
                dataIndex: 'destBuildingId',
                editable: true,
                inputType: 'text',
                key: '1',
                render:(text,record)=>{
                    return global.data.getValueById('destBuildingId',text)
                }
            },
            {
                title: '快递点',
                dataIndex: 'expressPointId',
                editable: true,
                inputType: 'text',
                key: '2',
                render:(text,record)=>{
                    return global.data.getValueById('expressPointId',text)
                }
            },
            {
                title: '价格',
                dataIndex: 'price',
                editable: true,
                inputType: 'number',
                key: '3'
            },
            {
                title: '大小',
                dataIndex: 'sizeId',
                editable: true,
                inputType: 'text',
                key: '4',
                render:(text,record)=>{
                    return global.data.getValueById('sizeId',text)
                }
            },
            {
                title: '送货方式',
                dataIndex: 'sendMethodId',
                editable: true,
                inputType: 'text',
                key: '5',
                render:(text,record)=>{
                    return global.data.getValueById('sendMethodId',text)
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: '6',
                render: (text, record) => {
                    const {editingKey} = this.state;
                    const editable = this.isEditing(record);
                    return (
                        <div>
                            {editable ? (
                                <span>
                  <EditableContext.Consumer>
                    {form => (
                        <a
                            href="javascript:;"
                            onClick={() => this.save(form, record.mainkey)}
                            style={{marginRight: 8}}
                        >
                            保存
                        </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                      title="确定取消"
                      onConfirm={() => this.cancel(record.mainkey)}
                      okText="确定" cancelText="取消"
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
                            ) : (
                                <a disabled={editingKey !== ''} onClick={() => this.edit(record.mainkey)}>修改</a>
                            )}
                        </div>
                    );
                },
            },
        ];
    }

    componentDidMount() {
        this.getData()
    }

    handleAdd(){
        let listData=this.state.listData.slice()
        console.log(listData)
        for(let i=0;i<listData.length;i++){
            if(listData[i].newAdd==true)
                return;
        }
        let key=1000;
        listData.push(    {
            mainkey: key,
            destBuildingId: "",
            expressPointId: "",
            price: "",
            sizeId: "",
            sendMethodId: "",
            newAdd:true
        })
        this.setState({
            listData:listData
        })
        this.edit(key)
    }

    getData() {
        this.setState({loading: true})
        axios(global.data.host + '/admin/get_express_price', {
            session_key: global.data.session_key,
            page: this.state.pagination.current - 1,
            size: this.state.pagination.pageSize
        }).then((res) => {
            this.setState({
                listData: res.data.content,
            })
        }).catch((error) => {
            message.error('网络错误')
        })
        this.setState({loading: false})
    }

    isEditing = record => record.mainkey === this.state.editingKey;

    cancel = () => {
        if(this.checkNew(this.state.editingKey)){
            this.setState({
                listData:this.state.listData.filter((item)=>{
                    return item.newAdd!==true
                }),
                editingKey:''
            })
        }else this.setState({editingKey: ''});
    }

    checkNew=(key)=>{
        for(let i=0;i<this.state.listData.length;i++)
            if(this.state.listData[i].mainkey===key&&this.state.listData[i].newAdd===true)
                return true
        return false
    }

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            if(this.checkNew(key)){
                axios(global.data.host + '/admin/add_express_price', {
                    session_key: global.data.session_key,
                    dest_building_id: row.destBuildingId,
                    size_id: row.sizeId,
                    express_point_id: row.expressPointId,
                    price: row.price,
                    send_method_id: row.sendMethodId
                }).then((res) => {
                    if (res.data.status) {
                        this.getData()
                        this.setState({editingKey: ''});
                    } else return;
                }).catch((error) => {
                    message.error('网络错误')
                    return;
                })
            }else {
                axios(global.data.host + '/admin/edit_express_price', {
                    session_key: global.data.session_key,
                    mainkey: key,
                    dest_building_id: row.destBuildingId,
                    size_id: row.sizeId,
                    express_point_id: row.expressPointId,
                    price: row.price,
                    send_method_id: row.sendMethodId
                }).then((res) => {
                    if (res.data.status) {
                        this.getData()
                        this.setState({editingKey: ''});
                    } else return;
                }).catch((error) => {
                    message.error('网络错误')
                    return;
                })
            }
        });

    }

    edit(key) {
        console.log(key)
        this.setState({editingKey: key});
    }


    handleChange=(pagination, filters, sorter) => {
        this.state.pagination=pagination;
        this.cancel()
        this.getData();
    }

    render() {
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.inputType,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        return (
            <EditableContext.Provider value={this.props.form}>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    添加计费方式
                </Button>
                <Table
                    components={components}
                    bordered
                    dataSource={this.state.listData}
                    columns={columns}
                    rowClassName="editable-row"
                    onChange={this.handleChange}
                    pagination={this.state.pagination}
                    rowKey={record => record.mainkey}
                />
            </EditableContext.Provider>
        );
    }
}

export const ExpressPrice = Form.create()(EditableTable);
