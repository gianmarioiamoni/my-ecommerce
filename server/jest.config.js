// export default {
//     testEnvironment: 'node',
//     transform: {}, // Disabilita i trasformatori come babel-jest
// };
// jest.config.js
export default {
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
};

