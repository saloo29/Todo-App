import jwt from "jsonwebtoken";

const auth = function(req, res, next) {
  const token = req.headers.authorization;
  const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

  if(!token) {
    return res.status(401).json({
      message: "Token must be provided"
    })
  }

  if(decodedUser) {
    req.userId = decodedUser.id;
    next();
  } else {
    return res.status(400).json({
      message: "User doest not exists"
    })
  }
}

export default auth;