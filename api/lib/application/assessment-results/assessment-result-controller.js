const Boom = require('boom');

const CompetenceMark = require('../../domain/models/CompetenceMark');
const AssessmentResult = require('../../domain/models/AssessmentResult');
const assessmentResultService = require('../../domain/services/assessment-result-service');

const assessmentResultsSerializer = require('../../infrastructure/serializers/jsonapi/assessment-result-serializer');

const { NotFoundError, AlreadyRatedAssessmentError, ValidationError } = require('../../domain/errors');

const logger = require('../../infrastructure/logger');

// TODO: Should be removed and replaced by a real serializer
function _deserializeResultsAdd(json) {
  const assessmentResult = new AssessmentResult({
    assessmentId: json['assessment-id'],
    emitter: json.emitter,
    status: json.status,
    commentJury: json['comment-jury'],
    commentOrga: json['comment-orga'],
    commentUser: json['comment-user'],
    level: json.level,
    pixScore: json['pix-score'],
  });

  const competenceMarks = json['competences-with-mark'].map((competenceMark) => {
    return new CompetenceMark({
      level: competenceMark.level,
      score: competenceMark.score,
      area_code: competenceMark['area-code'],
      competence_code: competenceMark['competence-code'],
    });
  });
  return { assessmentResult, competenceMarks };
}

module.exports = {

  save(request, reply) {
    const jsonResult = request.payload.data.attributes;
    const { assessmentResult, competenceMarks } = _deserializeResultsAdd(jsonResult);
    return assessmentResultService.save(assessmentResult, competenceMarks)
      .then(() => reply())
      .catch((error) => {
        if(error instanceof NotFoundError) {
          return reply(Boom.notFound(error));
        }

        if(error instanceof ValidationError) {
          return reply(Boom.badData(error));
        }

        logger.error(error);

        reply(Boom.badImplementation(error));
      });
  },

  evaluate(request, reply) {
    const assessmentRating = assessmentResultsSerializer.deserialize(request.payload);

    return assessmentResultService.evaluateFromAssessmentId(assessmentRating.assessmentId)
      .then(() => {
        reply();
      })
      .catch((error) => {
        if(error instanceof NotFoundError) {
          return reply(Boom.notFound(error));
        } else if (error instanceof AlreadyRatedAssessmentError) {
          return reply();
        }

        logger.error(error);

        reply(Boom.badImplementation(error));
      });
  }

};
