const PROTO_PATH = "./produto.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const Gerenciar = grpc.loadPackageDefinition(packageDefinition).Gerenciar;
const client = new Gerenciar(
    "localhost:30043",
    grpc.credentials.createInsecure()
);

module.exports = client;