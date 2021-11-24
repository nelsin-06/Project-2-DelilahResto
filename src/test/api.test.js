const chai = require('chai');
const chaiHttp = require('chai-http');
const jsonwebtoken = require('jsonwebtoken');

const usuarioModelo = require('../models/usuario.model');
const app = require('../index');

chai.should();
chai.use(chaiHttp);

describe('REGISTRO DE USUARIO', () => {
    /**
     * CREACION DE USUARIO DE PRUEBA PARA VALIDACION DE DUPLICACION DE CORREOS
     */
    before(async () => {
        const usuarioDuplicado = {
            email: "correoduplicado@test.com",
            username: "test test test",
            password: "secreto123",
            confirm_password: "secreto123",
            telefono: "3139991234",
            direccion: [{ "direccion": "direccion de test" }]
        }
        chai.request(app)
            .post('/usuarios/registrar')
            .send(usuarioDuplicado)
            .end();
    });

    after(async () => {
        await usuarioModelo.deleteOne({ email: 'correoduplicado@test.com' });
    });

    after(async () => {
        await usuarioModelo.deleteOne({ email: 'correoreal@test.com' });
    });

    describe('POST /usuarios/registrar', () => {

        describe('Req a la API sin errores', () => {

            it('debe devolver un 201 en status', (done) => {
                const usuario = {
                    email: "correoreal@test.com",
                    username: "test Gallego",
                    password: "secreto1",
                    confirm_password: "secreto1",
                    telefono: "3139999991",
                    direccion: [{ direccion: "direccion prueba" }]
                }
                chai.request(app)
                    .post('/usuarios/registrar')
                    .send(usuario)
                    .end((err, response) => {
                        response.should.have.status(201);
                        response.should.be.a('object');
                        done();
                    });
            });
        });

        describe('Req a la API con errores', () => {

            describe('Errores correo electronico', () => {

                it('debe devolver un status 400 ya que el correo electronico tiene una sintaxis incorrecta', (done) => {
                    const usuario = {
                        email: "correotest@asd.sdf",
                        username: "test Gallego",
                        password: "secreto1",
                        confirm_password: "secreto1",
                        telefono: "3139999991",
                        direccion: [{ "direccion": "direccion prueba" }]
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.should.be.a('object');
                            done();
                        });
                });

                it('debe devolver un status 400 ya que el correo electronico ya se encuentra registrado en la base de datos', (done) => {
                    const usuario = {
                        email: "correoduplicado@test.com",
                        username: "test test test",
                        password: "secreto123",
                        confirm_password: "secreto123",
                        telefono: "3139991234",
                        direccion: [{ "direccion": "direccion de test" }]
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            done();
                        });
                });
            });

            describe('Errores numero de telefono', () => {
                it('debe devolver un status 400 ya que el telefono no tiene la longitud minima de caracteres que debe tener un numero de telefono', (done) => {
                    const usuario = {
                        email: "correotest@test.com",
                        username: "test Gallego",
                        password: "secreto1",
                        confirm_password: "secreto1",
                        telefono: "3139923",
                        direccion: [{ "direccion": "direccion prueba" }]
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.should.be.a('object');
                            done();
                        });
                });

                it('debe devolver un status 400 ya que el telefono sobrepasa la longitud maxima que deberia tener un numero de telefono', (done) => {
                    const usuario = {
                        email: "correotest@test.com",
                        username: "test Gallego",
                        password: "secreto1",
                        confirm_password: "secreto1",
                        telefono: "313992312349",
                        direccion: [{ "direccion": "direccion prueba" }]
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.should.be.a('object');
                            done();
                        });
                });

                it('debe devolver un status 400 ya que el telefono contiene caractener diferentes a numeros', (done) => {
                    const usuario = {
                        email: "correotest@test.com",
                        username: "test Gallego",
                        password: "secreto1",
                        confirm_password: "secreto1",
                        telefono: "313992a349",
                        direccion: [{ "direccion": "direccion prueba" }]
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.should.be.a('object');
                            done();
                        });
                });


            });

            describe('Errores username', () => {
                it('debe devolver un status 400 ya que el usuario no puede estar vacio', (done) => {
                    const usuario = {
                        email: "correotest@test.com",
                        username: "",
                        password: "secreto1",
                        confirm_password: "secreto1",
                        telefono: "3139923",
                        direccion: [{ "direccion": "direccion prueba" }]
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.should.be.a('object');
                            done();
                        });
                });

                it('debe devolver un status 400 ya que el usuario debe tener una cantidad minima de 5 caracteres', (done) => {
                    const usuario = {
                        email: "correotest@test.com",
                        username: "NEL",
                        password: "secreto1",
                        confirm_password: "secreto1",
                        telefono: "313992312349",
                        direccion: [{ "direccion": "direccion prueba" }]
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.should.be.a('object');
                            done();
                        });
                });

                it('debe devolver un status 400 ya que el usuario no puede contener una cantidad maxima a 30 caracteres', (done) => {
                    const usuario = {
                        email: "correotest@test.com",
                        username: "asdfghjklñqwertyuiasdfghjklñqwertyuiasdfghjklñqwertyuiasdfghjklñqwertyuiasdfghjklñqwertyui",
                        password: "secreto1",
                        confirm_password: "secreto1",
                        telefono: "313992a349",
                        direccion: [{ "direccion": "direccion prueba" }]
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.should.be.a('object');
                            done();
                        });
                });
            });

            describe('Errores en password', () => {
                it('debe devolver un status 400 ya que la password debe contener minimo 8 caracteres', (done) => {
                    const usuario = {
                        email: "correotest@test.com",
                        username: "usuario test",
                        password: "12345",
                        confirm_password: "12345",
                        telefono: "3139923453",
                        direccion: [{ "direccion": "direccion prueba" }]
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.should.be.a('object');
                            done();
                        });
                });

                it('debe devolver un status 400 ya que la password contiene caracteres no permitidos', (done) => {
                    const usuario = {
                        email: "correotest@test.com",
                        username: "usuario test",
                        password: "*?contrasenasegura?^",
                        confirm_password: "*?contrasenasegura?^",
                        telefono: "32139923123",
                        direccion: [{ "direccion": "direccion prueba" }]
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.should.be.a('object');
                            done();
                        });
                });

                it('debe devolver un status 400 ya que las passwords no coinciden', (done) => {
                    const usuario = {
                        email: "correotest@test.com",
                        username: "usuario test",
                        password: "secreto123",
                        confirm_password: "secretito123",
                        telefono: "3139921349",
                        direccion: [{ "direccion": "direccion prueba" }]
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.should.be.a('object');
                            done();
                        });
                });

                it('debe devolver un status 400 ya que las password no pueden contener más de 64 caracteres', (done) => {
                    const usuario = {
                        email: "correotest@test.com",
                        username: "usuario test",
                        password: "secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123",
                        confirm_password: "secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123secreto123",
                        telefono: "3139923491",
                        direccion: [{ "direccion": "direccion prueba" }]
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.should.be.a('object');
                            done();
                        });
                });
            });

            describe('Errores en direccion', () => {
                it('debe devolver un status 400 ya que no se ingresa ninguna direccion', (done) => {
                    const usuario = {
                        email: "correotest@test.com",
                        username: "usuario test",
                        password: "secreto123",
                        confirm_password: "secreto123",
                        telefono: "3139923134",
                        direccion: [{}]
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.should.be.a('object');
                            done();
                        });
                });

                it('debe devolver un status 400 ya que la forma de ingresar la direccion es incorrecta', (done) => {
                    const usuario = {
                        email: "correotest@test.com",
                        username: "usuario test",
                        password: "secreto123",
                        confirm_password: "secreto123",
                        telefono: "3139923134",
                        direccion: "calle test #123-123"
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.should.be.a('object');
                            done();
                        });
                });

                it('debe devolver un status 400 ya que no se ingresa ninguna direccion', (done) => {
                    const usuario = {
                        email: "correotest@test.com",
                        username: "usuario test",
                        password: "secreto123",
                        confirm_password: "secreto123",
                        telefono: "3139923134",
                        direccion: []
                    }
                    chai.request(app)
                        .post('/usuarios/registrar')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.should.be.a('object');
                            done();
                        });
                });

            });

        });

    });

});