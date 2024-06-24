import connectDB from './config/db';
import express, { json, urlencoded, static as static_ } from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'node:http';
import router from './routes/topic';
import Topic from './model/topic';
import path from 'node:path';

// Connect to DB
connectDB();

// Types
declare global {
	namespace Express {
		interface Request {
			io: Server;
		}
	}
}

// App config
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
		credentials: true,
	},
});
// Cors
const corsOptions = {
	// origin: '*',
};

// Middleware
app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: false }));

// Socket.io connection handler
const changeStream = Topic.watch();
io.on('connection', socket => {
	console.log('A user connected');

	socket.on('join-room', async (room: string) => {
		console.log('User joined room:', room);
		await socket.join(room);
		console.log(`Socket ${socket.id} joined room ${room}`);

		// Fetch and send the current words for the topic
		const topic = await Topic.findOne({ name: room });
		if (topic) {
			const filteredWords = topic.words.map(({ text, value }) => ({
				text,
				value,
			}));
			socket.emit('topicInitial', filteredWords);
		} else {
			socket.emit('topicInitial', 'topic-not-found');
		}
	});

	socket.on('disconnect', async () => {
		console.log('User disconnected');
		const rooms = Array.from(socket.rooms);
		rooms.forEach(async room => {
			socket.leave(room);
		});
		console.log(`Socket ${socket.id} left all rooms`);
	});
});

changeStream.on('change', async event => {
	if (event.operationType === 'update') {
		const topic = await Topic.findById(event.documentKey._id);

		if (topic) {
			console.log(`Emitting update to room ${topic.name}`);
			const filteredWords = topic.words.map(({ text, value }) => ({
				text,
				value,
			}));
			io.to(topic.name).emit('topicUpdated', filteredWords);
		}
	}
});

// Routes
app.use('/api', router);

if (process.env.NODE_ENV === 'production') {
	app.use(static_(path.join(__dirname, './dist')));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
	});
} else {
	app.get('/', (req, res) => res.send('Please set up to production'));
}

// 404 handler
app.use((req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
});

// Start server
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
