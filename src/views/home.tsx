import { Handler } from "hono";
import type { FC } from "hono/jsx";
const Home: FC = () => {
	return (
		<div
			style={{
				textAlign: "center",
				padding: "20px",
				fontFamily: "monospace, Arial, sans-serif",
			}}
		>
			<h1>API for QuickEdit Table</h1>
			<p>
				For detailed information on the API, please refer to the&nbsp;
				<a href="https://www.postman.com/avionics-cosmologist-66357096/workspace/projects/collection/18181762-fc2d0260-beb7-4c52-a41d-948314171fa5?action=share&creator=18181762">
					API documentation.
				</a>
			</p>
			{/* for frontend and github */}
			<p>
				Explore the frontend interface on&nbsp;
				<a href="https://quick-edit.vercel.app/">Vercel</a> and access the
				source code on&nbsp;
				<a href="https://github.com/probir-sarkar/QuickEdit-backend">GitHub</a>.
			</p>
		</div>
	);
};

const getHome: Handler = async (c) => {
	return c.html(<Home />);
};
export default getHome;
