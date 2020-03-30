import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      cpf: Yup.string().min(11).max(14),
      telefone: Yup.string(),
      endereco: Yup.string(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (error) {
    return res.status(400).json({ error: 'Dados incorretos' });
  }
};
