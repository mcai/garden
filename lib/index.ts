import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import {MongoConnectionOptions} from "typeorm/driver/mongodb/MongoConnectionOptions";

export async function testConnection(option: MongoConnectionOptions) {
    let connection = await createConnection();

    let user = new User();
    user.name = "Timber";
    user.password = "Saw";

    await connection.manager.save(user);

    let users = await connection.manager.find(User);

    users.forEach(user => {
        console.log(`user, name: ${user.name}, password: ${user.password}`);
    });
}
