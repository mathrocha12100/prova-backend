import Sequelize, { Model } from 'sequelize';

class Arquivo extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        caminho_arquivo: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/arquivos/${this.caminho_arquivo}`;
          },
        },
      },
      { sequelize }
    );
    return this;
  }
}

export default Arquivo;
