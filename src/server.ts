import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolver';
import { createConnection } from 'typeorm';
import { handleRefreshToken } from './controllers/main';

(async () => {
	const app = express();
	app.use(cors());
	app.use(cookieParser());

	let tries = 5;
	try {
		await createConnection();
	} catch(error) {
		tries -= 1;
		console.log(`tries left: ${tries}`);
		await new Promise((res) => setTimeout(res, 5000))
	}

	app.get('/', (_req, res, _next) => {
		res.send('hellooooooooo there! Open the /graphql route for more');
	});

	app.post('/refresh_token', handleRefreshToken);

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver],
		}),
		context: ({ req, res }) => ({ req, res }),
	});
	apolloServer.applyMiddleware({ app, cors: false });

	app.listen(3001, () => {
		console.log('server listening on port 3001...');
	});
})();
