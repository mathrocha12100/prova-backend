import { Router } from 'express';
import multer from 'multer';

import UsuarioController from './app/controllers/UsuarioController';
import ClienteController from './app/controllers/ClienteController';
import SessaoController from './app/controllers/SessaoController';
import ArquivoController from './app/controllers/ArquivoController';

import validarCriacaoUsuario from './app/validators/CriarUsuario';
import validarAtualizacaoUsuario from './app/validators/AtualizarUsuario';
import validarCriacaoSessao from './app/validators/CriarSessao';
import validarCriacaoCliente from './app/validators/CriarCliente';
import validarAtualizacaoCliente from './app/validators/AtualizarCliente';

import authMiddleware from './app/middlewares/authMiddleware';

import multerConfig from './config/multerConfig';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/usuarios', validarCriacaoUsuario, UsuarioController.criarUsuario);
routes.post('/sessao', validarCriacaoSessao, SessaoController.gerarToken);
routes.use(authMiddleware);

routes.post(
  '/arquivos',
  upload.single('arquivo'),
  ArquivoController.criarArquivo
);

routes.put(
  '/usuarios',
  validarAtualizacaoUsuario,
  UsuarioController.atualizarUsuario
);
routes.get('/usuarios', UsuarioController.listarUsuarios);
routes.get('/usuarios/buscarUm', UsuarioController.buscarUsuario);

routes.post('/clientes', validarCriacaoCliente, ClienteController.criarCliente);
routes.put(
  '/clientes/:clienteId',
  validarAtualizacaoCliente,
  ClienteController.atualizarCliente
);
routes.get('/clientes', ClienteController.listarClientes);
routes.delete('/clientes/:clienteId', ClienteController.deletarCliente);

routes.get('/clientes/buscarUm', ClienteController.buscarCliente);

export default routes;
