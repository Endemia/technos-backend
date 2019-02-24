const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const { ApolloServer } = require('apollo-server-koa');
const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./graphQL/graphqlTypes');
const resolvers = require('./graphQL/graphqlResolvers');
const jwt = require('koa-jwt');

const app = new Koa();

app.use(bodyParser());
app.use(cors());

app.use(jwt({ secret: "SECRET", passthrough: true }));

app.use(async(ctx,next) => {
	try {
    	await next();
  	} catch (err) {
	    ctx.status = err.statusCode || err.status || 500;
	    ctx.body = {
	    	message: err.message
	    };
  	}
})

const server = new ApolloServer({
	schema: makeExecutableSchema({ typeDefs, resolvers }),
	context: ({ ctx: { state: user } }) => ({
    	user,
  	}),
});
server.applyMiddleware({ app });

app.listen(8080, () => {
  console.log('App listening on port 8080!')
});
