import { AccountingAPIClient } from '../AccountingAPIClient';
import * as puppeteer from 'puppeteer';
import { getPartnerAppConfig, getLoginConfig, setJestTimeout } from './helpers/integration.helpers';
import { IOAuth1State } from '../internals/OAuth1HttpClient';

setJestTimeout();

// We cannot run this and the other example in parallel as one de-auths the other
describe('Partner Example Tests using oauth_verifier', () => {
	const USERNAME_SELECTOR = '#email';
	const PASSWORD_SELECTOR = '#password';
	const LOGIN_BUTTON_SELECTOR = '#submitButton';
	const AUTH_BUTTON_SELECTOR = '#submit-button';
	const password_config = getLoginConfig();
	const config = getPartnerAppConfig();
	const accounting1 = new AccountingAPIClient(config);
	let authUrl: string;
	let page: any;
	let oauth_verifier: string;

	beforeAll(async () => {
		await accounting1.oauth1Client.getUnauthorisedRequestToken();
		authUrl = accounting1.oauth1Client.buildAuthoriseUrl();

		// Direct user to the authorise URL
		const browser = await puppeteer.launch({
			headless: true,
		});
		page = await browser.newPage();
		await page.goto(authUrl);

		// /user logs into Xero and Auths your app
		await page.click(USERNAME_SELECTOR);
		await page.keyboard.type(password_config.userName);
		await page.click(PASSWORD_SELECTOR);
		await page.keyboard.type(password_config.password);

		await page.click(LOGIN_BUTTON_SELECTOR);
		await page.waitForNavigation();
		await page.waitForNavigation();
		await page.click(AUTH_BUTTON_SELECTOR);

		await delay(2500);

		// The pin is usually sent to your callback url, in this example,
		// callback url is set to null
		oauth_verifier = await page.evaluate(() => {
			const PIN_SELECTOR = '#pin-input';
			const query = (document.querySelector(PIN_SELECTOR) as any).value;
			return query;
		});

		browser.close();
	});

	it('it returns the authorised url', async () => {
		expect(authUrl).toContain('xero.com');
	});

	it('it returns a PIN when the user allows access to the app', async () => {
		expect(oauth_verifier).not.toBeNull();
	});

	it('it can make a successful API call', async () => {
		await accounting1.oauth1Client.swapRequestTokenforAccessToken(oauth_verifier);
		const inv1 = await accounting1.organisation.get();
		expect(inv1.Status).toEqual('OK');
	});

	it('it can still make a successfull API call after refreshing the access token', async () => {
		await accounting1.oauth1Client.refreshAccessToken();
		const inv2 = await accounting1.organisation.get();
		expect(inv2.Status).toEqual('OK');
	});

	describe('OAuth State', () => {
		let state: IOAuth1State;
		let accounting2: AccountingAPIClient;
		it('it allows you to keep copy of the state in your own dadtastore', async () => {
			// Saves your state to your datastore
			state = await accounting1.oauth1Client.getState();
			expect(state.accessToken).not.toBeNull();
			expect(state.oauth_session_handle).not.toBeNull();
			expect(state.requestToken).not.toBeNull();

			// This is how you can check when you have to refresh your Access Token
			expect(typeof state.oauth_expires_at.getDate).toBe('function');
		});

		it('it allows you to restore a new instance of the client next time your user logs in', async () => {
			accounting2 = new AccountingAPIClient(config);
			// Get state from your data store
			accounting2.oauth1Client.setState(state);
			expect(accounting2.oauth1Client.getState()).toMatchObject(state);
		});

		it('it lets you make API calls using the restored state', async () => {
			const inv3 = await accounting2.organisation.get();
			expect(inv3.Status).toEqual('OK');
		});
	});
});

function delay(timeout: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, timeout);
	});
}