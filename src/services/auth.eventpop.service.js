const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const eventpopRepository = require('../repositories/auth.eventpop.repository.js');
const msgConstants = require('../constants/message.constant.js');
const roleConstants = require('../constants/role.constant.js');
const { HTTP_STATUS_CODE } = require('../constants/httpStatusCode.js');
const userRepository = require('../repositories/user.repository.js');

const createError = (message, statusCode, details) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	if (details) {
		error.details = details;
	}
	return error;
};

const getEventpopAccessToken = async (authCode) => {
	try {
		return await eventpopRepository.getAccessTokenFromCode(authCode);
	} catch {
		throw createError(
			msgConstants.ERROR_MESSAGE.INVALID_AUTH_CODE,
			HTTP_STATUS_CODE.UNAUTHORIZED,
			'Failed to exchange authorization code with Eventpop'
		);
	}
};

const getEventpopProfile = async (eventpopToken) => {
	try {
		return await eventpopRepository.getEventpopProfile(eventpopToken);
	} catch {
		throw createError(
			msgConstants.ERROR_MESSAGE.OAUTH_ERROR,
			HTTP_STATUS_CODE.BAD_GATEWAY,
			'Failed to fetch user profile from Eventpop'
		);
	}
};

const getOrganizerTickets = async (eventpopToken) => {
	try {
		return await eventpopRepository.getOrganizerTickets(eventpopToken);
	} catch {
		throw createError(
			msgConstants.ERROR_MESSAGE.OAUTH_ERROR,
			HTTP_STATUS_CODE.BAD_GATEWAY,
			'Failed to fetch organizer tickets from Eventpop'
		);
	}
};

const hasRegisteredTicket = (ticketsResponse) => {
	const tickets = Array.isArray(ticketsResponse?.tickets)
		? ticketsResponse.tickets
		: [];

	return tickets.some((ticket) => ticket?.event_id != null);
};

const extractEmail = (profile) => {
	return (
		profile?.email ||
		profile?.data?.email ||
		profile?.user?.email ||
		profile?.profile?.email ||
		null
	);
};

const extractName = (profile, fallbackEmail) => {
	return (
		profile?.name ||
		profile?.displayName ||
		profile?.fullName ||
		profile?.data?.name ||
		profile?.user?.name ||
		profile?.profile?.name ||
		fallbackEmail ||
		'Eventpop User'
	);
};

const eventpopLogin = async (authCode) => {
	const eventpopToken = await getEventpopAccessToken(authCode);
	const organizerTickets = await getOrganizerTickets(eventpopToken);

	if (!hasRegisteredTicket(organizerTickets)) {
		throw createError(
			'You have not registered for IT D-Day 2026 yet.',
			HTTP_STATUS_CODE.FORBIDDEN,
			'No valid ticket with event_id was found for this organizer.'
		);
	}

	const profile = await getEventpopProfile(eventpopToken);

	const email = extractEmail(profile);
	const name = extractName(profile, email);

	if (!email) {
		throw createError(
			msgConstants.ERROR_MESSAGE.OAUTH_ERROR,
			HTTP_STATUS_CODE.BAD_GATEWAY,
			'Eventpop profile did not include email'
		);
	}

	let user = await userRepository.findByEmail(email);

	if (!user) {
		user = await userRepository.createUser({
			email,
			studentId: null,
			name,
			role: roleConstants.ROLE.GUEST,
		});
	}

	const payload = {
		userId: user.id,
		email: user.email,
		studentId: user.studentId,
		name: user.name,
		role: user.role,
	};

	const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });

	return {
		accessToken,
		user: {
			userId: user.id,
			email: user.email,
			studentId: user.studentId,
			name: user.name,
			role: user.role,
		},
	};
};

module.exports = {
	eventpopLogin,
};
