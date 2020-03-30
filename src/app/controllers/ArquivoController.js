import Arquivo from '../models/Arquivo';

class ArquivoController {
  async criarArquivo(req, res) {
    const { originalname: nome, filename: caminho_arquivo } = req.file;

    const arquivo = await Arquivo.create({
      nome,
      caminho_arquivo,
    });

    return res.json(arquivo);
  }
}

export default new ArquivoController();
