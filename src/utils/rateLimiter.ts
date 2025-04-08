import rateLimit from "express-rate-limit";

const uploadRateLimit = rateLimit({
	windowMs: 3600 * 1000,
	max: 50,
	message: "Too many request from this ip, try again in an hour",
})

export default uploadRateLimit;
