global.data = {
    host:'http://127.0.0.1:8081',
    session_key:'',
    expressPoint:[],
    expressSize:[],
    building:[],
    expressSendMethod:[],
    productSendMethod:[],
    service:[],
    pagination:{
        current:1,
        pageSize:10
    },
    getValueById:(dataIndex,id)=>{

        if(dataIndex==='destBuildingId'){
            for(let i=0;i<global.data.building.length;i++){
                if(global.data.building[i].id===id)
                    return global.data.building[i].name
            }
        }else if(dataIndex==='expressPointId'){
            for(let i=0;i<global.data.expressPoint.length;i++){
                if(global.data.expressPoint[i].expressPointId===id)
                    return global.data.expressPoint[i].name
            }
        }else if(dataIndex==='sizeId'){
            for(let i=0;i<global.data.expressSize.length;i++){
                if(global.data.expressSize[i].sizeId===id)
                    return global.data.expressSize[i].sizeName
            }
        }else if(dataIndex==='sendMethodId'){
            for(let i=0;i<global.data.expressSendMethod.length;i++){
                if(global.data.expressSendMethod[i].id===id)
                    return global.data.expressSendMethod[i].value
            }
        }else if(dataIndex==='serviceId'){
            for(let i=0;i<global.data.service.length;i++){
                if(global.data.service[i].id===parseInt(id))
                    return global.data.service[i].name
            }
        }else if(dataIndex==='sendMethodIdProduct'){
            for(let i=0;i<global.data.productSendMethod.length;i++){
                if(global.data.productSendMethod[i].id===id)
                    return global.data.productSendMethod[i].value
            }
        }else if(dataIndex==='abled'){
            return id?'可用':'不可用'
        }
    }
    ,deepClone(obj) {
        var copy

        // 处理3种基础类型，和null、undefined
        if (obj === null || typeof obj !== 'object') return obj

        // 处理日期
        if (obj instanceof Date) {
            copy = new Date()
            copy.setTime(obj.getTime())
            return copy
        }

        // 处理数组
        if (Array instanceof Array) {
            copy = []
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.deepClone(obj[i])
            }
            return copy
        }

        // 处理对象
        if (obj instanceof Object) {
            copy = {}
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.deepClone(obj[attr])
            }
            return copy
        }

        throw new Error("Unable to copy obj as type isn't suported" + obj.constructor.name)
    }
};
