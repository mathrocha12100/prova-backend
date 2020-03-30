import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      telefone: Yup.string(),
      senhaAntiga: Yup.string(),
      senha: Yup.string()
        .min(6)
        .when('senhaAntiga', (senhaAntiga, field) =>
          senhaAntiga ? field.required() : field
        ),
      confirmarSenha: Yup.string()
        .min(6)
        .when('senha', (senha, field) => (senha ? field.required() : field)),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (error) {
    return res.status(400).json({ error: 'Dados incorretos' });
  }
};
