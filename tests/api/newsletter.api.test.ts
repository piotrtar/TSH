import { expect, test } from "@playwright/test";
const API_URL = 'https://or7z5u0jc0.execute-api.eu-west-1.amazonaws.com/prod/';
const EMAIL = "test@test.pl";
const NAME = "testName";
const NEWS_TYPE = 'it';

test('gets ok success status when proper request is sent', async ({ request }) => {
    const response = await request.post(API_URL, {
        data: {
            email: EMAIL,
            name: NAME,
            newsType: NEWS_TYPE,
            startDate: new Date().toJSON(),
            agreement: true
        }
    });
    expect(response.status()).toBe(200);
});

test('gets bad request and proper response message when request is sent with no email', async ({ request }) => {
    const response = await request.post(API_URL, {
        data: {
            name: NAME,
            newsType: NEWS_TYPE,
            startDate: new Date().toJSON(),
            agreement: true
        }
    });
    expect(response.status()).toBe(400);
    await response.body().then( b => {
        const body = JSON.parse(b.toString()); 
        expect(body[0]["message"]).toBe('"email" is required');
    })
});

test('gets bad request and proper response message when request is sent with no name', async ({ request }) => {
    const response = await request.post(API_URL, {
        data: {
            email: EMAIL,
            newsType: NEWS_TYPE,
            startDate: new Date().toJSON(),
            agreement: true
        }
    });
    expect(response.status()).toBe(400);
    await response.body().then( b => {
        const body = JSON.parse(b.toString()); 
        expect(body[0]["message"]).toBe('"name" is required');
    })
});

test('gets bad request and proper response message when request is sent with surname', async ({ request }) => {
    const response = await request.post(API_URL, {
        data: {
            email: EMAIL,
            name: NAME,
            surname: "surname",
            newsType: NEWS_TYPE,
            startDate: new Date().toJSON(),
            agreement: true
        }
    });
    expect(response.status()).toBe(400);
    await response.body().then(b => {
        const body = JSON.parse(b.toString());
        expect(body[0]["message"]).toBe('"surname" is not allowed');
    })
});

test('gets bad request with proper response message when request is sent with no news type', async ({ request }) => {
    const response = await request.post(API_URL, {
        data: {
            email: EMAIL,
            name: NAME,
            startDate: new Date().toJSON(),
            agreement: true
        }
    });
    expect(response.status()).toBe(400);
    await response.body().then(b => {
        const body = JSON.parse(b.toString());
        expect(body[0]["message"]).toBe('"newsType" is required');
    })
});

test('gets bad request with proper response message when request is sent with no start date', async ({ request }) => {
    const response = await request.post(API_URL, {
        data: {
            email: EMAIL,
            name: NAME,
            newsType: NEWS_TYPE,
            agreement: true
        }
    });
    expect(response.status()).toBe(400);
    await response.body().then(b => {
        const body = JSON.parse(b.toString());
        expect(body[0]["message"]).toBe('"startDate" is required');
    })
});

test('gets bad request with proper response message when request is sent with agreement as false', async ({ request }) => {
    const response = await request.post(API_URL, {
        data: {
            email: EMAIL,
            name: NAME,
            newsType: NEWS_TYPE,
            startDate: new Date().toJSON(),
            agreement: false
        }
    });
    expect(response.status()).toBe(400);
    await response.body().then(b => {
        const body = JSON.parse(b.toString());
        expect(body[0]["message"]).toBe('"agreement" must be [true]');
    })
});