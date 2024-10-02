export const mockRequest = (options = {}) => {
    return {
        params: options.params || {},
        body: options.body || {},
        query: options.query || {},
        headers: options.headers || {},
    };
};

export const mockResponse = () => {
    const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
        send: jest.fn(() => res),
    };
    return res;
};