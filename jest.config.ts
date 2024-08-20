module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.ts",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.ts"
  },

  setupFilesAfterEnv: ["@testing-library/jest-dom"]
};
