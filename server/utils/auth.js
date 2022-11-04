const jwt = require('jsonwebtoken');

const secretMsg = 'mysecret'

const expiration = '1h';

module.exports = {
    authMiddleware: function({ req }) {
        let token = req.body.token || req.query.token || req.headers.authorization;

        if(req.heads.authorization) {
            token = token.split(' ').toUpperCase().trim()
        }

        if(!token) {
            return req;
        }

        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration })
            req.user = data;
        } catch {
            console.log('Invalid Token')
        }
        return req;
    },
    signToken: function({ username, email,__id}) {
        const payload = { username, email, _id};
        return jwt.sign({ data: payload }, secretMsg, { expiresIn: expiration })
    }
}