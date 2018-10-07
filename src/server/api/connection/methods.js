import Connection from "./model";

Connection.getNameById = id =>
  Connection.findById(id).then(connection => connection.name);
