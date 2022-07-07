const cfg = () => {
  return {
    jwt_secret: "#V$Code%",
    jwt_expires: "2d",
    salt: 10,
    db_path:
      "mongodb+srv://samuca:Sorvete1234@cluster0.6yhgz.mongodb.net/banquinho?retryWrites=true&w=majority",
  };
};
module.exports = cfg();
