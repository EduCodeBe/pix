const Boom = require('boom');
const JSONAPIError = require('jsonapi-serializer').Error;

const logger = require('../../infrastructure/logger');
const infraErrors = require('./../../infrastructure/errors');
const domainErrors = require('./../../domain/errors');
const errorSerializer = require('./../../infrastructure/serializers/jsonapi/error-serializer');
const usecases = require('../../domain/usecases');

const assessmentRepository = require('../../infrastructure/repositories/assessment-repository');
const answerRepository = require('../../infrastructure/repositories/answer-repository');
const correctionRepository = require('../../infrastructure/repositories/correction-repository');

const correctionSerializer = require('../../infrastructure/serializers/jsonapi/correction-serializer');

function _validateQueryParams(query) {
  return new Promise((resolve, reject) => {
    if (typeof query.answerId === 'undefined')
      reject(new infraErrors.MissingQueryParamError('answerId'));
    resolve();
  });
}

module.exports = {
  find(request, reply) {
    return _validateQueryParams(request.query)
      .then(() => {
        return usecases.getCorrectionForAnswerWhenAssessmentEnded({
          assessmentRepository,
          answerRepository,
          correctionRepository,
          answerId: request.query.answerId
        });
      })
      .then((correction) => Array.of(correction))
      .then((corrections) => reply(correctionSerializer.serialize(corrections)).code(200))
      .catch((error) => {
        if (error instanceof infraErrors.InfrastructureError) {
          return reply(errorSerializer.serialize(error)).code(error.code);
        }
        if (error instanceof domainErrors.NotFoundError) {
          const jsonApiError = new JSONAPIError({
            code: '404',
            title: 'Not Found Error',
            detail: error.message
          });
          return reply(jsonApiError).code(404);
        }
        if (error instanceof domainErrors.NotCompletedAssessmentError) {
          const jsonApiError = new JSONAPIError({
            code: '409',
            title: 'Assessment Not Completed Error',
            detail: error.message
          });
          return reply(jsonApiError).code(409);
        }

        logger.error(error);
        return reply(Boom.badImplementation(error));
      });
  }
};
