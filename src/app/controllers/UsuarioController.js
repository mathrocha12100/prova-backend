import Usuario from '../models/Usuario';
import Arquivo from '../models/Arquivo';

class UsuarioController {
  async listarUsuarios(req, res) {
    const { page = 1 } = req.query;
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nome', 'email', 'telefone'],
      include: [
        {
          model: Arquivo,
          as: 'avatar',
          attributes: ['id', 'caminho_arquivo', 'url'],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(usuarios);
  }

  async criarUsuario(req, res) {
    const { nome, email, telefone, senha } = req.body;

    const emailJaExiste = await Usuario.findOne({
      where: { email },
    });

    const nomeDeUsuarioJaExiste = await Usuario.findOne({
      where: { nome },
    });

    if (emailJaExiste) {
      return res.status(401).json({ error: 'Email já esta cadastrado' });
    }

    if (nomeDeUsuarioJaExiste) {
      return res.status(401).json({ error: 'Nome de Usuario já existe' });
    }

    await Usuario.create({
      nome,
      email,
      telefone,
      senha,
    });

    return res.json({
      nome,
      email,
      telefone,
    });
  }

  async atualizarUsuario(req, res) {
    const usuario = await Usuario.findByPk(req.userId, {
      include: [
        {
          model: Arquivo,
          as: 'avatar',
          attributes: ['id', 'caminho_arquivo', 'url'],
        },
      ],
    });

    const { senha, confirmarSenha, senhaAntiga } = req.body;

    if (senha) {
      if (senha !== confirmarSenha) {
        return res
          .status(400)
          .json({ error: 'A senha antiga e a nova não batem' });
      }
      if (!(await usuario.compararSenhas(senhaAntiga))) {
        return res.status(401).json({ error: 'Senha antiga incorreta!' });
      }
    }

    await usuario.update(req.body);

    const { avatar, telefone } = usuario;

    return res.json({ usuario: { avatar, telefone } });
  }

  async buscarUsuario(req, res) {
    const { nome } = req.query;

    if (!nome) {
      return res.status(400).json({ error: 'Dados invalidos' });
    }

    const usuario = await Usuario.findOne({
      where: { nome },
      attributes: ['id', 'nome', 'email', 'telefone'],
      include: [
        {
          model: Arquivo,
          as: 'avatar',
          attributes: ['id', 'caminho_arquivo', 'url'],
        },
      ],
    });

    if (!usuario) {
      return res.status(400).json({ error: 'Usuario não existe' });
    }

    return res.json(usuario);
  }
}

export default new UsuarioController();
