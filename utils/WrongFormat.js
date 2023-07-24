class WrongFormat extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 456;
  }
}

module.exports = WrongFormat;
