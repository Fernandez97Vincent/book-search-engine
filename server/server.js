const express = require('express');
const { ApolloServer } = require('apollo-server-express')
const path = require('path');
const { authMiddleware } = require("./utils/auth")

const { typeDefs, resolvers } = require('./schemas');  
// typeDefs resolvers in ./schema
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
});

app.use(express.urlencoded({ extended: false}));
app.use(express.json())

if(process.env.NODE_ENV === 'production') {
    app.use(express.status(path.join(__dirname, '../client/build')))
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/'));
})

const startApolloServer = async(typeDefs, resolvers) => {
    await server.start()
    server.applyMiddleware({ app });

    db.once('open', () => {
        console.log(`API server running on port ${PORT}`)
        console.log(`Use GRAPHQL at http://localhost:${PORT}${server.graphqlPath}`)
    })
}


startApolloServer(typeDefs, resolvers);