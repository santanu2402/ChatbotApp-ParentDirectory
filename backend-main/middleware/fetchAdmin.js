import jwt from 'jsonwebtoken';

const fetchadmin = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).send({ error: 'Authentication Failed' });
  }
  console.log("middleware called")
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = data.info;
    console.log(req.admin)
    next();
  } catch (err) {
    res.status(401).send({ error: 'Authentication Failed' });
  }
};

export default fetchadmin;