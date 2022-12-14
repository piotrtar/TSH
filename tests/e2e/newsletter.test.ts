import { test, expect } from '@playwright/test';
import MailSlurp from "mailslurp-client";
import NewsletterSubscriptionPage from '../../pages/newsletterSubscriptionPage';
import { addDays, addMonths, formatDate, getDateInDatePickerValueFormat } from '../../helpers/dateUtils';

const EMAIL_ADDRESS: string = "d425d314-dff5-4a53-a310-6a7f8402613e@mailslurp.com";
const NAME: string = "Piotr";
const SURNAME: string = "Test"
const INBOX_ID: string = "d425d314-dff5-4a53-a310-6a7f8402613e";
const TODAY: Date = new Date();
const YESTERDAY: Date = addDays(-1);
const ONE_MONTH_FROM_TODAY: Date = addMonths(1);
const INCORRECT_EMAIL_ADDRESSES: string[] = ["test", "test@", "test@test", "test@test.c"]
let apiKey: string
let mailslurp: MailSlurp

test.beforeAll(async () => {
	apiKey = process.env.API_KEY!;
	expect(apiKey).toBeDefined();
	mailslurp = new MailSlurp({ apiKey });
});

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('test subscription to the newsletter', () => {
	test('shows missing required field error messages under required fields when clicking submit button on empty form', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.clickSubmitButton()
		expect(await newsletterSubscription.isEmailValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isNameValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isSurnameValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isNewsletterTypeValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isStartDateValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isTermsAndConditionsValidationMessageVisible()).toBeTruthy();
	});

	// It fails because I interpret it as a bug
	test('shows missing required field error messages under required fields when filling them, clearing them and clicking submit button on empty form', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.enterEmail(EMAIL_ADDRESS);
		await newsletterSubscription.enterName(NAME)
		await newsletterSubscription.enterSurname(SURNAME);
		await newsletterSubscription.selectStartDateByClicking(TODAY);
		await newsletterSubscription.clickAgreement();
		await newsletterSubscription.emailInputField.fill('');
		await newsletterSubscription.nameInputField.fill('');
		await newsletterSubscription.surnameInputField.fill('');
		await newsletterSubscription.startDatePicker.hover();
		await newsletterSubscription.closeDatePickerButton.click();
		await newsletterSubscription.clickAgreement();
		await newsletterSubscription.clickSubmitButton();
		expect(await newsletterSubscription.isEmailValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isNameValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isSurnameValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isStartDateValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isTermsAndConditionsValidationMessageVisible()).toBeTruthy();
	});

	test('shows missing required field error messages under required fields when clicking enter after clicking on "E-mail" field', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.emailInputField.click();
		await page.keyboard.press('Enter');
		expect(await newsletterSubscription.isEmailValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isNameValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isSurnameValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isNewsletterTypeValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isStartDateValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isTermsAndConditionsValidationMessageVisible()).toBeTruthy();
	});

	test('shows missing required field error messages under required fields when clicking enter after clicking on "First name" field', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.nameInputField.click();
		await page.keyboard.press('Enter');
		expect(await newsletterSubscription.isEmailValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isNameValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isSurnameValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isNewsletterTypeValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isStartDateValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isTermsAndConditionsValidationMessageVisible()).toBeTruthy();
	});

	test('shows missing required field error messages under required fields when clicking enter after clicking on "Surname" field', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.surnameInputField.click();
		await page.keyboard.press('Enter');
		expect(await newsletterSubscription.isEmailValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isNameValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isSurnameValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isNewsletterTypeValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isStartDateValidationMessageVisible()).toBeTruthy();
		expect(await newsletterSubscription.isTermsAndConditionsValidationMessageVisible()).toBeTruthy();
	});

	test('clears the form after page reload', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.enterEmail(EMAIL_ADDRESS);
		await newsletterSubscription.enterName(NAME);
		await newsletterSubscription.enterSurname(SURNAME);
		await newsletterSubscription.selectType('IT');
		await newsletterSubscription.selectStartDateByTyping(TODAY);
		await newsletterSubscription.selectEndDateByTyping(ONE_MONTH_FROM_TODAY);
		await newsletterSubscription.selectSex('male');
		await newsletterSubscription.clickAgreement();
		await page.reload();
		expect(await newsletterSubscription.getEmailText()).toBe('');
		expect(await newsletterSubscription.getNameText()).toBe('');
		expect(await newsletterSubscription.getSurnameText()).toBe('');
		expect(await newsletterSubscription.getStartDateText()).toBe('');
		expect(await newsletterSubscription.getEndDateText()).toBe('');
		expect(await newsletterSubscription.isSexSelected("male")).toBeFalsy();
		expect(await newsletterSubscription.isSexSelected("female")).toBeFalsy();
		expect(await newsletterSubscription.isAgreementChecked()).toBeFalsy();
	});

	INCORRECT_EMAIL_ADDRESSES.forEach(text => {
		test(`shows email field valiation message when provided with incorrect email address: ${text}`, async ({ page }) => {
			const newsletterSubscription = new NewsletterSubscriptionPage(page);
			await newsletterSubscription.enterEmail(text);
			await newsletterSubscription.clickSubmitButton();
			expect(await newsletterSubscription.isEmailValidationMessageVisible()).toBeTruthy();
		});
	})

	//It fails because I interpret it as a bug
	test('shows first name field valiation message when provided with space', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.enterName(' ');
		await newsletterSubscription.clickSubmitButton();
		expect(await newsletterSubscription.isNameValidationMessageVisible()).toBeTruthy();
	});

	//It fails because I interpret it as a bug
	test('shows surname field valiation message when provided with space', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.enterSurname(' ');
		await newsletterSubscription.clickSubmitButton();
		expect(await newsletterSubscription.isSurnameValidationMessageVisible()).toBeTruthy();
	});

	test('verifies if past date is not selectable when selecting dates by clicking on datepickers', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.startDatePicker.click();
		expect(await newsletterSubscription.isDateDisabled(YESTERDAY)).toBeTruthy();

	});

	test('automatically selects today date when typed past date in the date field', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.selectStartDateByTyping(YESTERDAY);
		await newsletterSubscription.selectEndDateByTyping(YESTERDAY);
		expect(await newsletterSubscription.getStartDateText()).toBe(getDateInDatePickerValueFormat(TODAY));
		expect(await newsletterSubscription.getEndDateText()).toBe(getDateInDatePickerValueFormat(TODAY));
	});

	test('clears the date after clicking on x button in the date field', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.selectStartDateByClicking(TODAY);
		await newsletterSubscription.startDatePicker.hover();
		await newsletterSubscription.closeDatePickerButton.click();
		expect(await newsletterSubscription.getStartDateText()).toBe('');
	});

	test('selects today date after clicking today button on unwrapped datepicker', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.startDatePicker.click();
		await newsletterSubscription.clickOnTodayButton();
		expect(await newsletterSubscription.getStartDateText()).toBe(getDateInDatePickerValueFormat(TODAY));
	});

	test('takes to new page when clicking on agreement hyperlink', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.clickOnAgreementHyperlink();
		expect(page.url()).toBe('https://www.google.pl/');
	});

	test('shows 3 options with proper values after unwrapping newsletter type list', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.newsletterTypeDropdown.click()
		expect(newsletterSubscription.newsletterTypeOption).toHaveCount(3);
		expect(await newsletterSubscription.newsletterTypeOption.nth(0).textContent()).toBe('IT');
		expect(await newsletterSubscription.newsletterTypeOption.nth(1).textContent()).toBe('Industry');
		expect(await newsletterSubscription.newsletterTypeOption.nth(2).textContent()).toBe('Medical');
	});

	test('fills the form with selecting dates by clicking on datepickers, submits it and verifies received email', async ({ page }) => {
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.enterEmail(EMAIL_ADDRESS);
		await newsletterSubscription.enterName(NAME);
		await newsletterSubscription.enterSurname(SURNAME);
		await newsletterSubscription.selectType('IT');
		await newsletterSubscription.selectStartDateByClicking(TODAY);
		await newsletterSubscription.selectEndDateByClicking(ONE_MONTH_FROM_TODAY);
		await newsletterSubscription.selectSex('male');
		await newsletterSubscription.clickAgreement();
		await newsletterSubscription.clickSubmitButton();
		expect(await newsletterSubscription.getSuccessfulSubmitModalTitle()).toBe('Successfully added to newsletter');
		const email = await mailslurp.waitForLatestEmail(INBOX_ID);
		expect(formatStringToOneLine(email.body)).toBe(`Hello Piotr Test, you have been signed to "it". You will get your first newsletter beginning ${formatDate(TODAY)}. Your subscription will be activated until ${formatDate(ONE_MONTH_FROM_TODAY)}.`);
		expect(email.subject).toBe('You have been signed to it newsletter');
		expect(email.from).toBe('tsh.test.qa@gmail.com');
		expect(email.inboxId).toBe(INBOX_ID);
	});

	// It fails because I interpret it as a bug
	test('fills the form with selecting dates by typing, submits it and verifies received email', async ({ page }) => {
		await mailslurp.emailController.deleteAllEmails();
		const newsletterSubscription = new NewsletterSubscriptionPage(page);
		await newsletterSubscription.enterEmail(EMAIL_ADDRESS);
		await newsletterSubscription.enterName(NAME);
		await newsletterSubscription.enterSurname(SURNAME);
		await newsletterSubscription.selectType('IT');
		await newsletterSubscription.selectStartDateByTyping(TODAY);
		await newsletterSubscription.selectEndDateByTyping(ONE_MONTH_FROM_TODAY);
		await newsletterSubscription.selectSex('male');
		await newsletterSubscription.clickAgreement();
		await newsletterSubscription.clickSubmitButton();
		expect(await newsletterSubscription.getSuccessfulSubmitModalTitle()).toBe('Successfully added to newsletter');
		const email = await mailslurp.waitForLatestEmail(INBOX_ID);
		expect(formatStringToOneLine(email.body)).toBe(`Hello Piotr Test, you have been signed to "it". You will get your first newsletter beginning ${formatDate(TODAY)}. Your subscription will be activated until ${formatDate(ONE_MONTH_FROM_TODAY)}.`);
		expect(email.subject).toBe('You have been signed to it newsletter');
		expect(email.from).toBe('tsh.test.qa@gmail.com');
		expect(email.inboxId).toBe(INBOX_ID);
	});
});

function formatStringToOneLine(body: any): string {
	var line = '';
	var lines = body.split("\n");
	for (var i = 0; i < lines.length; i++) {
		line += " " + lines[i].trim();
	}
	return line.trim();
}