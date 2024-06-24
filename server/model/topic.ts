import { Schema, model } from 'mongoose';

export interface ITopic {
	name: string;
	words: {
		text: string;
		value: number;
	}[];
}
const topicSchema = new Schema<ITopic>(
	{
		name: {
			type: String,
			required: true,
            unique: true,
		},
		words: [
			{
				text: {
					type: String,
					required: true,
				},
				value: {
					type: Number,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

export default model<ITopic>('Topic', topicSchema);
