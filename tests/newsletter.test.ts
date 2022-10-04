import { test, expect, Page } from '@playwright/test';
import moment from 'moment';
import MailSlurp from "mailslurp-client";

const EMAIL_ADDRESS = "d425d314-dff5-4a53-a310-6a7f8402613e@mailslurp.com";
const INBOX_ID = "d425d314-dff5-4a53-a310-6a7f8402613e";
const apiKey = "8f875e17532b7858a982f37f8d3f118f146f7574f5baf842a4b2470b1cd45470";
const mailslurp = new MailSlurp({ apiKey });
const today = new Date();
const twoMonthsFromToday = addMonths(2);

test.beforeEach(async ({ page }) => {
  await mailslurp.emailController.deleteAllEmails();
  await page.goto('http://qa-recruitment-newsletter.s3-website-eu-west-1.amazonaws.com/');
  
});

test.describe('test subscription to the newsletter', () => {
  test('fills the form and verifies received email', async ({ page }) => {
    await page.locator('id=newsletter_email').type(EMAIL_ADDRESS);
    await page.locator('id=newsletter_name').type("Piotr");
    await page.locator('id=newsletter_surname').type("Test");
    await page.locator('id=newsletter_newsType').click();
    await page.locator('[role="option"]', { hasText: 'IT' }).click();

    await selectStartDateOnDatePicker(page, today);
    await selectEndtDateOnDatePicker(page, twoMonthsFromToday);

    await page.locator('[value="male"]').click();
    await page.locator('id=newsletter_agreement').click();
    await page.locator('button', { hasText: 'Submit' }).click();

    await expect(page.locator('.ant-modal-confirm-title')).toHaveText('Successfully added to newsletter');

    const email = await mailslurp.waitForLatestEmail(INBOX_ID);

    console.log(formatStringToOneLine(email.body));

    expect(formatStringToOneLine(email.body)).toBe(`Hello Piotr Test, you have been signed to "it". You will get your first newsletter beginning ${formatDate(today)}. Your subscription will be activated until ${formatDate(twoMonthsFromToday)}.`);
    expect(email.subject).toBe('You have been signed to it newsletter');
    expect(email.from).toBe('tsh.test.qa@gmail.com');
    expect(email.inboxId).toBe('d425d314-dff5-4a53-a310-6a7f8402613e');
  });
});

async function selectStartDateOnDatePicker(page: Page, date: Date) {
  await page.locator('id=newsletter_startDate').click();
  const currentMonthAndYearSelected = page.locator('.ant-calendar-my-select >> nth=0');
  const prevMonthButton = page.locator('.ant-calendar-prev-month-btn >> nth=0');
  const nextMonthButton = page.locator('.ant-calendar-next-month-btn >> nth=0');

  const monthToSelect: string = getDateInDatePickerFormat(date);
  const isCurrentMonthBeforeMonthToSelect: boolean = moment(monthToSelect, "MMMM YYYY").isBefore();

  while (await currentMonthAndYearSelected.textContent() != monthToSelect) {
    if (isCurrentMonthBeforeMonthToSelect) {
      await prevMonthButton.click();
    } else {
      await nextMonthButton.click();
    }
  }
  await page.locator(`td[title="${getDateInDatePickerTitleFormat(date)}"]`).click();
}

async function selectEndtDateOnDatePicker(page: Page, date: Date) {
  await page.locator('id=newsletter_endDate').click();
  const currentMonthAndYearSelected = page.locator('.ant-calendar-my-select >> nth=1');
  const prevMonthButton = page.locator('.ant-calendar-prev-month-btn >> nth=1');
  const nextMonthButton = page.locator('.ant-calendar-next-month-btn >> nth=1');

  const monthToSelect: string = getDateInDatePickerFormat(date);
  const isCurrentMonthBeforeMonthToSelect: boolean = moment(monthToSelect, "MMMM YYYY").isBefore();

  while (await currentMonthAndYearSelected.textContent() != monthToSelect) {
    if (isCurrentMonthBeforeMonthToSelect) {
      await prevMonthButton.click();
    } else {
      await nextMonthButton.click();
    }
  }
  await page.locator(`[title="${getDateInDatePickerTitleFormat(date)}"] >> nth=1`).click();
}

function getDateInDatePickerTitleFormat(date:Date):string {
  const month = date.toLocaleString('default', { month: 'long' });
  const day =  date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

function getDateInDatePickerFormat(date:Date):string {
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${month}${year}`;
}

function addMonths(numOfMonths:number, date = new Date()) {
  date.setMonth(date.getMonth() + numOfMonths);
  return date;
}

function formatStringToOneLine(body:any):string {
  var line = '';
  var lines = body.split("\n");
  for(var i=0; i<lines.length; i++){
    line += " " + lines[i].trim();  
  }
  line = line.substring(1).trim();
  return line;
}

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

//Date in format dd/mm/yyy
function formatDate(date:Date):string {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}