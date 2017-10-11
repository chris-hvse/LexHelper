class ValidationError extends Error {};
class MissingResponseError extends Error {};
class MissingActionError extends Error {};
class TestError extends Error {};

module.exports = {
    ValidationError,
    MissingResponseError,
    MissingActionError,
    TestError
};