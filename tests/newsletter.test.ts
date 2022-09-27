import { test, expect } from '@playwright/test';
import MailSlurp from "mailslurp-client";

const EMAIL_ADDRESS = "d425d314-dff5-4a53-a310-6a7f8402613e@mailslurp.com";
const INBOX_ID = "d425d314-dff5-4a53-a310-6a7f8402613e";
const apiKey = "8f875e17532b7858a982f37f8d3f118f146f7574f5baf842a4b2470b1cd45470";
const mailslurp = new MailSlurp({ apiKey });

test.beforeAll(async ({ page }) => {
  // const apiKey = process.env.API_KEY;
  expect(apiKey).toBeDefined();
});

test.beforeEach(async ({ page }) => {
  mailslurp.emailController.deleteAllEmails;
  await page.goto('http://qa-recruitment-newsletter.s3-website-eu-west-1.amazonaws.com/');
});

test.describe('test subscription to the newsletter', () => {
  test('fills the form and verifies received email', async ({ page }) => {
    page.locator('id=newsletter_email').type(EMAIL_ADDRESS);
    page.locator('id=newsletter_name').type("Piotr");
    page.locator('id=newsletter_surname').type("Test");
    page.locator('id=newsletter_newsType').click();
    page.locator('[role="option"]', { hasText: 'IT' }).click();
    page.locator('id=newsletter_startDate >> input').type("2022-09-17");
    page.locator('id=newsletter_endDate >> input').type("2022-10-18");
    page.locator('[value="male"]').click();
    page.locator('id=newsletter_agreement').click();
    page.locator('button', { hasText: 'Submit' }).click();

    const email = await mailslurp.waitForLatestEmail(INBOX_ID);
    expect(email.body).toBe('Hello Piotr Test, you have been signed to "it". You will get your first newsletter beginning 17/09/2022. Your subscription will be activated until 17/10/2022.');
    expect(email.subject).toBe('You have been signed to it newsletter');
    expect(email.from).toBe('tsh.test.qa@gmail.com');
    expect(email.inboxId).toBe('d425d314-dff5-4a53-a310-6a7f8402613e');
    
  });
});

