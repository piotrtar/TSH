import { Locator, Page } from "@playwright/test";
import { getDateInDatePickerTitleFormat, getDateInDatePickerValueFormat } from "../helpers/dateUtils";

export default class NewsletterSubscriptionPage {

    page: Page;
    emailInputField: Locator;
    nameInputField: Locator;
    surnameInputField: Locator;
    newsletterTypeDropdown: Locator;
    newsletterTypeOption: Locator;
    startDatePicker: Locator;
    startDatePickerValue: Locator;
    endDatePickerValue: Locator;
    endDatePicker: Locator;
    nextMonthButton: Locator;
    startDateInputField: Locator;
    endDateInputField: Locator;
    agreementCheckBox: Locator;
    submitButton: Locator;
    closeDatePickerButton: Locator;
    todayButton: Locator;
    agreementHyperlink: Locator;
    successfulSubmitModalTitle: Locator;
    emailValidationMessage: Locator;
    nameValidationMessage: Locator;
    surnameValidationMessage: Locator;
    newsletterTypeValidationMessage: Locator;
    startDateValidationMessage: Locator;
    termsAndConditionsValidationMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.emailInputField = page.locator('id=newsletter_email');
        this.nameInputField = page.locator('id=newsletter_name');
        this.surnameInputField = page.locator('id=newsletter_surname');
        this.newsletterTypeDropdown = page.locator('id=newsletter_newsType');
        this.newsletterTypeOption = page.locator('.ant-select-dropdown-menu-item');
        this.startDatePicker = page.locator('id=newsletter_startDate');
        this.startDatePickerValue = page.locator('.ant-calendar-picker-input >> nth=0');
        this.endDatePickerValue = page.locator('.ant-calendar-picker-input >> nth=1');
        this.endDatePicker = page.locator('id=newsletter_endDate');
        this.nextMonthButton = page.locator('.ant-calendar-next-month-btn >> nth=1');
        this.startDateInputField = page.locator('.ant-calendar-input');
        this.endDateInputField = page.locator('.ant-calendar-input >> nth=1');
        this.agreementCheckBox = page.locator('id=newsletter_agreement');
        this.submitButton = page.locator('[type="submit"]');
        this.closeDatePickerButton = page.locator('[data-icon="close-circle"]');
        this.todayButton = page.locator('.ant-calendar-today-btn');
        this.agreementHyperlink = page.locator('text=agreement');
        this.successfulSubmitModalTitle = page.locator('.ant-modal-confirm-title');
        this.emailValidationMessage = page.locator('text=/.*The "E-mail" field is required!.*/');
        this.nameValidationMessage = page.locator('text=/.*The "First name" field is required!.*/');
        this.surnameValidationMessage = page.locator('text=/.*The "Surname" field is required!.*/');
        this.newsletterTypeValidationMessage = page.locator('text=/.*The "newsletter type" field is required!.*/');
        this.startDateValidationMessage = page.locator('text=/.*The "Start date" field is required!.*/');
        this.termsAndConditionsValidationMessage = page.locator('text=/.*Accepting terms and condition is required!.*/');
    }

    async enterEmail(email: string) {
        await this.emailInputField.type(email);
    }

    async getEmailText(): Promise<string | null> {
        return await this.emailInputField.textContent();
    }
    
    async enterName(name: string) {
        await this.nameInputField.type(name);
    }

    async getNameText(): Promise<string | null> {
        return await this.nameInputField.textContent();
    }
    
    async enterSurname(surname: string) {
        await this.surnameInputField.type(surname);
    }

    async getSurnameText(): Promise<string | null> {
        return await this.surnameInputField.textContent();
    }
    
    async selectType(type: string) {
        await this.newsletterTypeDropdown.click();
        await this.page.locator('[role="option"]', { hasText: type }).click();
    }

    async selectStartDateByClicking(startDate: Date) {
        await this.startDatePicker.click();
        await this.page.locator(`td[title="${getDateInDatePickerTitleFormat(startDate)}"]`).click();
    }

    async getStartDateText(): Promise<string> {
        return await this.startDatePickerValue.inputValue();
    }

    async isDateDisabled(date: Date): Promise<string | null> {
        const dateElement = this.page.locator(`td[title="${getDateInDatePickerTitleFormat(date)}"] > div`);
		return await dateElement.getAttribute('aria-disabled');
    }
    
    async selectEndDateByClicking(endDate: Date) {
        await this.endDatePicker.click();
        await this.nextMonthButton.click();
        await this.page.locator(`td[title="${getDateInDatePickerTitleFormat(endDate)}"]`).click();
    }

    async getEndDateText(): Promise<string> {
        return await this.endDatePickerValue.inputValue();
    }

    async selectStartDateByTyping(startDate: Date) {
        await this.startDatePicker.click();
        await this.startDateInputField.type(getDateInDatePickerValueFormat(startDate));
        await this.page.keyboard.press('Enter');
    }
    
    async selectEndDateByTyping(endDate: Date) {
        await this.endDatePicker.click();
        await this.endDateInputField.type(getDateInDatePickerValueFormat(endDate));
        await this.page.keyboard.press('Enter');
    }

    async clickOnTodayButton() {
        await this.todayButton.click();
    }

    async selectSex(sex: string) {
        await this.page.locator(`[value=${sex}]`).click();
    }

    async isSexSelected(sex: string): Promise<boolean> {
        return await this.page.locator(`[value="${sex}"]`).isChecked()
    }
    
    async clickAgreement() {
        await this.agreementCheckBox.click();
    }

    async isAgreementChecked(): Promise<boolean> {
        return await this.agreementCheckBox.isChecked();
    }

    async clickOnAgreementHyperlink() {
        await this.agreementHyperlink.click();
    }
    
    async clickSubmitButton() {
        await this.submitButton.click();
    }

    async getSuccessfulSubmitModalTitle():Promise<string | null> {
        return await this.successfulSubmitModalTitle.textContent();
    }

    async isEmailValidationMessageVisible(): Promise<boolean> {
        return await this.emailValidationMessage.isVisible();
    }
    
    async isNameValidationMessageVisible(): Promise<boolean> {
        return await this.nameValidationMessage.isVisible();
    }
    
    async isSurnameValidationMessageVisible(): Promise<boolean> {
        return await this.surnameValidationMessage.isVisible();
    }
    
    async isNewsletterTypeValidationMessageVisible(): Promise<boolean> {
        return await this.newsletterTypeValidationMessage.isVisible();
    }
    
    async isStartDateValidationMessageVisible(): Promise<boolean> {
        return await this.startDateValidationMessage.isVisible();
    }
    
    async isTermsAndConditionsValidationMessageVisible(): Promise<boolean> {
        return await this.termsAndConditionsValidationMessage.isVisible();
    }
}