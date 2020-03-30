import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        telefone: Sequelize.STRING,
        hash_da_senha: Sequelize.STRING,
        senha: Sequelize.VIRTUAL,
      },
      { sequelize }
    );
    this.addHook('beforeSave', async (usuario) => {
      if (usuario.senha) {
        usuario.hash_da_senha = await bcrypt.hash(usuario.senha, 8);
      }
    });
    return this;
  }

  compararSenhas(senha) {
    return bcrypt.compare(senha, this.hash_da_senha);
  }

  static associate(models) {
    this.belongsTo(models.Arquivo, { foreignKey: 'avatar_id', as: 'avatar' });
  }
}

export default Usuario;
