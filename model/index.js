class Model {
    constructor(data, msg) {
        if (typeof data == 'string') {
            this.msg = data;
            data = null;
            msg = null;

        }
        if (data) {
            this.data = data
        }
        if (msg) {
            this.msg = msg;
        }
    }
}

class SucessModel extends Model {
    constructor(data, msg) {
        super(data, msg);
        this.code = 0
    }
}

class ErrorModel extends Model {
    constructor(data, msg) {
        super(data, msg = '接口异常');
        this.code = -1
    }
}

class customizeModel extends Model {
    constructor(data, msg, code) {
        super(data, msg);
        this.code = code
    }
}
module.exports = {
    SucessModel,
    ErrorModel,
    customizeModel
}