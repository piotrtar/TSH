import { expect, test } from "@playwright/test";
const apiUrl = 'https://or7z5u0jc0.execute-api.eu-west-1.amazonaws.com/prod/';
const email = "test@test.pl";
const name = "testName";
const newsType = 'it';

test('gets ok success status when proper request is sent', async ({ request }) => {
    const response = await request.post(apiUrl, {
        data: {
            email: email,
            name: name,
            newsType: newsType,
            startDate: new Date().toJSON(),
            agreement: true
        }
    });
    expect(response.status()).toBe(200);
});

test('gets bad request and proper response message when request is sent with no email', async ({ request }) => {
    const response = await request.post(apiUrl, {
        data: {
            name: name,
            newsType: newsType,
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
    const response = await request.post(apiUrl, {
        data: {
            email: email,
            newsType: newsType,
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
    const response = await request.post(apiUrl, {
        data: {
            email: email,
            name: name,
            surname: "surname",
            newsType: newsType,
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
    const response = await request.post(apiUrl, {
        data: {
            email: email,
            name: name,
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
    const response = await request.post(apiUrl, {
        data: {
            email: email,
            name: name,
            newsType: newsType,
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
    const response = await request.post(apiUrl, {
        data: {
            email: email,
            name: name,
            newsType: newsType,
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