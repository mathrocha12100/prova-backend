import jwt from 'jsonwebtoken';
import authConfig from '../../config/authConfig';
import Usuario from '../models/Usuario';
import Arquivo from '../models/Arquivo';

class SessaoController {
  async gerarToken(req, res) {
    const { nome, senha } = req.body;

    const usuario = await Usuario.findOne({
      where: { nome },
      include: [
        {
          model: Arquivo,
          as: 'avatar',
          attributes: ['id', 'caminho_arquivo', 'url'],
        },
      ],
    });

    if (!(await usuario.compararSenhas(senha))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const { email, telefone, id, avatar } = usuario;
    const { secret, expiresIn } = authConfig;
    return res.json({
      usuario: {
        nome,
        email,
        telefone,
        avatar,
      },

      token: jwt.sign({ id }, secret, {
        expiresIn,
      }),
    });
  }
}

export default new SessaoController();
