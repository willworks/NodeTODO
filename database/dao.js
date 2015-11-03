var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbconf = require('./dbconf');

var dburl = dbconf.db;

// 调通测试
// exports.dburl = dbconf.db;

// 连接数据库
exports.connect = function(callback) {
    mongoose.connect(dburl);
};

// 断开数据库
exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
};

// 定义对象模型，可以对应为关系型数据库的表项
var TodoScheme = new Schema({
    title:String,
    finished:{type:Boolean,default:false},
    post_date:{type:Date,default:Date.now}
});

// 访问对象模型
mongoose.model('Todo', TodoScheme);
var Todo = mongoose.model('Todo');

// 添加
exports.add = function(title,callback) {
    var newTodo = new Todo();
    newTodo.title = title;
    newTodo.save(function(err){
        if(err){
            util.log("FATAL"+err);
            callback(err);
        }else{
            callback(null);
        }
    });

};

// 删除
exports.delete = function(id, callback) {
    exports.findTodoById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            util.log(util.inspect(doc));
            doc.remove();
            callback(null);
        }
    });
};

// 修改
exports.editTitle = function(id, title, callback) {
    exports.findTodoById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            doc.post_date = new Date();
            doc.title = title;
            doc.save(function(err) {
                if (err) {
                    util.log('FATAL '+ err);
                    callback(err);
                } else
                    callback(null);
            });
        }
    });
};

// 结束修改
exports.editFinished = function(id, finished, callback) {
    exports.findTodoById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            doc.post_date = new Date();
            doc.finished = finished;
            doc.save(function(err) {
                if (err) {
                    util.log('FATAL '+ err);
                    callback(err);
                } else
                    callback(null);
            });
        }
    });
};

// 获取所有表项
exports.allTodos = function(callback) {
    Todo.find({}, callback);
};

exports.forAll = function(doEach, done) {
    Todo.find({}, function(err, docs) {
        if (err) {
            util.log('FATAL '+ err);
            done(err, null);
        }
        docs.forEach(function(doc) {
            doEach(null, doc);
        });
        done(null);
    });
};

// 查询定位具体内容
var findTodoById = exports.findTodoById = function(id,callback){
    Todo.findOne({_id:id},function(err,doc){
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
};


