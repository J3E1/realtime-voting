import { Router } from 'express';
import { addWords, createTopic, getTopTopics } from '../controller/topic';

const router = Router();

// Route to get top topics
router.route('/topics').post(createTopic).get(getTopTopics);

// Route to add words to topic
router.route('/topics/:name').patch(addWords);

export default router;
