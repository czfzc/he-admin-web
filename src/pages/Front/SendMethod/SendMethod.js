import React from 'react'
import {
    Table, Input, InputNumber, Popconfirm, Form, message, Select, Icon, Divider, Button
} from 'antd'
import axios from "../../../common/axios";
import "../../../config"

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Option = Select.Option;

class SelectList extends React.Component {

    constructor(props){
        super(props)
    }

    listData(){
        const id=this.props.id
        if(id==='serviceId'){
            return global.data.service.map((item)=>{
                return <Option key={item.id} value={item.id}>{item.name}</Option>
            })
        }else if(id==="abled"){
            let able=[
                {
                    key:1,
                    value:1,
                    content:'可用'
                },
                {
                    key:0,
                    value:0,
                    content:'不可用'
                }
            ]
            return able.map((item)=>{
                return <Option key={item.key} value={item.value}>{item.content}</Option>
            })

        }
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
        if (this.props.dataIndex === 'value') {
            return <Input/>;
        }else if (this.props.dataIndex === 'serviceId') {
            return <SelectList/>;
        }else if (this.props.dataIndex === 'abled') {
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
        editingKey: 0,
        listData: [],
        loading: false
    }

    constructor(props) {
        super(props);
        this.handleAdd=this.handleAdd.bind(this)
        this.columns = [
            {
                title: '值',
                dataIndex: 'value',
                editable: true,
                inputType: 'text',
                key: '1'
            },
            {
                title: '服务',
                dataIndex: 'serviceId',
                editable: true,
                inputType: 'number',
                key: '2',
                render:(text,record)=>{
                    return global.data.getValueById('serviceId',parseInt(text))
                }
            },
            {
                title: '是否可用',
                dataIndex: 'abled',
                editable: true,
                inputType: 'text',
                key: '3',
                render:(text,record)=>{
                    return text?'可用':'不可用'
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: '4',
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
                                <a disabled={editingKey !== 0} onClick={() => this.edit(record.id)}>修改</a>
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
            id:1000,
            value:'',
            serviceId:'',
            newAdd:true
        })
        this.setState({
            listData:listData
        })
        this.edit(key)
    }

    getData() {
        this.setState({loading: true})
        axios(global.data.host + '/admin/get_send_method', {
            session_key: global.data.session_key,
        }).then((res) => {
            this.setState({
                listData: res.data,
            })
        }).catch((error) => {
            message.error('网络错误')
        })
        this.setState({loading: false})
    }

    isEditing = record =>  parseInt(record.id) === this.state.editingKey;

    cancel = () => {
        if(this.checkNew(this.state.editingKey)){
            this.setState({
                listData:this.state.listData.filter((item)=>{
                    return item.newAdd!==true
                }),
                editingKey:0
            })
        }else this.setState({editingKey: 0});
    }

    checkNew=(key)=>{
        for(let i=0;i<this.state.listData.length;i++)
            if(this.state.listData[i].id===key&&this.state.listData[i].newAdd===true)
                return true
        return false
    }

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            if(this.checkNew(this.state.editingKey)){
                axios(global.data.host + '/admin/add_send_method', {
                    session_key: global.data.session_key,
                    service_id: row.serviceId,
                    value: row.value,
                    abled: row.abled?  true:false
                }).then((res) => {
                    if (res.data.status) {
                        this.getData()
                        this.setState({editingKey:0});
                    } else return;
                }).catch((error) => {
                    message.error('网络错误')
                    return;
                })
            }else {
                axios(global.data.host + '/admin/edit_send_method', {
                    session_key: global.data.session_key,
                    id: this.state.editingKey,
                    service_id: row.serviceId,
                    value: row.value,
                    abled: row.abled?  true:false
                }).then((res) => {
                    if (res.data.status) {
                        this.getData()
                        this.setState({editingKey:0});
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
        this.setState({editingKey: parseInt(key)});
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
                    添加送货方式
                </Button>
                <Table
                    components={components}
                    bordered
                    dataSource={this.state.listData}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={false}
                    rowKey={record => record.id}
                />
            </EditableContext.Provider>
        );
    }
}

export const SendMethod = Form.create()(EditableTable);
