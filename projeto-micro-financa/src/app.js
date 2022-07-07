const PROTO_PATH = "./info-financa.proto";
const grpc = require("@grpc/grpc-js");
const carregarProto = require("@grpc/proto-loader");
var grpcLogger = require('grpc-logger')
global.Mongoose = require("mongoose");
Mongoose.connect("mongodb+srv://samuca:Sorvete1234@cluster0.6yhgz.mongodb.net/banquinho?retryWrites=true&w=majority");
const FinanceiraModel = require("./models/financa");
const definicao = carregarProto.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const Proto = grpc.loadPackageDefinition(definicao);
const server = new grpc.Server();

server.addService(Proto.Gerenciar.service, {
  get: (_, callback) => {
    FinanceiraModel.find((erro, InfoFinanceiras) => {
      if (erro){
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          details: "parameters invalid",
        });
      }

      callback(null, {InfoFinanceiras});

    });
  },
  getByIdCliente: (call, callback) => {
    FinanceiraModel.find({ id_cliente: call.request.id_cliente }, (erro, InfoFinanceiras) => {
      if (erro){
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          details: "parameters invalid",
        });
      }
      
      callback(null, {InfoFinanceiras});
    });
  },
  insert: (call, callback) => {
    console.log(call.request);
    let info = {
      nome_banco: call.request.nome_banco,
      tipo_conta: call.request.tipo_conta,
      nome_titular: call.request.nome_titular,
      limite_cartao: call.request.limite_cartao,
      id_cliente: call.request.id_cliente,
    };

    if (call.request.id_cliente != undefined) {
      new FinanceiraModel(info).save(function(err, InfoFinanceiras) {
        if (err) {
          callback({
            code: grpc.status.INVALID_ARGUMENT,
            details: "id_cliente nao informado",
          });          
        }
        callback(null, InfoFinanceiras);
      });
    } else {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "id_cliente nao informado",
      });
    }
  },
  update: (call, callback) => {
    FinanceiraModel.findByIdAndUpdate(call.request._id, call.request, { new: true }, (erro, InfoFinanceiras) => {
      if (erro){
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          details: `nao foi possivel atualizar -> ${erro}`,
        });
      }
      
      callback(null, InfoFinanceiras);
    });
  },
  delete: (call, callback) => {
    FinanceiraModel.findByIdAndDelete(call.request._id, (erro, InfoFinanceiras) => {
      if (erro){
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          details: `nao foi possivel apagar -> ${erro}`,
        });
      }

      callback(null, {});
    });
  },
});

server.bindAsync("127.0.0.1:30043", grpc.ServerCredentials.createInsecure(), () => server.start());
console.log("Server running at http://127.0.0.1:30043");
grpcLogger(server);
