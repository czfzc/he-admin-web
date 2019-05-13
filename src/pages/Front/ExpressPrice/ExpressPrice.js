import React from 'react';
import {
    Table, Input, InputNumber, Popconfirm, Form, message
} from 'antd';
import axios from "../../../common/axios";
import "../../../config"

const FormItem = Form.Item;
const EditableContext = React.createContext();


export default class EditableTable extends React.Component {

    state={
        listData:[],
        editingKey:'',
        loading:false,
        session_key:global.data.session_key
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.getData()
    }

    getData(){
        this.setState({loading:true})
        axios(global.data.host+'/admin/get_express_price', {
            session_key: this.state.session_key
        }).then((res) => {
            if (res.data) {
                this.setState({
                    listData:res.data
                })
            }
        }).catch((error) => {
            message.error('网络错误')
        })
        this.setState({loading:false})
    }

    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
        console.log("取消修改")
        this.setState({editingKey: ''});
    };

    save(form, key) {
        console.log("保存修改")
    }

    edit(key) {
        console.log("开始修改")
        this.setState({editingKey: key});
    }

    render() {
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = [
            {
                title: '目的地',
                dataIndex: 'destBuildingId',
                editable: true,
                inputType:'text'
            },
            {
                title: '快递点',
                dataIndex: 'expressPointId',
                editable: true,
                inputType:'text'
            },
            {
                title: '价格',
                dataIndex: 'price',
                editable: true,
                inputType:'number'
            },{
                title: '物件大小',
                dataIndex: 'sizeId',
                editable: true,
                inputType:'text'
            },
            {
                title: '操作',
                dataIndex: 'operation',
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
                            onClick={() => this.save(form, record.key)}
                            style={{marginRight: 8}}
                        >
                            保存
                        </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                      title="确定取消?"
                      onConfirm={() => this.cancel(record.key)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
                            ) : (
                                <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>修改</a>
                            )}
                        </div>
                    );
                },
            },
        ];

        return (
            <EditableContext.Provider value={this.props.form}>
                <Table
                    components={components}
                    bordered
                    dataSource={this.state.listData}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={false}
                    loading={this.state.loading}
                />
            </EditableContext.Provider>
        );
    }
}

class EditableCell extends React.Component {
    getInp1ut = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber/>;
        }
        return <Input/>;
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
                                            message: `Please Input ${title}!`,
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
