import {connect, model, Schema} from "mongoose";

export async function testConnection() {
    let connectionUris = "mongodb://root:B7CnXzE2XaJScqd@dds-8vb99c1b109c33b41.mongodb.zhangbei.rds.aliyuncs.com:3717,dds-8vb99c1b109c33b42.mongodb.zhangbei.rds.aliyuncs.com:3717/admin?replicaSet=mgset-500932596";

    await connect(connectionUris, {useNewUrlParser: true, useUnifiedTopology: true});

    let Cat = model('Cat', new Schema({name: String}));

    let kitty = new Cat({name: 'Zildjian'});
    await kitty.save();

    console.log('meow');
}
