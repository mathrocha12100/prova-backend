import {
  validate as validarCpf,
  format as formatarCpf,
} from 'gerador-validador-cpf';
import Cliente from '../models/Cliente';
import Arquivo from '../models/Arquivo';

class ClienteController {
  async listarClientes(req, res) {
    const { page = 1 } = req.query;
    const clientes = await Cliente.findAll({
      attributes: ['id', 'nome', 'cpf', 'endereco', 'telefone'],
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

    return res.json(clientes);
  }

  async criarCliente(req, res) {
    const { cpf, nome, endereco, telefone } = req.body;

    const clienteJaExiste = await Cliente.findOne({
      where: { cpf },
    });

    const cpfCaracteres = cpf.length;

    if (cpfCaracteres !== 11) {
      return res.status(400).json({ error: 'CPF INVALIDO' });
    }

    if (clienteJaExiste) {
      return res.status(401).json({ error: 'Cliente já existe' });
    }

    if (!validarCpf(formatarCpf(cpf))) {
      return res.status(400).json({ error: 'CPF Invalido' });
    }
    const cpfFormatado = formatarCpf(cpf);

    const cliente = await Cliente.create({
      nome,
      cpf: cpfFormatado,
      endereco,
      telefone,
    });

    return res.json(cliente);
  }

  async atualizarCliente(req, res) {
    const { cpf } = req.body;
    const { clienteId } = req.params;

    const cliente = await Cliente.findOne({
      where: { id: clienteId },
    });

    if (!cliente) {
      return res.status(400).json({ error: 'Cliente não existe!' });
    }

    if (cpf) {
      if (!validarCpf(formatarCpf(cpf))) {
        return res.status(400).json({ error: 'CPF Invalido' });
      }
    }

    const { nome, telefone, endereco, cpf: cpfUsuario } = await cliente.update(
      req.body
    );

    return res.json({
      nome,
      telefone,
      endereco,
      cpfUsuario,
    });
  }

  async deletarCliente(req, res) {
    const { clienteId } = req.params;

    const cliente = await Cliente.findByPk(clienteId);

    if (!cliente) {
      return res.status(400).json({ error: 'Cliente não existe!' });
    }

    cliente.destroy();

    return res.json({ message: 'Deletado com sucesso!' });
  }

  async buscarCliente(req, res) {
    const { cpf } = req.query;

    if (!cpf) {
      return res.status(400).json({ error: 'CPF Não informado' });
    }

    const cliente = await Cliente.findOne({
      where: { cpf },
    });

    if (!cliente) {
      return res.status(400).json({ error: 'Cliente não existe' });
    }

    const { id, nome, endereco, telefone, avatar_id } = cliente;

    return res.json({
      cliente: {
        id,
        nome,
        cpf,
        endereco,
        telefone,
        avatar_id,
      },
    });
  }
}

export default new ClienteController();
