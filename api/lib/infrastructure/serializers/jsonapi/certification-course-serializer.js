const { Serializer } = require('jsonapi-serializer');
const CertificationCourse = require('../../../domain/models/CertificationCourse');

const { WrongDateFormatError } = require('../../../domain/errors');
const moment = require('moment-timezone');

module.exports = {

  serialize(certificationCourse) {

    return new Serializer('course', {
      attributes: ['userId', 'assessment', 'type', 'nbChallenges'],
      assessment: {
        ref: 'id',
      },
      transform(record) {
        record.userId = record.userId.toString();
        record.type = 'CERTIFICATION';
        return record;
      }
    }).serialize(certificationCourse);
  },

  serializeResult(certificationCourseResult) {
    return new Serializer('results', {
      attributes: [
        'certificationId',
        'assessmentId',
        'level',
        'pixScore',
        'createdAt',
        'resultCreatedAt',
        'status',
        'completedAt',
        'emitter',
        'commentJury',
        'commentOrga',
        'commentUser',
        'competencesWithMark',
        'firstName',
        'lastName',
        'birthdate',
        'birthplace',
        'sessionId']
    }).serialize(certificationCourseResult);
  },

  deserialize(json) {
    if (!moment(json.data.attributes.birthdate, 'DD/MM/YYYY').isValid()) {
      throw new WrongDateFormatError();
    }

    return new CertificationCourse({
      id: json.data.id,
      createdAt: json.data.attributes.createdAt,
      updatedAt: json.data.attributes.updatedAt,
      userId: json.data.attributes.userId,
      completedAt: json.data.attributes.completedAt,
      firstName: json.data.attributes.firstName,
      lastName: json.data.attributes.lastName,
      birthdate: moment(json.data.attributes.birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      birthplace: json.data.attributes.birthplace,
    });
  }
};
