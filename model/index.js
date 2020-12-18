module.exports = function createData(msg,status,data){
    let defaultData = {msg:'',status:'0',data:null}
    return {
            ...defaultData,
            msg,
            status,
            data,
        }
    
}